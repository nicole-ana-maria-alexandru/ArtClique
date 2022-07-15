// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBOwGOiolu2-dswZ_tz-VHfLFrKE8TCwtc",
  authDomain: "licenta-c0150.firebaseapp.com",
  projectId: "licenta-c0150",
  storageBucket: "licenta-c0150.appspot.com",
  messagingSenderId: "139345799411",
  appId: "1:139345799411:web:c233a7b7ed84e379ea2f86",
  measurementId: "G-KSCRXYVH4G"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
export const functions = getFunctions(app);
