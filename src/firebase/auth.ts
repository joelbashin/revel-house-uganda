import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from './config';

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_AUTH_EMAIL || 'admin@revelhouseuganda.org';

export interface AdminUser {
  uid: string;
  email: string;
  role: string;
  active: boolean;
}

async function bootstrapAdminRecord(firebaseUser: User): Promise<AdminUser> {
  const adminRef = doc(db, 'admins', firebaseUser.uid);
  const adminDoc = await getDoc(adminRef);

  if (!adminDoc.exists()) {
    const email = firebaseUser.email || ADMIN_EMAIL;
    await setDoc(adminRef, {
      email,
      role: 'admin',
      active: true,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return {
      uid: firebaseUser.uid,
      email,
      role: 'admin',
      active: true,
    };
  }

  const adminData = adminDoc.data() as { email: string; role: string; active: boolean };

  if (adminData.role !== 'admin' || !adminData.active) {
    await signOut(auth);
    throw new Error('Access denied. Your admin account is inactive or unauthorized.');
  }

  return {
    uid: firebaseUser.uid,
    email: adminData.email,
    role: adminData.role,
    active: adminData.active,
  };
}

export async function loginWithPassword(password: string): Promise<AdminUser> {
  const userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
  try {
    return await bootstrapAdminRecord(userCredential.user);
  } catch (err) {
    await signOut(auth);
    throw err;
  }
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
    if (current && current.uid === uid) {
      try {
        return await bootstrapAdminRecord(current);
      } catch {
        return null;
      }
    }

    const adminDoc = await getDoc(doc(db, 'admins', uid));
    if (!adminDoc.exists()) return null;

    const data = adminDoc.data() as { email: string; role: string; active: boolean };
    if (data.role !== 'admin' || !data.active) return null;

    return {
      uid,
      email: data.email,
      role: data.role,
      active: data.active,
    };
  } catch {
    return null;
  }
}
