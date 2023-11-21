// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//removed {getAuth} for intializeAuth, getReactNativePersistence, and ReactNativeAsyncStorage
//reason: It allows for signed in users to keep their sign in; if user reloads app, they are still signed in
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore'

import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5BM6g8bqBaPlD-CPW9OIcpFwC2odJi_8",
  authDomain: "fridgefinddb.firebaseapp.com",
  projectId: "fridgefinddb",
  storageBucket: "fridgefinddb.appspot.com",
  messagingSenderId: "414811812750",
  appId: "1:414811812750:web:c5acb72a891d43403daadf",
  measurementId: "G-JS0LP3FFD9"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and reference to this service, this version allows us to keep user info.
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
//Initialize Firebase DataBase and reference to this service
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
//Initialize Firebase Storage and reference to this service
//Allows for us to have user uploaded media.
export const FIREBASE_STORAGE = getStorage(FIREBASE_APP);