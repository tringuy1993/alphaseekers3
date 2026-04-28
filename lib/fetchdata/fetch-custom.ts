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

const NETWORK_ERROR_MSG = 'Network error refreshing session. Please try again.';

const axiosFetcher = async (url: string, params = {}, options = {}) => {
  // First attempt uses the cached token (no Firebase round-trip).
  const initial = await getToken(false);

  if (initial.ok === false && Auth.currentUser) {
    // Network blip refreshing a near-expiry token. Don't sign out — let SWR
    // retry on its next interval; by then the SDK has usually recovered.
    throw new Error(NETWORK_ERROR_MSG);
  }
  const token = initial.ok ? initial.token : null;

  try {
    const response = await axiosInstance.get(url, {
      params,
      headers: authHeaders(token),
      ...options,
    });
    return response.data;
  } catch (error: any) {
    // On 401/403: force-refresh the token and retry once.
    if (isAuthError(error.response?.status) && Auth.currentUser) {
      const refreshed = await getToken(true);

      if (refreshed.ok === false) {
        if (refreshed.reason === 'network') {
          // Real session may still be valid; surface error without signing out.
          throw new Error(NETWORK_ERROR_MSG);
        }
        await handleSessionExpired();
        throw new Error('Session expired. Please sign in again.');
      }

      try {
        const retryResponse = await axiosInstance.get(url, {
          params,
          headers: authHeaders(refreshed.token),
          ...options,
        });
        return retryResponse.data;
      } catch (retryError: any) {
        // Second 401/403 with a freshly-refreshed token — session is truly invalid.
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
