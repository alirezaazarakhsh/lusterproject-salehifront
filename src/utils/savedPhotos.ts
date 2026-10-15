export interface SavedPhotoItem {
  id: string;
  url: string;
  title: string;
  subtitle?: string;
  savedAt: string;
}

const STORAGE_KEY = 'akbar_salehi_saved_photos_v1';

export function getSavedPhotos(): SavedPhotoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to get saved photos:', e);
    return [];
  }
}

export function savePhotoItem(item: Omit<SavedPhotoItem, 'savedAt'>): void {
  try {
    const current = getSavedPhotos();
    if (current.some((p) => p.id === item.id || p.url === item.url)) {
      return; // already saved
    }
    const newItem: SavedPhotoItem = {
      ...item,
      savedAt: new Date().toISOString(),
    };
    const updated = [newItem, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('saved-photos-updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to save photo:', e);
  }
}

export function removeSavedPhoto(idOrUrl: string): void {
  try {
    const current = getSavedPhotos();
    const updated = current.filter((p) => p.id !== idOrUrl && p.url !== idOrUrl);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('saved-photos-updated', { detail: updated }));
  } catch (e) {
    console.error('Failed to remove saved photo:', e);
  }
}

export function isPhotoSaved(idOrUrl: string): boolean {
  const current = getSavedPhotos();
  return current.some((p) => p.id === idOrUrl || p.url === idOrUrl);
}

export async function downloadImageFile(url: string, filename = 'chandelier-image.jpg'): Promise<boolean> {
  try {
    const response = await fetch(url, { mode: 'cors' });
    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;
  } catch (e) {
    // Fallback direct open or link click
    try {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return true;
    } catch (err) {
      console.error('Download image failed:', err);
      window.open(url, '_blank');
      return false;
    }
  }
}
