import { UserProfile, SignUpFormData, LoginFormData } from '../types';
import { NODE_API_BASE } from './apiClient';

const STORAGE_USER_KEY = 'travelai_auth_user';
const STORAGE_TOKEN_KEY = 'travelai_auth_token';
const STORAGE_ACCOUNTS_KEY = 'travelai_registered_accounts';

export const DEFAULT_USER: UserProfile = {
  id: 'user-varshith-1',
  username: 'Varshith Sharma',
  email: 'varshith@example.com',
  phoneNumber: '+91 98490 12345',
  location: 'Surat, Gujarat',
  createdAt: new Date().toISOString()
};

/**
 * Retrieve active traveler user profile from localStorage or initialize with default demo traveler
 */
export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(STORAGE_USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.email && parsed.username) {
        return parsed;
      }
    }
    // Initialize with default demo traveler
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(DEFAULT_USER));
    return DEFAULT_USER;
  } catch (err) {
    console.warn('Failed to read auth user from localStorage:', err);
    return DEFAULT_USER;
  }
}

/**
 * Sign up a new user requiring:
 * - username
 * - email
 * - password
 * - phoneNumber
 * - location
 * 
 * Note: Password is NEVER saved in user profile or exposed to partners.
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

  // 1. Try registering via Node.js API Gateway
  try {
    const res = await fetch(`${NODE_API_BASE}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: cleanUsername,
        email: cleanEmail,
        password,
        phoneNumber: cleanPhone,
        location: cleanLocation
      })
    });

    const json = await res.json();
    if (res.ok && json.success && json.user) {
      const userProfile: UserProfile = json.user;
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userProfile));
      if (json.token) localStorage.setItem(STORAGE_TOKEN_KEY, json.token);

      // Save local backup account
      saveLocalAccount({
        user: userProfile,
        passwordHash: password
      });

      return { success: true, user: userProfile };
    } else if (res.status === 400 && json.message?.includes('already exists')) {
      return { success: false, error: json.message };
    }
  } catch (apiErr) {
    console.info('Node API unavailable for signup; using local fallback storage.');
  }

  // 2. Offline / Local Fallback Registration
  const existingAccounts = getLocalAccounts();
  if (existingAccounts.some(a => a.user.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'An account with this email address already exists' };
  }

  const newProfile: UserProfile = {
    id: `usr-${Date.now()}`,
    username: cleanUsername,
    email: cleanEmail,
    phoneNumber: cleanPhone,
    location: cleanLocation,
    createdAt: new Date().toISOString()
  };

  saveLocalAccount({
    user: newProfile,
    passwordHash: password
  });

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newProfile));
  localStorage.setItem(STORAGE_TOKEN_KEY, `tok_${Date.now()}`);

  return { success: true, user: newProfile };
}

/**
 * Log in with:
 * - email
 * - password
 * 
 * Email and password are all that's required.
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

  // 1. Try Node.js API Gateway
  try {
    const res = await fetch(`${NODE_API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: cleanEmail, password })
    });

    const json = await res.json();
    if (res.ok && json.success && json.user) {
      const userProfile: UserProfile = json.user;
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userProfile));
      if (json.token) localStorage.setItem(STORAGE_TOKEN_KEY, json.token);
      return { success: true, user: userProfile };
    } else if (res.status === 401) {
      return { success: false, error: json.message || 'Invalid email or password' };
    }
  } catch (apiErr) {
    console.info('Node API unavailable for login; checking local storage accounts.');
  }

  // 2. Local Fallback Verification
  // Check default demo account
  if (cleanEmail === DEFAULT_USER.email.toLowerCase() && (password === 'demo12345' || password === 'password')) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(DEFAULT_USER));
    return { success: true, user: DEFAULT_USER };
  }

  // Check registered local accounts
  const accounts = getLocalAccounts();
  const matched = accounts.find(a => a.user.email.toLowerCase() === cleanEmail);
  if (matched && matched.passwordHash === password) {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(matched.user));
    return { success: true, user: matched.user };
  }

  return { success: false, error: 'Invalid email or password. Please check your credentials.' };
}

/**
 * Log out active user
 */
export function logOut(): void {
  try {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
  } catch (e) {
    console.warn('Error during logout:', e);
  }
}

/**
 * Update user profile details
 */
export function updateUserProfile(updates: Partial<UserProfile>): UserProfile | null {
  const current = getCurrentUser();
  if (!current) return null;

  const updated: UserProfile = {
    ...current,
    ...updates,
    id: current.id,
    email: current.email // preserve email as unique key
  };

  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
  return updated;
}

// Helpers for local fallback storage
interface StoredAccount {
  user: UserProfile;
  passwordHash: string;
}

function getLocalAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalAccount(account: StoredAccount): void {
  try {
    const accounts = getLocalAccounts().filter(a => a.user.email.toLowerCase() !== account.user.email.toLowerCase());
    accounts.push(account);
    localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (err) {
    console.warn('Could not persist local account:', err);
  }
}
