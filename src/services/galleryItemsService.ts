import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase/config';
import { GalleryItem } from '../types/gallery';

const COLLECTION = 'gallery_items';
const VIDEO_META_KEY = 'gallery_video_items';

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.readAsDataURL(file);
  });
}

function compressImageFast(file: File, maxDim = 1024, quality = 0.7): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) { reject(new Error('CANVAS_FAILED')); return; }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(c.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('DECODE_FAILED')); };
    img.src = url;
  });
}

async function uploadVideoToStorage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `videos/gallery/${timestamp}-${safeName}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file);
  return new Promise<string>((resolve, reject) => {
    task.on('state_changed', (snap) => {
      const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
      onProgress?.(pct);
    }, reject, async () => {
      resolve(await getDownloadURL(task.snapshot.ref));
    });
  });
}

function getVideoMetaItems(): GalleryItem[] {
  try {
    const raw = localStorage.getItem(VIDEO_META_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveVideoMetaItems(items: GalleryItem[]): void {
  localStorage.setItem(VIDEO_META_KEY, JSON.stringify(items));
}

export async function uploadGalleryFile(
  file: File,
  kind: 'image' | 'video',
  onProgress?: (percent: number) => void
): Promise<string> {
  if (kind === 'video') {
    return uploadVideoToStorage(file, onProgress);
  }

  const SMALL_THRESHOLD = 300_000;

  if (file.size <= SMALL_THRESHOLD) {
    const dataUrl = await readFileAsDataUrl(file);
    const id = `gal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    await setDoc(doc(db, 'gallery_blobs', id), {
      name: file.name, kind, url: dataUrl, mime: file.type, createdAt: serverTimestamp(),
    });
    return dataUrl;
  }

  const dataUrl = await compressImageFast(file);
  const id = `gal_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await setDoc(doc(db, 'gallery_blobs', id), {
    name: file.name, kind, url: dataUrl, mime: file.type, createdAt: serverTimestamp(),
  });
  return dataUrl;
}

export async function getGalleryItems(): Promise<GalleryItem[]> {
  const [firestoreItems, videoItems] = await Promise.all([
    (async () => {
      try {
        const q = query(collection(db, COLLECTION), orderBy('display_order', 'asc'));
        const snap = await getDocs(q);
        return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryItem));
      } catch {
        return [];
      }
    })(),
    Promise.resolve(getVideoMetaItems()),
  ]);

  return [...firestoreItems, ...videoItems].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );
}

export async function getGalleryItem(id: string): Promise<GalleryItem | null> {
  const videoItems = getVideoMetaItems();
  const videoMatch = videoItems.find((v) => v.id === id);
  if (videoMatch) return videoMatch;

  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as GalleryItem;
}

export async function createGalleryItem(data: Omit<GalleryItem, 'id'>): Promise<string> {
  if (data.type === 'video') {
    const id = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const item: GalleryItem = { id, ...data };
    const items = getVideoMetaItems();
    items.push(item);
    saveVideoMetaItems(items);
    return id;
  }

  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateGalleryItem(id: string, data: Partial<GalleryItem>): Promise<void> {
  if (id.startsWith('vid_')) {
    const items = getVideoMetaItems();
    const idx = items.findIndex((v) => v.id === id);
    if (idx !== -1) {
      items[idx] = { ...items[idx], ...data };
      saveVideoMetaItems(items);
    }
    return;
  }

  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

export async function deleteGalleryItem(id: string): Promise<void> {
  if (id.startsWith('vid_')) {
    const items = getVideoMetaItems();
    saveVideoMetaItems(items.filter((v) => v.id !== id));
    return;
  }

  await deleteDoc(doc(db, COLLECTION, id));
}
