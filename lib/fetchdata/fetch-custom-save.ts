import useSWR from 'swr';
import axios from 'axios';
import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';
import { isAuthError } from '@/lib/auth/config';
import { handleSessionExpired, getToken, authHeaders } from './auth-fetch-utils';

import { truncateVolumeTable, volumeTable } from '@/config/database-config';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const NETWORK_ERROR_MSG = 'Network error refreshing session. Please try again.';

const axiosFetchSave = async (
  url: string,
  params: Record<string, any> = {},
  options: Record<string, any> = {},
  _isRetry = false
): Promise<any> => {
  // Use cached token for initial requests, force-refresh on retry
  const result = await getToken(_isRetry);

  if (result.ok === false && Auth.currentUser) {
    if (result.reason === 'network') {
      // Don't sign out on transient network failure — let SWR retry.
      throw new Error(NETWORK_ERROR_MSG);
    }
    if (_isRetry) {
      await handleSessionExpired();
      throw new Error('Session expired. Please sign in again.');
    }
    throw new Error('Unable to authenticate. Please try again.');
  }

  const token = result.ok ? result.token : null;
  const headers = authHeaders(token);

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
        headers,
        ...options,
      });
      // -1 never matches count, forcing the safe refetch path on unexpected shapes
      const serverDataLength = responseServerDataLength.data?.data?.[0]?.count ?? -1;

      const lastEntry = await volumeTable.orderBy('saved_datetime_ms').last();
      const und_symbol = params['und_symbol'];

      if (lastEntry?.['uticker'] === und_symbol && count === serverDataLength) {
        if (process.env.NODE_ENV === 'development') console.log('Uticker and Data Length Matches');
        const allData = await volumeTable.toArray();
        return { data: allData };
      } else {
        if (process.env.NODE_ENV === 'development') console.log('Fetching updated data from API');
        const modParamsDate = { ...params, newDate: lastEntry['saved_datetime_ms'] };

        const updatedData = await axiosInstance.get(url, {
          params: modParamsDate,
          headers,
          ...options,
        });

        if (updatedData.data?.data) {
          await volumeTable.bulkPut(updatedData.data.data);
          const allData = await volumeTable.toArray();
          return { data: allData };
        }
        // Resolving undefined would leave SWR with no data and no error — a permanent spinner.
        throw new Error('Unexpected response shape from server');
      }
    } else {
      if (process.env.NODE_ENV === 'development')
        console.log('No data in volumeTable or Data is not the right date, fetching from API');
      await truncateVolumeTable();

      const freshData = await axiosInstance.get(url, {
        params,
        headers,
        ...options,
      });

      if (freshData.data?.data) {
        await volumeTable.bulkPut(freshData.data.data);
        return freshData.data;
      }
      throw new Error('Unexpected response shape from server');
    }
  } catch (error: any) {
    // On 401/403: retry the entire function once with a force-refreshed token
    if (isAuthError(error.response?.status) && Auth.currentUser && !_isRetry) {
      return axiosFetchSave(url, params, options, true);
    }
    // Second 401/403 on retry — session is truly invalid
    if (isAuthError(error.response?.status) && _isRetry) {
      await handleSessionExpired();
    }
    console.error('Error in axiosFetchSave:', error);
    throw error.response?.data || error.message;
  }
};

function useCustomSWRLocalStorage(url: string | null, params = {}, swrOptions = {}) {
  const { data, error, isLoading, ...rest } = useSWR(
    url ? [url, params] : null,
    ([requestUrl, requestParams]) => axiosFetchSave(requestUrl, requestParams, swrOptions),
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
