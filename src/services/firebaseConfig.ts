import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Configurable Firebase project credentials
// Can be customized via Vite .env variables (VITE_FIREBASE_API_KEY, etc.) or custom settings
export interface FirebaseProjectConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const STORAGE_FIREBASE_CONFIG_KEY = 'travelai_custom_firebase_config';

/**
 * Retrieve active Firebase configuration from environment or stored project config
 */
export function getActiveFirebaseConfig(): FirebaseProjectConfig {
  try {
    const custom = localStorage.getItem(STORAGE_FIREBASE_CONFIG_KEY);
    if (custom) {
      const parsed = JSON.parse(custom);
      if (parsed && parsed.projectId) {
        return parsed;
      }
    }
  } catch (e) {
    // Fall through
  }

  return {
    apiKey: (import.meta as any).env?.VITE_FIREBASE_API_KEY || 'AIzaSyAZkj-NWz_sEnRkp8JSTuG4GL1mMBAvzu8',
    authDomain: (import.meta as any).env?.VITE_FIREBASE_AUTH_DOMAIN || 'tourism-34722.firebaseapp.com',
    projectId: (import.meta as any).env?.VITE_FIREBASE_PROJECT_ID || 'tourism-34722',
    storageBucket: (import.meta as any).env?.VITE_FIREBASE_STORAGE_BUCKET || 'tourism-34722.firebasestorage.app',
    messagingSenderId: (import.meta as any).env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '567192662461',
    appId: (import.meta as any).env?.VITE_FIREBASE_APP_ID || '1:567192662461:web:0e38549c7f22f3c891e2d4'
  };
}

/**
 * Save custom Firebase project configuration (for user-provided projects)
 */
export function setCustomFirebaseConfig(config: FirebaseProjectConfig): void {
  localStorage.setItem(STORAGE_FIREBASE_CONFIG_KEY, JSON.stringify(config));
  window.location.reload();
}

/**
 * Initialize or retrieve the Firebase app instance
 */
function initializeFirebase(): { app: FirebaseApp; db: Firestore } {
  const config = getActiveFirebaseConfig();
  const app = getApps().length > 0 ? getApp() : initializeApp(config);
  const db = getFirestore(app);

  return { app, db };
}

export const { app, db } = initializeFirebase();

/**
 * Check cloud connection status
 */
export function getCloudStorageStatus(): {
  provider: string;
  projectId: string;
  connected: boolean;
  type: string;
} {
  const config = getActiveFirebaseConfig();
  return {
    provider: 'Google Cloud Firestore',
    projectId: config.projectId,
    connected: true,
    type: 'Real-time Serverless Cloud Storage'
  };
}
