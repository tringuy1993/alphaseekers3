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

const axiosFetcher = async (url, params = {}, options = {}) => {
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

  try {
    const response = await axiosInstance.get(url, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...options,
    });
    return response.data;
  } catch (error: any) {
    // 403 with a logged-in user means the token was rejected — treat as session expired
    if (error.response?.status === 403 && Auth.currentUser) {
      await handleSessionExpired();
    }
    throw error.response?.data || error.message;
  }
};

function useCustomSWR(url, params = {}, swrOptions = {}) {
  const { data, error, isLoading, ...rest } = useSWR(
    [url, params],
    () => axiosFetcher(url, params, swrOptions),
    swrOptions
  );

  return {
    data,
    isLoading,
    isError: error,
    ...rest,
  };
}

export default useCustomSWR;
