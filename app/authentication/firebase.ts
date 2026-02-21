// Import the functions you need from the SDKs you need

import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { clientConfig } from '@/config/firebase-client-config';

// Your web app's Firebase configuration
const firebaseConfig = clientConfig;

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const Auth = getAuth(app);

// Explicitly set persistence to survive page refreshes.
// Firebase defaults to indexedDB but being explicit prevents silent breakage from SDK updates.
setPersistence(Auth, browserLocalPersistence);

export const db = getFirestore(app);

export const storage = getStorage();

export default app;
