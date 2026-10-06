import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';

// Read Vite environment variables (Vercel or local .env) with direct hardcoded apiKey for debug test
const firebaseConfig = {
  apiKey: "AIzaSYAB5-YqPxgB_rbNF2GchGQz4ba4jpROQFQ",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = (): boolean => {
  const configured = Boolean(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.apiKey.trim().length > 5
  );
  console.log("Firebase Debug Init:", {
    apiKeyPrefix: firebaseConfig.apiKey ? firebaseConfig.apiKey.substring(0, 6) + "..." : "missing",
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    configured
  });
  return configured;
};

// Initialize Firebase App only if config is provided
const app = isFirebaseConfigured()
  ? (!getApps().length ? initializeApp(firebaseConfig) : getApp())
  : null;

export const auth = app ? getAuth(app) : null;

export interface AuthState {
  user: { email: string | null; uid: string } | null;
  isAuthenticated: boolean;
  isFirebaseActive: boolean;
}

const SESSION_KEY = 'vosjeskruid_admin_auth_session_v1';

/**
 * Sign in administrator using real Firebase Authentication or environment configuration
 */
export const signInAdmin = async (email: string, password: string): Promise<{ email: string | null; uid: string }> => {
  const cleanEmail = email.trim().toLowerCase();

  // Route 1: Real Firebase Authentication
  if (isFirebaseConfigured() && auth) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, cleanEmail, password);
      return {
        email: userCredential.user.email,
        uid: userCredential.user.uid,
      };
    } catch (err: any) {
      const errorCode = err.code || 'onbekende-code';
      const errorMessage = err.message || String(err);
      throw new Error(`Firebase fout: ${errorCode} — ${errorMessage}`);
    }
  }

  // Route 2: Secure Environment Variables on Vercel
  const envAdminEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim().toLowerCase();
  const envAdminPassword = (import.meta.env.VITE_ADMIN_PASSWORD || '').trim();

  if (envAdminEmail && envAdminPassword) {
    if (cleanEmail === envAdminEmail && password === envAdminPassword) {
      const sessionUser = { email: envAdminEmail, uid: 'env-admin-session' };
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionUser));
      return sessionUser;
    } else {
      throw new Error('Onjuist e-mailadres of wachtwoord.');
    }
  }

  // Route 3: Not yet configured message with clear setup instructions
  throw new Error(
    'Firebase Authentication is nog niet gekoppeld. Voeg VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN en VITE_FIREBASE_PROJECT_ID toe in Vercel (Project Settings > Environment Variables), of stel VITE_ADMIN_EMAIL en VITE_ADMIN_PASSWORD in.'
  );
};

/**
 * Sign out administrator
 */
export const signOutAdmin = async (): Promise<void> => {
  sessionStorage.removeItem(SESSION_KEY);
  if (isFirebaseConfigured() && auth) {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Firebase signout error:', error);
    }
  }
};

/**
 * Check initial active session
 */
export const getActiveAdminSession = (): { email: string | null; uid: string } | null => {
  if (isFirebaseConfigured() && auth?.currentUser) {
    return {
      email: auth.currentUser.email,
      uid: auth.currentUser.uid,
    };
  }

  const saved = sessionStorage.getItem(SESSION_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Subscribe to authentication state changes
 */
export const subscribeToAuthChanges = (callback: (state: AuthState) => void): (() => void) => {
  if (isFirebaseConfigured() && auth) {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          user: { email: firebaseUser.email, uid: firebaseUser.uid },
          isAuthenticated: true,
          isFirebaseActive: true,
        });
      } else {
        // Also check if session storage was set
        const session = getActiveAdminSession();
        callback({
          user: session,
          isAuthenticated: Boolean(session),
          isFirebaseActive: true,
        });
      }
    });
  }

  // When Firebase is not configured, listen to session storage
  const session = getActiveAdminSession();
  callback({
    user: session,
    isAuthenticated: Boolean(session),
    isFirebaseActive: false,
  });

  return () => {};
};
