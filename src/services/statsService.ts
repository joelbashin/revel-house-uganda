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
import { ImpactStat } from '../types';

const COLLECTION = 'stats';

export async function getStats(): Promise<ImpactStat[]> {
  const q = query(collection(db, COLLECTION), orderBy('displayOrder', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as ImpactStat));
}

export async function getPublishedStats(): Promise<ImpactStat[]> {
  const all = await getStats();
  return all.filter((s) => s.published);
}

export async function getStat(id: string): Promise<ImpactStat | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as ImpactStat;
}

export async function createStat(data: Omit<ImpactStat, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateStat(id: string, data: Partial<ImpactStat>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteStat(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
