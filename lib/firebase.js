import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDE--rBQgjP7eM2QQr51Tv1Db_pKNXH8Y0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "goturkey2k2x.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "goturkey2k2x",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "goturkey2k2x.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "87738448924",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:87738448924:web:b2e0e57401032da0e0b3d9",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-62Y9GH2EKX",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const db = getFirestore(app);
export const storage = getStorage(app);
// Firebase Storage retries failed operations with exponential backoff for up
// to 2 minutes by default. Since upload/download calls are awaited before a
// form submission completes, that default makes any storage outage look like
// the UI is frozen rather than failing. Fail fast instead so callers can
// surface a real error quickly.
storage.maxUploadRetryTime = 10000;
storage.maxOperationRetryTime = 10000;
export const auth = getAuth(app);
export default app;
