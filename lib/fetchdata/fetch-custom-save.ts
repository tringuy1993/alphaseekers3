import useSWR from 'swr';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';
import {
  AUTH_STORAGE_KEYS,
  SESSION_EXPIRED_ERROR_CODES,
  TRANSIENT_ERROR_CODES,
  getLoginUrlWithRedirect,
} from '@/lib/auth/config';

// import { saveData, getData } from '../database/database';
import { truncateVolumeTable, volumeTable } from '@/config/database-config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Handle session expiration by clearing state and redirecting to login
const handleSessionExpired = async () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.tenantInfo);
  await signOut(Auth);
  const currentPath = window.location.pathname;
  window.location.href = getLoginUrlWithRedirect(currentPath);
};

const axiosFetchSave = async (url, params = {}, options = {}) => {
  // getIdToken(true) forces a token refresh to prevent expired token errors
  let token = null;
  const MAX_RETRIES = 2;

  if (Auth.currentUser) {
    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        token = await Auth.currentUser.getIdToken(true);
        break; // success — exit retry loop
      } catch (tokenError: any) {
        const errorCode = tokenError?.code;

        // Session is permanently invalid — no point retrying
        if (SESSION_EXPIRED_ERROR_CODES.includes(errorCode)) {
          await handleSessionExpired();
          throw new Error('Session expired. Please sign in again.');
        }

        // Transient error — retry with backoff
        if (TRANSIENT_ERROR_CODES.includes(errorCode) && attempt < MAX_RETRIES) {
          console.warn(
            `Token refresh failed (attempt ${attempt + 1}/${MAX_RETRIES + 1}):`,
            errorCode
          );
          await delay((attempt + 1) * 1000);
          continue;
        }

        // Non-retryable or exhausted retries
        console.error('Token refresh failed:', tokenError);
        break;
      }
    }

    // Guard: don't send a doomed unauthenticated request
    if (!token) {
      throw new Error('Unable to authenticate. Please try again.');
    }
  }

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  try {
    // Check if the volumeTable has any data and if the date matches the parameters
    const count = await volumeTable.count();
    const firstEntry = await volumeTable.orderBy('saved_datetime_ms').first();
    let dataMatches = false;

    if (firstEntry) {
      const dateObject = new Date(firstEntry.saved_datetime_ms);
      const formattedDate = dateObject.toISOString().split('T')[0];
      dataMatches = formattedDate === params['date'] && firstEntry.uticker === params['und_symbol'];
    }

    if (count > 0 && dataMatches) {
      // Fetch current data status from server for extra validation
      const responseServerDataLength = await axiosInstance.get(url, {
        params: { ...params, check_length: true },
        headers: authHeaders,
        ...options,
      });
      const serverDataLength = responseServerDataLength.data.data[0]['count'];

      const lastEntry = await volumeTable.orderBy('saved_datetime_ms').last();
      const und_symbol = params['und_symbol'];

      if (lastEntry['uticker'] === und_symbol && count === serverDataLength) {
        if (process.env.NODE_ENV === 'development') console.log('Uticker and Data Length Matches');
        const allData = await volumeTable.toArray();
        return { data: allData };
      } else {
        if (process.env.NODE_ENV === 'development') console.log('Fetching updated data from API');
        const modParamsDate = { ...params, newDate: lastEntry['saved_datetime_ms'] };

        const updatedData = await axiosInstance.get(url, {
          params: modParamsDate,
          headers: authHeaders,
          ...options,
        });

        if (updatedData.data.data) {
          await volumeTable.bulkPut(updatedData.data.data);
          const allData = await volumeTable.toArray();
          return { data: allData };
        }
      }
    } else {
      if (process.env.NODE_ENV === 'development') console.log('No data in volumeTable or Data is not the right date, fetching from API');
      await truncateVolumeTable(); // Ensure this function is async or handles the deletion properly

      const freshData = await axiosInstance.get(url, {
        params,
        headers: authHeaders,
        ...options,
      });

      if (freshData.data.data) {
        await volumeTable.bulkPut(freshData.data.data);
        return freshData.data;
      }
    }
  } catch (error: any) {
    // 403 with a logged-in user means the token was rejected — treat as session expired
    if (error.response?.status === 403 && Auth.currentUser) {
      await handleSessionExpired();
    }
    console.error('Error in axiosFetchSave:', error);
    throw error.response?.data || error.message;
  }
};

function useCustomSWRLocalStorage(url, params = {}, swrOptions = {}) {
  const { data, error, isLoading, ...rest } = useSWR(
    [url, params],
    () => axiosFetchSave(url, params, swrOptions),
    swrOptions
  );

  return {
    data,
    isLoading,
    isError: error,
    ...rest,
  };
}

export default useCustomSWRLocalStorage;
