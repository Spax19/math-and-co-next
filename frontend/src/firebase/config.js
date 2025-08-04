// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth"; // <--- Make sure getAuth is imported
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase only if there are no existing apps
let app;
if (typeof window !== "undefined") {
  app = new Promise(async (resolve, reject) => {
    try {
      const { initializeApp, getApps } = await import("firebase/app");
      const app = !getApps().length
        ? initializeApp(firebaseConfig)
        : getApps()[0];
      const auth = getAuth(app);
      resolve(auth);
    } catch (error) {
      console.error("Firebase initialization failed:", error);
      reject(error);
    }
  });
}

export default app;
export const auth = app ? getAuth(app) : null;
export const db = getFirestore(app);
export const storage = getStorage(app);