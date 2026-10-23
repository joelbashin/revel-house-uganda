import { collection, doc, getDocs, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  initialArticles,
  initialImpactStats,
  initialOrgSettings,
  initialPrograms,
  initialProjects,
} from '../data/cmsData';
import { sponsorshipPhotos } from '../data/sponsorshipGallery';

export interface MigrationResult {
  programs: number;
  projects: number;
  articles: number;
  stats: number;
  gallery: number;
  settings: boolean;
}

async function seedDocs<T extends { id: string }>(
  collectionName: string,
  items: T[]
): Promise<number> {
  for (const item of items) {
    const { id, ...rest } = item;
    await setDoc(doc(db, collectionName, id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  return items.length;
}

export async function seedCmsData(): Promise<MigrationResult> {
  await setDoc(doc(db, 'site_settings', 'global'), {
    ...initialOrgSettings,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });

  const programs = await seedDocs('programs', initialPrograms);
  const projects = await seedDocs('projects', initialProjects);
  const articles = await seedDocs('articles', initialArticles);
  const stats = await seedDocs('stats', initialImpactStats);

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
    }, { merge: true });
  }

  return {
    programs,
    projects,
    articles,
    stats,
    gallery: sponsorshipPhotos.length,
    settings: true,
  };
}

export async function isCmsEmpty(): Promise<boolean> {
  const [programs, projects, articles, stats, gallery] = await Promise.all([
    getDocs(collection(db, 'programs')),
    getDocs(collection(db, 'projects')),
    getDocs(collection(db, 'articles')),
    getDocs(collection(db, 'stats')),
    getDocs(collection(db, 'sponsorship_photos')),
  ]);
  return programs.empty && projects.empty && articles.empty && stats.empty && gallery.empty;
}
