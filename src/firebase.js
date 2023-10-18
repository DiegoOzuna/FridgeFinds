// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
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
// Initialize Firebase Authentication and reference to this service
export const FIREBASE_AUTH = getAuth(FIREBASE_APP);
