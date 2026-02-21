/**
 * Centralized Authentication Configuration
 *
 * Single source of truth for all auth-related settings.
 * Import from here instead of hardcoding values across the codebase.
 */

import { siteLinks } from '@/config/site';

// Storage keys - used for localStorage
export const AUTH_STORAGE_KEYS = {
  tenantInfo: 'tenantInfo',
} as const;

// Route configuration
export const AUTH_ROUTES = {
  // Login and auth pages
  login: siteLinks.signin.href,
  register: siteLinks.register.href,
  forgotPassword: siteLinks.forgotpassword.href,

  // Default redirects
  defaultAfterLogin: siteLinks.optionsdata.href,
  defaultAfterLogout: siteLinks.signin.href,
} as const;

// Protected routes (require authentication)
export const PROTECTED_ROUTES = [
  siteLinks.optionsdata.href,
  siteLinks.backtest.href,
  siteLinks.optionstime.href,
  siteLinks.gammadashboard.href,
  siteLinks.profile.href,
] as const;

// Public routes (no authentication required)
export const PUBLIC_ROUTES = [
  siteLinks.live0dte.href,
  siteLinks.music.href,
  siteLinks.about.href,
  siteLinks.signin.href,
  siteLinks.register.href,
  siteLinks.forgotpassword.href,
] as const;

// HTTP status codes that trigger token refresh and retry
export const AUTH_RETRY_STATUS_CODES = [401, 403] as const;
export function isAuthError(status: number | undefined): boolean {
  return status === 401 || status === 403;
}

// Firebase error codes that indicate session is invalid
export const SESSION_EXPIRED_ERROR_CODES = [
  'auth/user-token-expired',
  'auth/user-disabled',
  'auth/invalid-user-token',
  'auth/user-not-found',
] as const;

// Firebase error codes that indicate a transient/retryable failure
export const TRANSIENT_ERROR_CODES = [
  'auth/network-request-failed',
  'auth/too-many-requests',
] as const;

// Helper functions
export function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

export function isAuthRoute(pathname: string): boolean {
  return pathname.startsWith('/authentication');
}

/**
 * Validate that a redirect path is safe (relative path only, no open redirect).
 * Returns true only for paths starting with '/' but not '//' (protocol-relative URLs).
 */
export function isValidRedirect(path: string | null | undefined): boolean {
  return typeof path === 'string' && path.startsWith('/') && !path.startsWith('//');
}

/**
 * Sanitize a redirect path, returning the default route if invalid.
 */
export function getSafeRedirect(path: string | null | undefined): string {
  return isValidRedirect(path) ? path! : AUTH_ROUTES.defaultAfterLogin;
}

export function getLoginUrlWithRedirect(returnPath: string): string {
  return `${AUTH_ROUTES.login}?redirect=${encodeURIComponent(returnPath)}`;
}
