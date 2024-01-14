'use client';

import { createContext, useContext } from 'react';

import type { UserInfo } from 'firebase/auth';

export interface User extends Omit<UserInfo, 'providerId'> {
  emailVerified: boolean;
}

export interface Tenant {
  id: string;
  name: string | null;
  email: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  isAnonymous: boolean;
  // customClaims: CustomClaims;
  idToken: string;
}
export type SignInCredential = {
  email: string;
  password: string;
};

export interface AuthContextValue {
  currentUser: User | null | undefined;
  tenant: Tenant | null | undefined;
  handleSignIn: (value: SignInCredential) => Promise<void> | void;
  handleSignOut: () => Promise<void> | void; // Adjust according to the actual implementation
  isAuthLoading: boolean;
  errAuth: string | null;
}

export const AuthContext = createContext<AuthContextValue>({
  currentUser: null,
  tenant: null,
  handleSignIn: async () => {},
  handleSignOut: async () => {}, // Provide a default implementation
  isAuthLoading: true,
  errAuth: null,
});

export const useAuth = () => useContext(AuthContext);
