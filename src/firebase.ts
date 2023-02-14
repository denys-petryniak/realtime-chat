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
import { firebaseConfig } from '@/firebaseConfig.js';
import type { UserCredentials } from '@/types';

export const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const auth = getAuth(firebaseApp);

export const authAnonymously = () => signInAnonymously(auth);
export const onAuthStateChangedHandler = (callback: any) =>
  onAuthStateChanged(auth, callback);
export const signOutHandler = () => signOut(auth);
export const createUserWithEmailAndPasswordHandler = ({
  email,
  password,
}: UserCredentials) => createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailAndPasswordHandler = ({
  email,
  password,
}: UserCredentials) => signInWithEmailAndPassword(auth, email, password);
