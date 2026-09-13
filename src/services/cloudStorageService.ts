/**
 * Cloud Storage & Cloud Firestore Service
 * Replaces client-side localStorage with Google Cloud Firestore
 * for persistent traveler profiles, authentication accounts, and booking records.
 */
import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebaseConfig';
import { UserProfile, Booking, Hotel, Guide } from '../types';

// Collection Names in Cloud Firestore
const COLLECTION_TRAVELERS = 'cloud_travelers';
const COLLECTION_BOOKINGS = 'cloud_bookings';
const COLLECTION_ACCOUNTS = 'cloud_auth_vault';
const COLLECTION_SESSIONS = 'cloud_active_sessions';
const COLLECTION_HOTELS = 'cloud_hotels';
const COLLECTION_GUIDES = 'cloud_guides';

// Cloud session client key (only session token is kept locally to resume cloud session)
const SESSION_CLIENT_ID_KEY = 'travelai_cloud_session_id';

function getSessionClientId(): string {
  let id = localStorage.getItem(SESSION_CLIENT_ID_KEY);
  if (!id) {
    id = 'client_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem(SESSION_CLIENT_ID_KEY, id);
  }
  return id;
}

/**
 * 1. Save or Update Traveler Profile in Google Cloud Firestore
 * Note: Traveler password is NEVER included or saved in the profile document.
 */
export async function saveTravelerToCloud(user: UserProfile): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_TRAVELERS, user.email.toLowerCase());
    await setDoc(docRef, {
      id: user.id,
      username: user.username,
      email: user.email.toLowerCase(),
      phoneNumber: user.phoneNumber,
      location: user.location,
      createdAt: user.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      storageType: 'Google Cloud Firestore'
    }, { merge: true });

    console.info(`[Cloud Storage] Traveler ${user.email} saved to Cloud Firestore.`);
    return true;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note while writing traveler to Cloud Firestore:', err.message);
    return false;
  }
}

/**
 * 2. Retrieve Traveler Profile from Google Cloud Firestore by Email
 */
export async function getTravelerFromCloud(email: string): Promise<UserProfile | null> {
  try {
    const docRef = doc(db, COLLECTION_TRAVELERS, email.toLowerCase());
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      return {
        id: data.id || snap.id,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber,
        location: data.location,
        createdAt: data.createdAt
      };
    }
    return null;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note while reading traveler from Cloud Firestore:', err.message);
    return null;
  }
}

/**
 * 3. Store Auth Credentials Vault Record in Cloud Firestore
 * Securely associates password credentials with the account in the cloud
 */
export async function saveAccountVaultToCloud(email: string, passwordHash: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_ACCOUNTS, email.toLowerCase());
    await setDoc(docRef, {
      email: email.toLowerCase(),
      secretKey: passwordHash, // In production, salted hash
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (err) {
    return false;
  }
}

/**
 * 4. Verify Credentials against Cloud Firestore Vault
 */
export async function verifyAccountVaultInCloud(email: string, passwordAttempt: string): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_ACCOUNTS, email.toLowerCase());
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data();
      return data.secretKey === passwordAttempt;
    }
    return false;
  } catch (err) {
    return false;
  }
}

/**
 * 5. Save Booking Record to Google Cloud Firestore
 * Dispatches traveler name, phone, email, and location to the cloud record.
 * Passwords are strictly absent.
 */
export async function saveBookingToCloud(booking: Booking): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_BOOKINGS, booking.id);
    await setDoc(docRef, {
      ...booking,
      storedInCloud: true,
      cloudProvider: 'Google Cloud Firestore',
      cloudSyncedAt: new Date().toISOString()
    });

    console.info(`[Cloud Storage] Booking ${booking.id} synced to Google Cloud Firestore.`);
    return true;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note while syncing booking to Cloud Firestore:', err.message);
    return false;
  }
}

/**
 * 6. Fetch All Bookings from Google Cloud Firestore
 */
