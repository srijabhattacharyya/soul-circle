
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// This check is crucial. It verifies if the environment variables are loaded.
export const isConfigValid = !!firebaseConfig.apiKey && !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (firebaseConfig.apiKey) {
    // If the config is valid, initialize Firebase services.
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // If the config is invalid, log a clear warning and assign null to services.
    // This allows the app to run in a development/offline mode without crashing.
    if (typeof window !== 'undefined') {
        console.warn(`
          **********************************************************************************
          *                                                                                *
          *    FIREBASE CONFIGURATION MISSING OR INVALID                                   *
          *    -----------------------------------------                                   *
          *    Your Firebase environment variables (like NEXT_PUBLIC_FIREBASE_API_KEY)     *
          *    are not set correctly in your .env.local file.                              *
          *                                                                                *
          *    The app is now running in OFFLINE MODE.                                     *
          *    Authentication and database features will not work.                         *
          *                                                                                *
          *    To fix this, please:                                                        *
          *    1. Copy your web app's Firebase config from the Firebase Console.           *
          *    2. Paste the values into your .env.local file.                              *
          *    3. Make sure each variable is prefixed with 'NEXT_PUBLIC_'.                 *
          *    4. Restart your development server.                                         *
          *                                                                                *
          **********************************************************************************
        `);
    }
    // Assign null to prevent runtime errors when these modules are imported elsewhere.
    app = null as any;
    auth = null as any;
    db = null as any;
}

export { app, auth, db };
