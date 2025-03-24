// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCT3zX1GiwJ4jjrxV6VqR7fBo_8YqZk2QA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "notecafe-2ca1f.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "notecafe-2ca1f",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "notecafe-2ca1f.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "910473445632",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:910473445632:web:c271d766d1818f231733e5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export default app;