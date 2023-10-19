// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDvPHQvoRrJq741Wd7oX1dGnX9p6OZebhc",
  authDomain: "rockpaperscissorsapp-67832.firebaseapp.com",
  projectId: "rockpaperscissorsapp-67832",
  storageBucket: "rockpaperscissorsapp-67832.appspot.com",
  messagingSenderId: "397272566080",
  appId: "1:397272566080:web:4facdfa269673ec941d2a5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
