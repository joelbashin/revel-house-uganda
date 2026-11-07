import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';

function getAdminEmail(): string {
  const email = (import.meta.env.VITE_ADMIN_AUTH_EMAIL || '').trim();
  if (!email) {
    throw new Error('Admin sign-in is not configured.');
  }
  return email;
}

export interface AdminUser {
  uid: string;
  email: string;
  role: string;
  active: boolean;
}

async function loadAdminRecord(uid: string): Promise<AdminUser | null> {
  const adminDoc = await getDoc(doc(db, 'admins', uid));
  if (!adminDoc.exists()) return null;

  const data = adminDoc.data() as { email?: string; role?: string; active?: boolean };
  if (data.role !== 'admin' || data.active !== true) return null;

  return {
    uid,
    email: data.email || '',
    role: data.role,
    active: data.active,
  };
}

export async function loginWithPassword(password: string): Promise<AdminUser> {
  const userCredential = await signInWithEmailAndPassword(auth, getAdminEmail(), password);
  let admin: AdminUser | null = null;
  try {
    admin = await loadAdminRecord(userCredential.user.uid);
  } catch {
    admin = null;
  }

  if (!admin) {
    await signOut(auth);
    throw new Error('Access denied. Your admin account is inactive or unauthorized.');
  }

  return admin;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function verifyAdminStatus(uid: string): Promise<AdminUser | null> {
  try {
    const current = auth.currentUser;
    if (!current || current.uid !== uid) return null;
    return await loadAdminRecord(uid);
  } catch {
    return null;
  }
}
