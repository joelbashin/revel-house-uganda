import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from 'firebase/storage';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { storage, db } from '../firebase/config';

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  path: string;
  kind: 'image' | 'video';
  source: 'storage' | 'firestore';
}

export async function uploadImage(
  file: File,
  path: string
): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  return getDownloadURL(snapshot.ref);
}

export async function deleteImage(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

export function getStoragePath(
  category: 'gallery' | 'programs' | 'projects' | 'articles' | 'pages' | 'general',
  filename: string
): string {
  return `images/${category}/${filename}`;
}

export function getVideoStoragePath(
  category: 'general' | 'gallery',
  filename: string
): string {
  return `videos/${category}/${filename}`;
}

async function listImages(
  category: 'gallery' | 'programs' | 'projects' | 'articles' | 'pages' | 'general'
): Promise<Array<{ name: string; url: string; path: string }>> {
  const folderRef = ref(storage, `images/${category}`);
  const res = await listAll(folderRef);
  const out: Array<{ name: string; url: string; path: string }> = [];
  for (const item of res.items) {
    try {
      out.push({ name: item.name, url: await getDownloadURL(item), path: item.fullPath });
    } catch {
      // skip items we can't resolve
    }
  }
  return out;
}

async function listVideos(
  category: 'general' | 'gallery'
): Promise<Array<{ name: string; url: string; path: string }>> {
  const folderRef = ref(storage, `videos/${category}`);
  const res = await listAll(folderRef);
  const out: Array<{ name: string; url: string; path: string }> = [];
  for (const item of res.items) {
    try {
      out.push({ name: item.name, url: await getDownloadURL(item), path: item.fullPath });
    } catch {
      // skip items we can't resolve
    }
  }
  return out;
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('READ_FAILED'));
    reader.readAsDataURL(file);
  });
}

function compressToDataUrl(file: File, maxDim = 1280, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d', { willReadFrequently: false });
      if (!ctx) {
        reject(new Error('CANVAS_FAILED'));
        return;
      }
      ctx.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('DECODE_FAILED'));
    };
    img.src = objectUrl;
  });
}

const FIRESTORE_BLOB_LIMIT = 850_000;

export async function uploadMediaFile(
  file: File,
  storagePath: string,
  kind: 'image' | 'video'
): Promise<MediaFile> {
  // Prefer Firebase Storage when it is available.
  try {
    const url = await uploadImage(file, storagePath);
    return { id: storagePath, name: file.name, url, path: storagePath, kind, source: 'storage' };
  } catch {
    // Storage not enabled → fall back to Firestore (media collection).
  }

  // For small files, skip compression and use raw data URL directly
  const SMALL_FILE_THRESHOLD = 200_000; // 200KB
  let dataUrl: string;

  if (kind === 'image' && file.size > SMALL_FILE_THRESHOLD) {
    dataUrl = await compressToDataUrl(file);
  } else if (kind === 'image') {
    dataUrl = await fileToDataUrl(file);
  } else {
    dataUrl = await fileToDataUrl(file);
  }

  if (dataUrl.length > FIRESTORE_BLOB_LIMIT) {
    if (kind === 'image') {
      dataUrl = await compressToDataUrl(file, 1024, 0.6);
    }
  }
  if (dataUrl.length > FIRESTORE_BLOB_LIMIT) {
    throw new Error(kind === 'video' ? 'VIDEO_TOO_LARGE' : 'IMAGE_TOO_LARGE');
  }

  const id = `${kind}_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  await setDoc(doc(db, 'media', id), {
    name: file.name,
    kind,
    url: dataUrl,
    mime: file.type,
    createdAt: serverTimestamp(),
  });
  return { id, name: file.name, url: dataUrl, path: `media/${id}`, kind, source: 'firestore' };
}

export async function deleteMediaFile(entry: MediaFile): Promise<void> {
  if (entry.source === 'firestore') {
    await deleteDoc(doc(db, 'media', entry.id));
    return;
  }
  await deleteImage(entry.path);
}

export async function listMediaFiles(): Promise<MediaFile[]> {
  const out: MediaFile[] = [];

  // Files uploaded through the Firestore fallback (image/video docs in `media`).
  try {
    const snap = await getDocs(query(collection(db, 'media'), where('kind', 'in', ['image', 'video'])));
    for (const d of snap.docs) {
      const data = d.data() as { name?: string; url?: unknown; kind?: unknown };
      if (typeof data.url === 'string' && (data.kind === 'image' || data.kind === 'video')) {
        out.push({
          id: d.id,
          name: typeof data.name === 'string' ? data.name : d.id,
          url: data.url,
          path: `media/${d.id}`,
          kind: data.kind,
          source: 'firestore',
        });
      }
    }
  } catch {
    // ignore listing errors
  }

  // Files already present in Firebase Storage (only works when Storage is enabled).
  try {
    const cats = ['general', 'pages', 'gallery', 'programs', 'projects', 'articles'] as const;
    for (const cat of cats) {
      try {
        const items = await listImages(cat);
        for (const f of items) {
          out.push({ id: f.path, name: f.name, url: f.url, path: f.path, kind: 'image', source: 'storage' });
        }
      } catch {
        // folder may not exist yet
      }
    }
    try {
      const vids = await listVideos('general');
      for (const f of vids) {
        out.push({ id: f.path, name: f.name, url: f.url, path: f.path, kind: 'video', source: 'storage' });
      }
    } catch {
      // videos folder may not exist yet
    }
  } catch {
    // Storage not available
  }

  return out;
}