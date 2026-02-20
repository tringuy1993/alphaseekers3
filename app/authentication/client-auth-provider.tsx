'use client';

import { useState, useEffect, Suspense } from 'react';
import {
  IdTokenResult,
  signOut,
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { redirect, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { AuthContext, type SignInCredential, type Tenant, type TenantInfo } from './context';
import { Auth } from './firebase';
import {
  AUTH_STORAGE_KEYS,
  AUTH_ROUTES,
  PROTECTED_ROUTES,
  getLoginUrlWithRedirect,
  getSafeRedirect,
} from '@/lib/auth/config';

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

const AuthProviderInner = ({ children }: AuthProviderProps) => {
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
        const redirectLink = getSafeRedirect(params);
        router.push(redirectLink);
      })
      .catch((error) => {
        setErrAuth(error.code);
      });
  };

  const handleSignOut = async (): Promise<void> => {
    signOut(Auth);
    localStorage.removeItem(AUTH_STORAGE_KEYS.tenantInfo);
    router.push(AUTH_ROUTES.defaultAfterLogout);
    router.refresh();
  };
  const handleAuthStateChanged = async (firebaseUser: FirebaseUser | null) => {
    if (firebaseUser) {
      setCurrentUser(firebaseUser);
      const tokenResult = await firebaseUser?.getIdTokenResult();
      const newTenant = mapFirebaseResponseToTenant(tokenResult, firebaseUser);
      setTenant(newTenant);

      // Only store non-sensitive info in localStorage (no token)
      const tenantInfo: TenantInfo = {
        id: newTenant.id,
        name: newTenant.name,
        email: newTenant.email,
        photoURL: newTenant.photoURL,
        emailVerified: newTenant.emailVerified,
        isAnonymous: newTenant.isAnonymous,
      };
      localStorage.setItem(AUTH_STORAGE_KEYS.tenantInfo, JSON.stringify(tenantInfo));
    } else {
      setCurrentUser(firebaseUser);
      setTenant(null);
      localStorage.removeItem(AUTH_STORAGE_KEYS.tenantInfo);
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

  const pathName = usePathname();

  useEffect(() => {
    if (!isAuthLoading && !tenant && PROTECTED_ROUTES.includes(pathName as any)) {
      redirect(getLoginUrlWithRedirect(pathName));
    }
  }, [pathName, isAuthLoading, tenant]);

  return (
    <AuthContext.Provider value={contextData}>{!isAuthLoading && children}</AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  return (
    <Suspense fallback={null}>
      <AuthProviderInner>{children}</AuthProviderInner>
    </Suspense>
  );
};
