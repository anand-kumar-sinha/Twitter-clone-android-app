// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA5mnLRYQkAUOMdUO5atieSZzhyNGk0zeM",
  authDomain: "leafy-beach-388109.firebaseapp.com",
  projectId: "leafy-beach-388109",
  storageBucket: "leafy-beach-388109.appspot.com",
  messagingSenderId: "815236762541",
  appId: "1:815236762541:web:7ace87bb5664cd6369af24",
  measurementId: "G-7G44N7DXJ3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app)