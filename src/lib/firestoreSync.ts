import { firestoreDb } from './firebase';

const SETTINGS_COLLECTION = 'salehi_settings';
const MESSAGES_COLLECTION = 'messages';
const FIRESTORE_STATE_DOC = 'global_state_v1';

let inMemoryDeletedKeys: Set<string> = new Set();

export async function loadDeletedKeysFromFirestore(): Promise<void> {
  // Local-first: no remote dependency required
}

export function getDeletedKeys(): Set<string> {
  return inMemoryDeletedKeys;
}

export async function recordDeletedKeys(
  ...keys: (string | number | undefined | null)[]
): Promise<void> {
  for (const k of keys) {
    if (k !== undefined && k !== null) {
      const str = String(k).trim();
      if (str) {
        inMemoryDeletedKeys.add(str);
      }
    }
  }
}

export function isItemDeleted(item: any): boolean {
  if (!item) return true;
  if (item.id !== undefined && item.id !== null && inMemoryDeletedKeys.has(String(item.id))) return true;
  if (item.storyKey && inMemoryDeletedKeys.has(String(item.storyKey))) return true;
  if (item.productKey && inMemoryDeletedKeys.has(String(item.productKey))) return true;
  if (item.slug && inMemoryDeletedKeys.has(String(item.slug))) return true;
  if (item.key && inMemoryDeletedKeys.has(String(item.key))) return true;
  return false;
}

export async function deleteDocumentFromFirestore(_collectionName: string, docIdOrKey: string | number): Promise<boolean> {
  if (!docIdOrKey && docIdOrKey !== 0) return false;
  recordDeletedKeys(docIdOrKey);
  return true;
}

export async function addMessageToFirestore(_message: any): Promise<string | null> {
  return null;
}

export async function fetchCollectionFromFirestore(_collectionName: string): Promise<any[]> {
  return [];
}

export async function fetchAllDataFromFirestore(_retries = 1): Promise<any | null> {
  return null;
}

export async function saveCollectionToFirestore(_collectionName: string, _items: any[]): Promise<boolean> {
  return true;
}

export async function saveAllDataToFirestore(_data: any): Promise<boolean> {
  return true;
}

export async function saveSettingToFirestore(_key: string, _value: any): Promise<boolean> {
  return true;
}

export async function getSettingFromFirestore(_key: string): Promise<any | null> {
  return null;
}

