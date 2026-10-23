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
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { GalleryPhoto } from '../types/gallery';

const COLLECTION = 'sponsorship_photos';

export async function getGalleryPhotos(): Promise<GalleryPhoto[]> {
  const q = query(collection(db, COLLECTION), orderBy('display_order', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as GalleryPhoto));
}

export async function getPhoto(id: string): Promise<GalleryPhoto | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as GalleryPhoto;
}

export async function createPhoto(data: Omit<GalleryPhoto, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePhoto(id: string, data: Partial<GalleryPhoto>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updated_at: serverTimestamp(),
  });
}

export async function deletePhoto(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
