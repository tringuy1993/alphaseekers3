import useSWR from 'swr';
import axios from 'axios';
import { signOut } from 'firebase/auth';

import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Handle session expiration by clearing state and redirecting to login
const handleSessionExpired = async () => {
  localStorage.removeItem('tenantInfo');
  await signOut(Auth);
  const currentPath = window.location.pathname;
  window.location.href = `/authentication/signin?redirect=${encodeURIComponent(currentPath)}`;
};

const axiosFetcher = async (url, params = {}, options = {}) => {
  // getIdToken(true) forces a token refresh to prevent expired token errors
  let token = null;
  try {
    if (Auth.currentUser) {
      token = await Auth.currentUser.getIdToken(true);
    }
  } catch (tokenError: any) {
    console.error('Token refresh failed:', tokenError);

    // Handle specific Firebase auth errors that indicate session is invalid
    const errorCode = tokenError?.code;
    if (
      errorCode === 'auth/user-token-expired' ||
      errorCode === 'auth/user-disabled' ||
      errorCode === 'auth/invalid-user-token' ||
      errorCode === 'auth/user-not-found'
    ) {
      await handleSessionExpired();
      throw new Error('Session expired. Please sign in again.');
    }
  }
  try {
    const response = await axiosInstance.get(url, {
      params,
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      ...options,
    });
    return response.data;
  } catch (error) {
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