export async function fetchBookingsFromCloud(): Promise<Booking[]> {
  try {
    const q = query(collection(db, COLLECTION_BOOKINGS));
    const snapshot = await getDocs(q);
    const results: Booking[] = [];

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      results.push(data as Booking);
    });

    return results;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note fetching bookings from Cloud Firestore:', err.message);
    return [];
  }
}

/**
 * 7. Real-Time Cloud Firestore Listener for Live Booking Synchronization
 * Triggers callback whenever any user, hotel, or partner creates or updates a booking.
 */
export function subscribeToCloudBookings(onUpdate: (bookings: Booking[]) => void): () => void {
  try {
    const q = query(collection(db, COLLECTION_BOOKINGS));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const liveBookings: Booking[] = [];
      snapshot.forEach((docSnap) => {
        liveBookings.push(docSnap.data() as Booking);
      });
      if (liveBookings.length > 0) {
        onUpdate(liveBookings);
      }
    }, (error) => {
      console.info('[Cloud Storage] Real-time Firestore stream notice:', error.message);
    });

    return unsubscribe;
  } catch (err) {
    return () => {};
  }
}

/**
 * 8. Active Cloud Session Persistence
 * Persists active traveler state in Cloud Firestore session document
 */
export async function setActiveCloudSession(user: UserProfile | null): Promise<void> {
  try {
    const clientId = getSessionClientId();
    const docRef = doc(db, COLLECTION_SESSIONS, clientId);

    if (user) {
      await setDoc(docRef, {
        clientId,
        user,
        lastActive: new Date().toISOString()
      });
      // Mirror active user object in memory / local session for instant render
      sessionStorage.setItem('travelai_active_cloud_user', JSON.stringify(user));
    } else {
      await setDoc(docRef, {
        clientId,
        user: null,
        lastActive: new Date().toISOString()
      });
      sessionStorage.removeItem('travelai_active_cloud_user');
    }
  } catch (err) {
    // Graceful fallback
    if (user) {
      sessionStorage.setItem('travelai_active_cloud_user', JSON.stringify(user));
    } else {
      sessionStorage.removeItem('travelai_active_cloud_user');
    }
  }
}

/**
 * 9. Retrieve Active Cloud Session
 */
export async function getActiveCloudSession(): Promise<UserProfile | null> {
  // First check fast memory/session mirror
  try {
    const cached = sessionStorage.getItem('travelai_active_cloud_user');
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.email) return parsed;
    }
  } catch {}

  // Fetch from Cloud Firestore
  try {
    const clientId = getSessionClientId();
    const docRef = doc(db, COLLECTION_SESSIONS, clientId);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      const data = snap.data();
      if (data && data.user && data.user.email) {
        sessionStorage.setItem('travelai_active_cloud_user', JSON.stringify(data.user));
        return data.user as UserProfile;
      }
    }
  } catch (err) {
    // Fall through
  }

  return null;
}

/**
 * 10. Save Registered Hotel Partner to Cloud Firestore
 */
export async function saveHotelToCloud(hotel: Hotel): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_HOTELS, hotel.id);
    await setDoc(docRef, {
      ...hotel,
      updatedAt: new Date().toISOString(),
      storageType: 'Google Cloud Firestore'
    }, { merge: true });
    console.info(`[Cloud Storage] Hotel ${hotel.name} saved to Cloud Firestore.`);
    return true;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note while saving hotel:', err.message);
    return false;
  }
}

/**
 * 11. Save Registered Guide to Cloud Firestore
 */
export async function saveGuideToCloud(guide: Guide): Promise<boolean> {
  try {
    const docRef = doc(db, COLLECTION_GUIDES, guide.id);
    await setDoc(docRef, {
      ...guide,
      updatedAt: new Date().toISOString(),
      storageType: 'Google Cloud Firestore'
    }, { merge: true });
    console.info(`[Cloud Storage] Guide ${guide.name} saved to Cloud Firestore.`);
    return true;
  } catch (err: any) {
    console.warn('[Cloud Storage] Note while saving guide:', err.message);
    return false;
  }
}
