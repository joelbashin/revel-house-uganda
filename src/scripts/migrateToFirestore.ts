import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDocs,
  collection,
  serverTimestamp,
} from 'firebase/firestore';
import {
  initialOrgSettings,
  initialPrograms,
  initialProjects,
  initialImpactStats,
  initialArticles,
} from '../data/cmsData';
import { sponsorshipPhotos } from '../data/sponsorshipGallery';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function migrateCollection<T extends { id: string }>(
  collectionName: string,
  items: T[],
  mapFn?: (item: T) => Record<string, unknown>
): Promise<void> {
  console.log(`Migrating ${collectionName}...`);
  for (const item of items) {
    const data = mapFn ? mapFn(item) : item;
    const { id, ...rest } = data as T & Record<string, unknown>;
    await setDoc(doc(db, collectionName, id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    console.log(`  ✓ ${collectionName}/${id}`);
  }
  console.log(`  ${collectionName} migration complete.`);
}

export async function runMigration(): Promise<void> {
  console.log('=== Revel House Uganda CMS Migration ===\n');

  // 1. Site Settings
  console.log('Migrating site_settings...');
  await setDoc(doc(db, 'site_settings', 'global'), {
    ...initialOrgSettings,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  console.log('  ✓ site_settings/global');

  // 2. Programs
  await migrateCollection('programs', initialPrograms);

  // 3. Projects
  await migrateCollection('projects', initialProjects);

  // 4. Articles
  await migrateCollection('articles', initialArticles);

  // 5. Impact Stats
  await migrateCollection('stats', initialImpactStats);

  // 6. Sponsorship Gallery Photos
  console.log('Migrating sponsorship_photos...');
  for (const photo of sponsorshipPhotos) {
    await setDoc(doc(db, 'sponsorship_photos', photo.id), {
      image_path: photo.image,
      aspect_ratio: photo.ratio,
      title: photo.title,
      location: photo.location,
      photo_date: photo.date,
      category: photo.category,
      credit: photo.credit,
      description: photo.description,
      link: photo.link || null,
      display_order: parseInt(photo.id.replace('photo-', ''), 10),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    console.log(`  ✓ sponsorship_photos/${photo.id}`);
  }
  console.log('  sponsorship_photos migration complete.');

  // Verify
  console.log('\n=== Verification ===');
  const collections = ['programs', 'projects', 'articles', 'stats', 'sponsorship_photos', 'site_settings'];
  for (const col of collections) {
    const snap = await getDocs(collection(db, col));
    console.log(`${col}: ${snap.size} documents`);
  }

  console.log('\n=== Migration Complete ===');
}

// Auto-run when imported directly
if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>).__rhuMigration = runMigration;
  console.log('Migration loaded. Run window.__rhuMigration() in browser console to execute.');
}
