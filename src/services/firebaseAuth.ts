import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCBcdjILzgc_uvXVUUd8kSj7Xn4pQjEKU",
  authDomain: "t-vosjeskruid.firebaseapp.com",
  projectId: "t-vosjeskruid",
  storageBucket: "t-vosjeskruid.firebasestorage.app",
  messagingSenderId: "537480727031",
  appId: "1:537480727031:web:0ae4344ab18403064b86f2",
};

export const isFirebaseConfigured = (): boolean => {
  return true;
};

// Explicitly initialize one Firebase app for test verification
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

console.log("Firebase Init Success Test:", {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
  apiKeyPrefix: firebaseConfig.apiKey.substring(0, 6) + "...",
  hasAuthInstance: Boolean(auth)
});

export interface AuthState {
  user: { email: string | null; uid: string } | null;
  isAuthenticated: boolean;
  isFirebaseActive: boolean;
}

const SESSION_KEY = 'vosjeskruid_admin_auth_session_v1';

/**
 * Sign in administrator using explicit Firebase Authentication
 */
export const signInAdmin = async (email: string, password: string): Promise<{ email: string | null; uid: string }> => {
  const cleanEmail = email.trim().toLowerCase();

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
};

/**
 * Sign out administrator
 */
export const signOutAdmin = async (): Promise<void> => {
  sessionStorage.removeItem(SESSION_KEY);
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Firebase signout error:', error);
  }
};

/**
 * Check initial active session
 */
export const getActiveAdminSession = (): { email: string | null; uid: string } | null => {
  if (auth?.currentUser) {
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
  return onAuthStateChanged(auth, (firebaseUser: User | null) => {
    if (firebaseUser) {
      callback({
        user: { email: firebaseUser.email, uid: firebaseUser.uid },
        isAuthenticated: true,
        isFirebaseActive: true,
      });
    } else {
      const session = getActiveAdminSession();
      callback({
        user: session,
        isAuthenticated: Boolean(session),
        isFirebaseActive: true,
      });
    }
  });
};
