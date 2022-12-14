import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyCecK3G5-oyvWNSB0SZsQ4W9fCwG2hWwiQ',
  authDomain: 'vue-firebase-chat-577b3.firebaseapp.com',
  projectId: 'vue-firebase-chat-577b3',
  storageBucket: 'vue-firebase-chat-577b3.appspot.com',
  messagingSenderId: '338901674791',
  appId: '1:338901674791:web:38c7814bb9e0c583e15702',
};

const firebaseApp = initializeApp(firebaseConfig);

export const db = getFirestore(firebaseApp);
export const storage = getStorage();
export const auth = getAuth(firebaseApp);

export const authAnonymously = () => signInAnonymously(auth);
export const onAuthStateChangedHandler = (callback) =>
  onAuthStateChanged(auth, callback);
export const signOutHandler = () => signOut(auth);
export const createUserWithEmailAndPasswordHandler = ({ email, password }) =>
  createUserWithEmailAndPassword(auth, email, password);
export const signInWithEmailAndPasswordHandler = ({ email, password }) =>
  signInWithEmailAndPassword(auth, email, password);
