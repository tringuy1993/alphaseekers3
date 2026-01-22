import useSWR from 'swr';
import axios from 'axios';
import { signOut } from 'firebase/auth';
import { Auth } from '@/app/authentication/firebase';
import { BASE_URL } from './apiURLs';

// import { saveData, getData } from '../database/database';
import { truncateVolumeTable, volumeTable } from '@/config/database-config';

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

const axiosFetchSave = async (url, params = {}, options = {}) => {
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
                params: {...params, check_length: true},
                headers: authHeaders,
                ...options,
            });
            const serverDataLength = responseServerDataLength.data.data[0]['count'];

            const lastEntry = await volumeTable.orderBy('saved_datetime_ms').last();
            const und_symbol = params['und_symbol'];

            if (lastEntry['uticker'] === und_symbol && count === serverDataLength) {
                console.log('Uticker and Data Length Matches');
                const allData = await volumeTable.toArray();
                return { data: allData };
            } else {
                console.log('Fetching updated data from API');
                const modParamsDate = {...params, newDate: lastEntry['saved_datetime_ms']};

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
            console.log('No data in volumeTable or Data is not the right date, fetching from API');
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
    } catch (error) {
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