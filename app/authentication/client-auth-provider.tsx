'use client';

import { useState, useEffect } from 'react';
import {
  IdTokenResult,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { AuthContext, type SignInCredential, type Tenant } from './context';
import { Auth } from './firebase';
import { siteLinks } from '@/config/site';

interface AuthProviderProps {
  children: React.ReactNode;
}

const mapFirebaseResponseToTenant = (result: IdTokenResult, user: FirebaseUser): Tenant => {
  const providerData = user.providerData && user.providerData[0];

  if (!user.isAnonymous && providerData) {
    return {
      id: user.uid,
      name: providerData.displayName || user.displayName || user.email || null,
      email: providerData.email || null,
      emailVerified: user.emailVerified || false,
      photoURL: providerData.photoURL || null,
      //   customClaims: {},
      isAnonymous: user.isAnonymous,
      idToken: result.token,
    };
  }

  return {
    id: user.uid,
    name: user.displayName || providerData?.displayName || user.email || null,
    email: user.email || null,
    emailVerified: user.emailVerified || false,
    photoURL: user.photoURL || null,
    // customClaims: {},
    isAnonymous: user.isAnonymous,
    idToken: result.token,
  };
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // const firstLoadRef = useRef(true);
  const [currentUser, setCurrentUser] = useState();
  const [tenant, setTenant] = useState<Tenant>();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const [errAuth, setErrAuth] = useState(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSignIn = async (userInput: SignInCredential) => {
    await signInWithEmailAndPassword(Auth, userInput.email, userInput.password)
      .then(() => {
        const params = searchParams.get('redirect');
        const redirectLink = params === null ? siteLinks.optionsdata.href : params;
        router.push(redirectLink as string);
      })
      .catch((error) => {
        setErrAuth(error.code);
      });
  };
  const handleSignOut = async (): Promise<void> => {
    signOut(Auth);
    localStorage.removeItem('tenant');
    router.refresh();
  };
  const handleAuthStateChanged = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      setCurrentUser(firebaseUser);
      const tokenResult = await firebaseUser?.getIdTokenResult();
      const newTenant = mapFirebaseResponseToTenant(tokenResult, firebaseUser);
      setTenant(newTenant);
      localStorage.setItem('tenant', JSON.stringify(newTenant));
    } else {
      setCurrentUser(firebaseUser);
      setTenant(null);
    }
    setIsAuthLoading(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(Auth, handleAuthStateChanged);
    return unsubscribe;
  }, []);

  const contextData = {
    currentUser,
    tenant,
    handleSignOut,
    handleSignIn,
    isAuthLoading,
    errAuth,
  };

  return <AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>;
};
