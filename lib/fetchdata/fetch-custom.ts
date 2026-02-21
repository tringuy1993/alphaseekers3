import useSWR from 'swr';
import axios from 'axios';

import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';
import { isAuthError } from '@/lib/auth/config';
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
    // On 401/403: force-refresh the token and retry once
    if (isAuthError(error.response?.status) && Auth.currentUser) {
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
        // Second 401/403 — session is truly invalid
        if (isAuthError(retryError.response?.status)) {
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
