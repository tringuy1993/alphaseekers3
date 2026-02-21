import { signOut } from 'firebase/auth';
import { Auth } from '@/app/authentication/firebase';
import {
  AUTH_STORAGE_KEYS,
  SESSION_EXPIRED_ERROR_CODES,
  TRANSIENT_ERROR_CODES,
  getLoginUrlWithRedirect,
} from '@/lib/auth/config';

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Clear local auth state, sign out of Firebase, and redirect to login.
 * Call this only when the session is truly invalid (e.g. second consecutive 401).
 */
export const handleSessionExpired = async () => {
  localStorage.removeItem(AUTH_STORAGE_KEYS.tenantInfo);
  await signOut(Auth);
  const currentPath = window.location.pathname;
  window.location.href = getLoginUrlWithRedirect(currentPath);
};

/**
 * Get a Firebase ID token.
 *
 * @param forceRefresh - If true, forces a network call to Firebase to refresh the token.
 *                       If false, uses the cached token (no network call).
 * @returns The ID token string, or null if no user is signed in.
 * @throws If the session is permanently expired (triggers handleSessionExpired).
 */
export const getToken = async (forceRefresh: boolean): Promise<string | null> => {
  if (!Auth.currentUser) {
    return null;
  }

  const MAX_RETRIES = 2;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await Auth.currentUser.getIdToken(forceRefresh);
    } catch (tokenError: any) {
      const errorCode = tokenError?.code;

      // Session is permanently invalid
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

  return null;
};

/**
 * Build Authorization header from a token.
 */
export const authHeaders = (token: string | null): Record<string, string> =>
  token ? { Authorization: `Bearer ${token}` } : {};
