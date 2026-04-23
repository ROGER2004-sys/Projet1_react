// src/services/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Replace with your actual Firebase project credentials
const firebaseConfig = {
  apiKey: "AIzaSyBJsV95wfgHGKCxyyu53zqMQBM3s38gFFc",
  authDomain: "dbproject-a78b0.firebaseapp.com",
  projectId: "dbproject-a78b0",
  storageBucket: "dbproject-a78b0.firebasestorage.app",
  messagingSenderId: "885148912172",
  appId: "1:885148912172:web:8f8fdfc81cf629b9b89f89"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
