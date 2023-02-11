import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  appId: import.meta.env.VITE_APP_ID,
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_API_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
};

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const authAnonymously = () => signInAnonymously(auth);
export const onAuthStateChangedHandler = (callback) =>
  onAuthStateChanged(auth, callback);
export const signOutHandler = () => signOut(auth);
export const createUserWithEmailAndPasswordHandler = ({ email, password }) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailAndPasswordHandler = ({ email, password }) =>
  signInWithEmailAndPassword(auth, email, password);
