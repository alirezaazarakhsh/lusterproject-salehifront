import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import {
  initializeFirestore,
  getFirestore,
  setLogLevel,
  Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// تنظیم لاگ فایربیس روی حالت فقط خطا برای جلوگیری از پر شدن کنسول با هشدارهای آفلاین موقت
try {
  setLogLevel('error');
} catch {}

export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider();

function createFirestoreInstance(): Firestore {
  const dbId = (firebaseConfig as any).firestoreDatabaseId || undefined;
  try {
    return initializeFirestore(
      app,
      {},
      dbId
    );
  } catch {
    return dbId ? getFirestore(app, dbId) : getFirestore(app);
  }
}

export const firestoreDb = createFirestoreInstance();

