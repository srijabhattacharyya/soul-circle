
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

// Check if all required environment variables are present for a valid configuration.
const isConfigValid = Object.values(firebaseConfig).every(Boolean);

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

if (isConfigValid) {
    // If the config is valid, initialize Firebase services.
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} else {
    // If the config is invalid, log a warning and assign null to services.
    // This allows the app to run in a development/offline mode without crashing.
    if (typeof window !== 'undefined') {
        console.warn("Firebase configuration is invalid or missing. App is running in offline mode with mock data.");
    }
    // Assign null to prevent runtime errors when these modules are imported elsewhere.
    app = null as any;
    auth = null as any;
    db = null as any;
}

export { app, auth, db, isConfigValid };
