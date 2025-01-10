// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: "task-management-a1f5b",
  storageBucket: "task-management-a1f5b.firebasestorage.app",
  messagingSenderId: "66133774829",
  appId: "1:66133774829:web:d61ae6efb0e2c0ff8497e4",
  measurementId: "G-M9ENVN2RQ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export {db};

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User Info:', user);
    return user;
  } catch (error) {
    console.error('Error during sign-in:', error);
    return null;
  }
};

// Logout Function
export const logout = async () => {
  try {
    await signOut(auth);
    console.log('Logged out successfully');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const storage = getStorage(app);