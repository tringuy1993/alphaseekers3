import useSWR from 'swr';
import axios from 'axios';

import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

const axiosFetcher = async (url, params = {}, options = {}) => {
  // getIdToken(true) forces a token refresh to prevent expired token errors
  let token = null;
  try {
    if (Auth.currentUser) {
      token = await Auth.currentUser.getIdToken(true);
    }
  } catch (tokenError) {
    console.error('Token refresh failed:', tokenError);
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
