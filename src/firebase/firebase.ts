// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAiHNUCW9wpYqdhHMjaabaox8i4ThRy6c4",
  authDomain: "login-a3932.firebaseapp.com",
  projectId: "login-a3932",
  storageBucket: "login-a3932.firebasestorage.app",
  messagingSenderId: "17935627971",
  appId: "1:17935627971:web:56326dd4a394df2bf39476",
  measurementId: "G-T1NYHGTYXL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth, analytics };