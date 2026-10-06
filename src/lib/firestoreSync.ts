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

export async function fetchCollectionFromFirestore(collectionName: string): Promise<any[]> {
  try {
    const colRef = collection(firestoreDb, collectionName);
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((d) => d.data());
    }
  } catch (err) {
    console.warn(`Could not fetch collection ${collectionName} from Firestore:`, err);
  }
  return [];
}

export async function fetchAllDataFromFirestore(): Promise<any | null> {
  try {
    const [products, projects, categories, orders, articles, stories] = await Promise.all([
      fetchCollectionFromFirestore('products'),
      fetchCollectionFromFirestore('projects'),
      fetchCollectionFromFirestore('categories'),
      fetchCollectionFromFirestore('orders'),
      fetchCollectionFromFirestore('articles'),
      fetchCollectionFromFirestore('stories'),
    ]);

    const settingsKeys = [
      'footerSettings', 'contactUsSettings', 'aboutUsSettings', 
      'heroSliderSettings', 'mainSettings', 'smsSettings', 'faqSettings'
    ];

    const settingsObj: Record<string, any> = {};
    await Promise.all(
      settingsKeys.map(async (key) => {
        const val = await getSettingFromFirestore(key);
        if (val) {
          settingsObj[key] = val;
        }
      })
    );

    let globalState: any = null;
    try {
      const docRef = doc(firestoreDb, SETTINGS_COLLECTION, FIRESTORE_STATE_DOC);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        globalState = snap.data();
      }
    } catch {}

    const hasCollectionsData =
      products.length > 0 ||
      projects.length > 0 ||
      categories.length > 0 ||
      stories.length > 0 ||
      articles.length > 0 ||
      Object.keys(settingsObj).length > 0;

    if (hasCollectionsData) {
      return {
        products: products.length > 0 ? products : globalState?.products,
        projects: projects.length > 0 ? projects : globalState?.projects,
        categories: categories.length > 0 ? categories : globalState?.categories,
        orders: orders.length > 0 ? orders : globalState?.orders,
        articles: articles.length > 0 ? articles : globalState?.articles,
        stories: stories.length > 0 ? stories : globalState?.stories,
        users: globalState?.users || [],
        messages: globalState?.messages || [],
        ...settingsObj,
      };
    }

    if (globalState) {
      return globalState;
    }
  } catch (err) {
    console.warn('Could not fetch all data from Cloud Firestore:', err);
  }
  return null;
}

export async function saveCollectionToFirestore(collectionName: string, items: any[]): Promise<boolean> {
  try {
    const colRef = collection(firestoreDb, collectionName);
    for (const item of items) {
       const docId = String(item.id || item.productKey || item.slug || Math.random().toString(36).substr(2, 9));
       
       // Check if individual item is too large (Firestore limit is 1MB, we use 800KB to be safe)
       const itemSize = JSON.stringify(item).length;
       if (itemSize > 800000) {
         console.warn(`Item ${docId} in ${collectionName} is too large (${itemSize} bytes). Skipping Firestore sync for this item.`);
         continue;
       }
       
       await setDoc(doc(colRef, docId), item, { merge: true });
    }
    return true;
  } catch (err) {
    console.error(`Error saving collection ${collectionName} to Cloud Firestore:`, err);
    return false;
  }
}

export async function saveAllDataToFirestore(data: any): Promise<boolean> {
  try {
    // Save main collections individually
    await saveCollectionToFirestore('products', data.products || []);
    await saveCollectionToFirestore('projects', data.projects || []);
    await saveCollectionToFirestore('categories', data.categories || []);
    await saveCollectionToFirestore('orders', data.orders || []);
    await saveCollectionToFirestore('articles', data.articles || []);
    await saveCollectionToFirestore('stories', data.stories || []);
    
    // Save settings individually to avoid monolithic document limit
    const settingsKeys = [
      'footerSettings', 'contactUsSettings', 'aboutUsSettings', 
      'heroSliderSettings', 'mainSettings', 'smsSettings', 'faqSettings'
    ];
    
    for (const key of settingsKeys) {
      if (data[key]) {
        await saveSettingToFirestore(key, data[key]);
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error saving all data to Cloud Firestore:', err);
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
