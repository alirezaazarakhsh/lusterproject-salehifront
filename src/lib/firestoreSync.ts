import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { firestoreDb } from './firebase';

const FIRESTORE_STATE_DOC = 'global_state_v1';
const SETTINGS_COLLECTION = 'salehi_settings';
const MESSAGES_COLLECTION = 'messages';

/**
 * ذخیره و خواندن مستقیم در Cloud Firestore برای حفظ دائمی اطلاعات
 * حتی در صورت پاک کردن کش یا لوکال استوریج مرورگر
 */

export async function addMessageToFirestore(message: any): Promise<string | null> {
  try {
    const colRef = collection(firestoreDb, MESSAGES_COLLECTION);
    const docRef = await addDoc(colRef, {
      ...message,
      createdAt: message.createdAt || new Date().toISOString(),
    });
    return docRef.id;
  } catch (err) {
    console.error('Error adding message to Cloud Firestore:', err);
    return null;
  }
}

export async function fetchAllDataFromFirestore(): Promise<any | null> {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, FIRESTORE_STATE_DOC);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (err) {
    console.warn('Could not fetch from Firestore global doc:', err);
  }
  return null;
}

export async function saveAllDataToFirestore(data: any): Promise<boolean> {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, FIRESTORE_STATE_DOC);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error('Error saving to Cloud Firestore:', err);
    return false;
  }
}

export async function saveSettingToFirestore(key: string, value: any): Promise<boolean> {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, key);
    await setDoc(docRef, {
      data: value,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
    return true;
  } catch (err) {
    console.error(`Error saving setting ${key} to Firestore:`, err);
    return false;
  }
}

export async function getSettingFromFirestore(key: string): Promise<any | null> {
  try {
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, key);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data()?.data ?? snap.data();
    }
  } catch (err) {
    console.warn(`Could not get setting ${key} from Firestore:`, err);
  }
  return null;
}
