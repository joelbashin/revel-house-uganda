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
import { Program } from '../types';

const COLLECTION = 'programs';

export async function getPrograms(): Promise<Program[]> {
  const q = query(collection(db, COLLECTION), orderBy('title', 'asc'));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Program));
}

export async function getPublishedPrograms(): Promise<Program[]> {
  const all = await getPrograms();
  return all.filter((p) => p.published);
}

export async function getProgram(id: string): Promise<Program | null> {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Program;
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const all = await getPrograms();
  return all.find((p) => p.slug === slug) || null;
}

export async function createProgram(data: Omit<Program, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateProgram(id: string, data: Partial<Program>): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteProgram(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}
