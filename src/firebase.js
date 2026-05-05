import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAD2oCXDzTc6ljupgU65e_efS91fcZPMhU",
  authDomain: "quizapp-a25d8.firebaseapp.com",
  projectId: "quizapp-a25d8",
  storageBucket: "quizapp-a25d8.firebasestorage.app",
  messagingSenderId: "911044377207",
  appId: "1:911044377207:web:f98211423399eaa6a86472",
  measurementId: "G-FKKCWTZBXZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
