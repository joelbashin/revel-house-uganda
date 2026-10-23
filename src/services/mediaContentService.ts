import {
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface MediaContent {
  sectionKey: string;
  imageUrl: string;
}

const COLLECTION = 'media';
const CONTENT_KIND = 'content';

async function buildMap(): Promise<Map<string, string>> {
  const snap = await getDocs(query(collection(db, COLLECTION), where('kind', '==', CONTENT_KIND)));
  const map = new Map<string, string>();
  for (const d of snap.docs) {
    map.set(d.id, d.data().url as string);
  }
  return map;
}

export async function getAllMediaContent(): Promise<MediaContent[]> {
  const map = await buildMap();
  return Array.from(map.entries()).map(([sectionKey, imageUrl]) => ({ sectionKey, imageUrl }));
}

export async function getMediaContent(sectionKey: string): Promise<string | null> {
  const d = await getDoc(doc(db, COLLECTION, sectionKey));
  if (d.exists() && d.data().kind === CONTENT_KIND) {
    return d.data().url as string;
  }
  return null;
}

export async function setMediaContent(sectionKey: string, imageUrl: string): Promise<void> {
  await setDoc(
    doc(db, COLLECTION, sectionKey),
    { kind: CONTENT_KIND, url: imageUrl, updatedAt: serverTimestamp() },
    { merge: true }
  );
}

export async function deleteMediaContent(sectionKey: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, sectionKey));
}