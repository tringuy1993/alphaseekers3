import useSWR from 'swr';
import axios from 'axios';

import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';
import { AUTH_RETRY_STATUS_CODE } from '@/lib/auth/config';
import { handleSessionExpired, getToken, authHeaders } from './auth-fetch-utils';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const axiosFetcher = async (url: string, params = {}, options = {}) => {
  // Use cached token (no network call) for the initial request
  let token = await getToken(false);

  if (Auth.currentUser && !token) {
    throw new Error('Unable to authenticate. Please try again.');
  }

  try {
    const response = await axiosInstance.get(url, {
      params,
      headers: authHeaders(token),
      ...options,
    });
    return response.data;
  } catch (error: any) {
    // On 401: force-refresh the token and retry once
    if (error.response?.status === AUTH_RETRY_STATUS_CODE && Auth.currentUser) {
      token = await getToken(true);

      if (!token) {
        await handleSessionExpired();
        throw new Error('Session expired. Please sign in again.');
      }

      try {
        const retryResponse = await axiosInstance.get(url, {
          params,
          headers: authHeaders(token),
          ...options,
        });
        return retryResponse.data;
      } catch (retryError: any) {
        // Second 401 — session is truly invalid
        if (retryError.response?.status === AUTH_RETRY_STATUS_CODE) {
          await handleSessionExpired();
        }
        throw retryError.response?.data || retryError.message;
      }
    }
    throw error.response?.data || error.message;
  }
};

function useCustomSWR(url: string, params = {}, swrOptions = {}) {
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
