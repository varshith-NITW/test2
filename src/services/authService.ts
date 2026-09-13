import { UserProfile, SignUpFormData, LoginFormData } from '../types';
import { NODE_API_BASE } from './apiClient';
import {
  saveTravelerToCloud,
  getTravelerFromCloud,
  saveAccountVaultToCloud,
  verifyAccountVaultInCloud,
  setActiveCloudSession,
  getActiveCloudSession
} from './cloudStorageService';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';
import { auth } from './firebaseConfig';

export const DEFAULT_USER: UserProfile = {
  id: 'user-varshith-1',
  username: 'Varshith Sharma',
  email: 'varshith@example.com',
  phoneNumber: '+91 98490 12345',
  location: 'Surat, Gujarat',
  createdAt: new Date().toISOString()
};

/**
 * Retrieve active traveler user profile from Cloud Firestore session cache or initialize with default demo traveler
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const raw = sessionStorage.getItem('travelai_active_cloud_user') || localStorage.getItem('travelai_auth_traveler');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.username) {
        return parsed;
      }
    }
  } catch (err) {
    // Fall through
  }

  return null;
}

/**
 * Sign up a new user requiring:
 * - username
 * - email
 * - password
 * - phoneNumber
 * - location
 * 
 * Persists directly to Google Cloud Firestore (collection: cloud_travelers).
 * Password is NEVER saved in user profile or exposed to partners.
 */
export async function signUp(data: SignUpFormData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const { username, email, password, phoneNumber, location } = data;

  // Validation
  if (!username || !username.trim()) {
    return { success: false, error: 'Full name / username is required' };
  }
  if (!email || !email.trim() || !email.includes('@')) {
    return { success: false, error: 'A valid email address is required' };
  }
  if (!password || password.length < 6) {
    return { success: false, error: 'Password must be at least 6 characters long' };
  }
  if (!phoneNumber || !phoneNumber.trim()) {
    return { success: false, error: 'Phone number is required for booking confirmations' };
  }
  if (!location || !location.trim()) {
    return { success: false, error: 'City / Location is required' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const cleanUsername = username.trim();
  const cleanPhone = phoneNumber.trim();
  const cleanLocation = location.trim();

  let firebaseUid: string | null = null;

  // 1. Authenticate with Firebase Authentication
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, cleanEmail, password);
    firebaseUid = userCredential.user.uid;
    await updateProfile(userCredential.user, {
      displayName: cleanUsername
    }).catch(() => {});
    console.info('[Firebase Auth] User successfully created in Firebase Auth. UID:', firebaseUid);
  } catch (authErr: any) {
    console.warn('[Firebase Auth] Notice during signup:', authErr.code, authErr.message);
    if (authErr.code === 'auth/email-already-in-use') {
      return { success: false, error: 'An account with this email address already exists.' };
    }
    if (authErr.code === 'auth/weak-password') {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }
    // If Email/Password provider isn't enabled yet in console (auth/operation-not-allowed),
    // proceed to save in Cloud Firestore database vault
  }

  // 2. Check if user already exists in Google Cloud Firestore
  try {
    const existingCloudUser = await getTravelerFromCloud(cleanEmail);
    if (existingCloudUser && !firebaseUid) {
      return { success: false, error: 'An account with this email address already exists in Cloud Firestore.' };
    }
  } catch (e) {}

  const newProfile: UserProfile = {
    id: firebaseUid || `usr-${Date.now()}`,
    username: cleanUsername,
    email: cleanEmail,
    phoneNumber: cleanPhone,
    location: cleanLocation,
    createdAt: new Date().toISOString()
  };

  // 3. Save directly to Google Cloud Firestore (collections: cloud_travelers and cloud_auth_vault)
  await saveTravelerToCloud(newProfile);
  await saveAccountVaultToCloud(cleanEmail, password);
  await setActiveCloudSession(newProfile);

  // 4. Synchronize with backend Node.js API Gateway if reachable
  try {
    fetch(`${NODE_API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanUsername,
        email: cleanEmail,
        password,
        phoneNumber: cleanPhone,
        location: cleanLocation
      })
    }).catch(() => {});
  } catch (apiErr) {}

  return { success: true, user: newProfile };
}

/**
 * Log in with:
 * - email
 * - password
 * 
 * Authenticates with Firebase Auth and Google Cloud Firestore.
 */
export async function logIn(data: LoginFormData): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
  const { email, password } = data;

  if (!email || !email.trim()) {
    return { success: false, error: 'Email address is required' };
  }
  if (!password) {
    return { success: false, error: 'Password is required' };
  }

  const cleanEmail = email.trim().toLowerCase();

  // 1. Check Default Demo Account
  if (cleanEmail === DEFAULT_USER.email.toLowerCase() && (password === 'demo12345' || password === 'password')) {
    await setActiveCloudSession(DEFAULT_USER);
    return { success: true, user: DEFAULT_USER };
  }

  // 2. Try Firebase Authentication
  try {
    const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    console.info('[Firebase Auth] User signed in via Firebase Auth. UID:', userCredential.user.uid);
    let cloudUser = await getTravelerFromCloud(cleanEmail);
    if (!cloudUser) {
      cloudUser = {
        id: userCredential.user.uid,
        username: userCredential.user.displayName || cleanEmail.split('@')[0],
        email: cleanEmail,
        phoneNumber: '+91 98490 12345',
        location: 'Registered Traveler',
        createdAt: new Date().toISOString()
      };
      await saveTravelerToCloud(cloudUser);
    }
    await setActiveCloudSession(cloudUser);
    return { success: true, user: cloudUser };
  } catch (authErr: any) {
    console.warn('[Firebase Auth] Notice during login:', authErr.code, authErr.message);
    if (authErr.code === 'auth/wrong-password' || authErr.code === 'auth/invalid-credential') {
      return { success: false, error: 'Invalid email or password. Please check your credentials.' };
    }
  }

  // 3. Fallback: Google Cloud Firestore Vault verification
  try {
    const isCloudValid = await verifyAccountVaultInCloud(cleanEmail, password);
    if (isCloudValid) {
      const cloudUser = await getTravelerFromCloud(cleanEmail);
      if (cloudUser) {
        await setActiveCloudSession(cloudUser);
        return { success: true, user: cloudUser };
      }
    }
  } catch (cloudErr) {
    console.info('Cloud Firestore authentication note:', cloudErr);
  }

  // 4. Fallback: Node.js API Gateway
  try {
    const res = await fetch(`${NODE_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const json = await res.json();
    if (res.ok && json.success && json.user) {
      const userProfile: UserProfile = json.user;
      await setActiveCloudSession(userProfile);
      return { success: true, user: userProfile };
    } else if (res.status === 401) {
      return { success: false, error: json.message || 'Invalid email or password' };
    }
  } catch (apiErr) {}

  return { success: false, error: 'Invalid email or password. Please check your credentials.' };
}

/**
 * Log out active user from Firebase Auth and Cloud Session
 */
export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (e) {
    // Fall through
  }
  try {
    sessionStorage.removeItem('travelai_active_cloud_user');
    localStorage.removeItem('travelai_auth_traveler');
    await setActiveCloudSession(null);
  } catch (e) {
    console.warn('Error during cloud logout:', e);
  }
}

/**
 * Update user profile details in Google Cloud Firestore
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...updates,
    id: current.id,
    email: current.email // preserve email as unique key
  };

  await saveTravelerToCloud(updated);
  await setActiveCloudSession(updated);
  return updated;
}
