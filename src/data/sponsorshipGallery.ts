import {
  initialPrograms,
  initialProjects,
  initialArticles,
  initialImpactStats,
  initialOrgSettings,
} from './cmsData';

export interface GalleryPhoto {
  id: string;
  image: string;
  title: string;
  location: string;
  date: string;
  category: string;
  credit: string;
  description: string;
  link?: string;
  ratio: 'landscape' | 'portrait';
}

export const ORGANIZATION_NAME = initialOrgSettings.name;
export const ORGANIZATION_COUNTRY = initialOrgSettings.country;
export const FOUNDED_YEAR = initialOrgSettings.foundedYear;

const categoryLink: Record<string, string> = {};
for (const program of initialPrograms) {
  categoryLink[program.category] = `/programs/${program.slug}`;
}

// A document photo captured on a `sp*` storage frame. All textual content is
// sourced from the existing CMS seed (programs, projects, articles, stats),
// never invented. Only the image-to-theme assignment is authored here.
const entries: Array<{
  image: string;
  ratio: 'landscape' | 'portrait';
  title: string;
  location: string;
  date: string;
  category: string;
  description: string;
}> = [
  {
    image: '/images/sp2.jpeg',
    ratio: 'landscape',
    title: initialPrograms[3].title,
    location: initialProjects[3].location,
    date: initialProjects[3].updates[0].date,
    category: initialPrograms[3].category,
    description: initialPrograms[3].shortDescription,
  },
  {
    image: '/images/sp7.jpeg',
    ratio: 'portrait',
    title: 'Protection & Safe Care',
    location: initialProjects[0].location,
    date: initialImpactStats[2].date,
    category: initialPrograms[0].category,
    description: initialImpactStats[2].description,
  },
  {
    image: '/images/sp3.jpeg',
    ratio: 'landscape',
    title: initialPrograms[1].title,
    location: initialProjects[1].location,
    date: initialImpactStats[1].date,
    category: initialPrograms[1].category,
    description: initialPrograms[1].shortDescription,
  },
  {
    image: '/images/sp8.jpeg',
    ratio: 'portrait',
    title: initialProjects[0].title,
    location: initialProjects[0].location,
    date: initialProjects[0].updates[0].date,
    category: initialPrograms[4].category,
    description: initialProjects[0].summary,
  },
  {
    image: '/images/sp4.jpeg',
    ratio: 'landscape',
    title: 'Nutritious Food',
    location: initialProjects[2].location,
    date: initialImpactStats[0].date,
    category: initialPrograms[3].category,
    description: initialProjects[3].summary,
  },
  {
    image: '/images/sp9.jpeg',
    ratio: 'portrait',
    title: initialArticles[2].title,
    location: initialProjects[0].location,
    date: initialArticles[2].publishedDate,
    category: initialPrograms[0].category,
    description: initialArticles[2].excerpt,
  },
  {
    image: '/images/sp5.jpeg',
    ratio: 'landscape',
    title: initialPrograms[2].title,
    location: initialProjects[2].location,
    date: initialProjects[2].updates[0].date,
    category: initialPrograms[2].category,
    description: initialPrograms[2].shortDescription,
  },
  {
    image: '/images/sp10.jpeg',
    ratio: 'portrait',
    title: 'Healthcare & Checkups',
    location: initialProjects[2].location,
    date: initialProjects[2].updates[0].date,
    category: initialPrograms[2].category,
    description: initialProjects[2].summary,
  },
  {
    image: '/images/sp6.jpeg',
    ratio: 'landscape',
    title: initialPrograms[4].title,
    location: initialProjects[0].location,
    date: initialProjects[1].updates[0].date,
    category: initialPrograms[4].category,
    description: initialPrograms[4].shortDescription,
  },
  {
    image: '/images/sp11.jpeg',
    ratio: 'portrait',
    title: initialArticles[0].title,
    location: initialProjects[0].location,
    date: initialArticles[0].publishedDate,
    category: initialPrograms[4].category,
    description: initialArticles[0].excerpt,
  },
  {
    image: '/images/sp13.jpeg',
    ratio: 'landscape',
    title: initialPrograms[3].title,
    location: initialProjects[1].location,
    date: initialImpactStats[3].date,
    category: initialPrograms[3].category,
    description: initialProjects[1].summary,
  },
  {
    image: '/images/sp14.jpeg',
    ratio: 'landscape',
    title: initialPrograms[1].title,
    location: initialProjects[1].location,
    date: initialArticles[1].publishedDate,
    category: initialPrograms[1].category,
    description: initialArticles[1].excerpt,
  },
  {
    image: '/images/sp15.jpeg',
    ratio: 'landscape',
    title: 'Your Promise In Action',
    location: initialProjects[1].location,
    date: 'Verified 2026',
    category: initialPrograms[1].category,
    description: initialPrograms[1].impactSummary,
  },
  {
    image: '/images/sp12.jpeg',
    ratio: 'portrait',
    title: 'Hope, delivered daily',
    location: initialProjects[1].location,
    date: initialImpactStats[3].date,
    category: initialPrograms[0].category,
    description: initialImpactStats[2].description,
  },
];

export const sponsorshipPhotos: GalleryPhoto[] = entries.map((entry, idx) => ({
  id: `photo-${String(idx + 1).padStart(2, '0')}`,
  image: entry.image,
  ratio: entry.ratio,
  title: entry.title,
  location: entry.location,
  date: entry.date,
  category: entry.category,
  credit: `${ORGANIZATION_NAME} · Field Archive`,
  description: entry.description,
  link: categoryLink[entry.category] || '/programs',
}));

export const galleryCategories: Array<{ name: string; count: number }> = (() => {
  const counts = new Map<string, number>();
  for (const photo of sponsorshipPhotos) {
    counts.set(photo.category, (counts.get(photo.category) || 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
})();