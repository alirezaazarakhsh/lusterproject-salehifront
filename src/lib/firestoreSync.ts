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
const TOMBSTONES_STORAGE_KEY = 'salehi_tombstones_deleted_keys_v2';

/**
 * مدیریت رکوردهای پاک‌شده دائمی (Tombstones):
 * هر موردی که توسط کاربر حذف شود برای همیشه در این لیست ذخیره می‌شود
 * تا حتی با ۱۰۰۰ بار رفرش، ریست حافظه، یا لود مجدد کاتالوگ سرور، هرگز برنگردد.
 */
export function getDeletedKeys(): Set<string> {
  const set = new Set<string>();
  try {
    const raw = localStorage.getItem(TOMBSTONES_STORAGE_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) {
        arr.forEach((k) => {
          if (k !== null && k !== undefined) set.add(String(k).trim());
        });
      }
    }
  } catch {}
  try {
    const sRaw = sessionStorage.getItem(TOMBSTONES_STORAGE_KEY);
    if (sRaw) {
      const arr = JSON.parse(sRaw);
      if (Array.isArray(arr)) {
        arr.forEach((k) => {
          if (k !== null && k !== undefined) set.add(String(k).trim());
        });
      }
    }
  } catch {}
  return set;
}

export function recordDeletedKeys(
  ...keys: (string | number | undefined | null)[]
): void {
  try {
    const current = getDeletedKeys();
    let hasNew = false;
    for (const k of keys) {
      if (k !== undefined && k !== null) {
        const str = String(k).trim();
        if (str && !current.has(str)) {
          current.add(str);
          hasNew = true;
        }
      }
    }
    if (hasNew) {
      const arr = Array.from(current);
      try {
        localStorage.setItem(TOMBSTONES_STORAGE_KEY, JSON.stringify(arr));
      } catch {}
      try {
        sessionStorage.setItem(TOMBSTONES_STORAGE_KEY, JSON.stringify(arr));
      } catch {}
      saveSettingToFirestore('tombstones_deleted_keys', arr).catch(() => {});
    }
  } catch {}
}

export function isItemDeleted(item: any): boolean {
  if (!item) return true;
  const deleted = getDeletedKeys();
  if (item.id !== undefined && item.id !== null && deleted.has(String(item.id))) return true;
  if (item.storyKey && deleted.has(String(item.storyKey))) return true;
  if (item.productKey && deleted.has(String(item.productKey))) return true;
  if (item.slug && deleted.has(String(item.slug))) return true;
  if (item.key && deleted.has(String(item.key))) return true;
  return false;
}

/**
 * ذخیره و خواندن مستقیم در Cloud Firestore برای حفظ دائمی اطلاعات
 * حتی در صورت پاک کردن کش یا لوکال استوریج مرورگر
 */

function withTimeout<T>(promise: Promise<T>, timeoutMs = 3500, fallback: T): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((resolve) => setTimeout(() => resolve(fallback), timeoutMs)),
  ]);
}

export async function deleteDocumentFromFirestore(collectionName: string, docIdOrKey: string | number): Promise<boolean> {
  if (!docIdOrKey && docIdOrKey !== 0) return false;
  const targetStr = String(docIdOrKey);
  recordDeletedKeys(targetStr);
  try {
    // ۱. حذف مستقیم با شناسه سند
    const docRef = doc(firestoreDb, collectionName, targetStr);
    await withTimeout(deleteDoc(docRef), 3000, null);

    // ۲. بررسی وجود سندهایی با این فیلد یا کلید
    try {
      const colRef = collection(firestoreDb, collectionName);
      const snap = await withTimeout(getDocs(colRef), 3000, null as any);
      if (snap && !snap.empty) {
        for (const docSnap of snap.docs) {
          const data = docSnap.data();
          if (
            docSnap.id === targetStr ||
            String(data.id) === targetStr ||
            String(data.storyKey) === targetStr ||
            String(data.productKey) === targetStr ||
            String(data.slug) === targetStr
          ) {
            await deleteDoc(docSnap.ref).catch(() => {});
          }
        }
      }
    } catch {}

    return true;
  } catch (err) {
    console.warn(`Notice deleting document ${targetStr} from Firestore collection ${collectionName}:`, err);
    return false;
  }
}

