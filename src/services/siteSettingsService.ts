import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/config';
import { OrganizationSettings } from '../types';

const DOC_PATH = 'site_settings/global';

export async function getSiteSettings(): Promise<OrganizationSettings | null> {
  const snap = await getDoc(doc(db, DOC_PATH));
  if (!snap.exists()) return null;
  return snap.data() as OrganizationSettings;
}

export async function updateSiteSettings(settings: OrganizationSettings): Promise<void> {
  await setDoc(doc(db, DOC_PATH), {
    ...settings,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}
