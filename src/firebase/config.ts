import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyA4YnE4Lz1lVozZwQvsPsxO8pr_lDQbuiU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'revel-5818b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'revel-5818b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'revel-5818b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '723226388374',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:723226388374:web:1feeef8870f31bc5b89fb7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