export async function addMessageToFirestore(message: any): Promise<string | null> {
  try {
    const colRef = collection(firestoreDb, MESSAGES_COLLECTION);
    const docRef = await withTimeout(
      addDoc(colRef, {
        ...message,
        createdAt: message.createdAt || new Date().toISOString(),
      }),
      4000,
      null as any
    );
    return docRef ? docRef.id : null;
  } catch (err) {
    console.warn('Could not add message to Cloud Firestore (offline fallback used):', err);
    return null;
  }
}

export async function fetchCollectionFromFirestore(collectionName: string): Promise<any[]> {
  try {
    const colRef = collection(firestoreDb, collectionName);
    const snap = await withTimeout(getDocs(colRef), 3500, null as any);
    if (snap && !snap.empty) {
      return snap.docs
        .map((d: any) => ({ ...d.data(), _firestoreDocId: d.id }))
        .filter((item: any) => !isItemDeleted(item));
    }
  } catch (err) {
    console.warn(`Could not fetch collection ${collectionName} from Firestore:`, err);
  }
  return [];
}

export async function fetchAllDataFromFirestore(): Promise<any | null> {
  try {
    const remoteTombstones = await getSettingFromFirestore('tombstones_deleted_keys');
    if (Array.isArray(remoteTombstones)) {
      recordDeletedKeys(...remoteTombstones);
    }

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
      const snap = await withTimeout(getDoc(docRef), 3000, null as any);
      if (snap && snap.exists()) {
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
    const validIds = new Set<string>();

    for (const item of items) {
      if (isItemDeleted(item)) continue;
      const docId = String(item.id || item.productKey || item.slug || Math.random().toString(36).substr(2, 9));
      validIds.add(docId);
      if (item.id !== undefined && item.id !== null) validIds.add(String(item.id));
      if (item.storyKey) validIds.add(String(item.storyKey));
      if (item.productKey) validIds.add(String(item.productKey));
      if (item.slug) validIds.add(String(item.slug));

      // Check if individual item is too large (Firestore limit is 1MB, we use 800KB to be safe)
      const itemSize = JSON.stringify(item).length;
      if (itemSize > 800000) {
        console.warn(`Item ${docId} in ${collectionName} is too large (${itemSize} bytes). Skipping Firestore sync for this item.`);
        continue;
      }

      await setDoc(doc(colRef, docId), item, { merge: true });
    }

    // پاکسازی کامل اسناد حذف‌شده از دیتابیس ابری فایربیس
    try {
      const snap = await withTimeout(getDocs(colRef), 3500, null as any);
      if (snap && !snap.empty) {
        for (const docSnap of snap.docs) {
          const docId = docSnap.id;
          const data = docSnap.data();
          const shouldDelete =
            isItemDeleted(data) ||
            (!validIds.has(docId) &&
              (!data.id || !validIds.has(String(data.id))) &&
              (!data.storyKey || !validIds.has(String(data.storyKey))) &&
              (!data.productKey || !validIds.has(String(data.productKey))) &&
              (!data.slug || !validIds.has(String(data.slug))));

          if (shouldDelete) {
            await deleteDoc(docSnap.ref).catch(() => {});
          }
        }
      }
    } catch (pruneErr) {
      console.warn(`Pruning notice for ${collectionName}:`, pruneErr);
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
    const snap = await withTimeout(getDoc(docRef), 3000, null as any);
    if (snap && snap.exists()) {
      return snap.data()?.data ?? snap.data();
    }
  } catch (err) {
    console.warn(`Could not get setting ${key} from Firestore:`, err);
  }
  return null;
}
