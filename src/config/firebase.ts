
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Using your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBEIqVF0k9pU2UcKfUAC4U_CqkaRgQEAY4",
  authDomain: "makerbrains-ac96b.firebaseapp.com",
  projectId: "makerbrains-ac96b",
  storageBucket: "makerbrains-ac96b.appspot.com",
  messagingSenderId: "1069586306652",
  appId: "1:1069586306652:web:2465d2ec96d91530f4f899",
  measurementId: "G-XFLXM61GBH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
