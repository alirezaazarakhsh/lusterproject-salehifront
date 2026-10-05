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

export async function saveCollectionToFirestore(collectionName: string, items: any[]): Promise<boolean> {
  try {
    const colRef = collection(firestoreDb, collectionName);
    // Simple implementation: for large collections, this needs to be chunked or managed differently
    // but for now, we just update the global doc for smaller settings and individual docs for items if possible.
    // Given the previous monolithic approach, let's start by splitting the main collections.
    for (const item of items) {
       // Assuming items have an 'id' or 'productKey' to use as doc ID
       const docId = String(item.id || item.productKey || item.slug || Math.random().toString(36).substr(2, 9));
       await setDoc(doc(colRef, docId), item, { merge: true });
    }
    return true;
  } catch (err) {
    console.error(`Error saving collection ${collectionName} to Cloud Firestore:`, err);
    return false;
  }
}

export async function saveAllDataToFirestore(data: any): Promise<boolean> {
  // Refactored to save collections individually to avoid size limits
  try {
    await saveCollectionToFirestore('products', data.products || []);
    await saveCollectionToFirestore('projects', data.projects || []);
    await saveCollectionToFirestore('categories', data.categories || []);
    await saveCollectionToFirestore('orders', data.orders || []);
    
    // Save smaller settings in the main doc
    const { products, projects, categories, orders, messages, ...settings } = data;
    const docRef = doc(firestoreDb, SETTINGS_COLLECTION, FIRESTORE_STATE_DOC);
    await setDoc(docRef, {
      ...settings,
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
