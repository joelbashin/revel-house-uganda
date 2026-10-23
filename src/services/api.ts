import {
  Program,
  Project,
  Article,
  ImpactStat,
  OrganizationSettings,
  ContactSubmission,
  VolunteerSubmission,
  PartnerSubmission,
  DonationSubmission,
  TeamMember,
} from '../types';
import {
  initialOrgSettings,
  initialPrograms,
  initialProjects,
  initialImpactStats,
  initialArticles,
  initialTeam,
} from '../data/cmsData';

// Firestore services (try Firestore first, fall back to cmsData)
import {
  getPrograms as fsGetPrograms,
  getPublishedPrograms as fsGetPublishedPrograms,
  getProgramBySlug as fsGetProgramBySlug,
} from './programsService';
import {
  getProjects as fsGetProjects,
  getPublishedProjects as fsGetPublishedProjects,
  getProjectBySlug as fsGetProjectBySlug,
} from './projectsService';
import {
  getArticles as fsGetArticles,
  getPublishedArticles as fsGetPublishedArticles,
  getArticleBySlug as fsGetArticleBySlug,
} from './articlesService';
import {
  getPublishedStats as fsGetPublishedStats,
} from './statsService';
import {
  getSiteSettings,
  updateSiteSettings,
} from './siteSettingsService';

// localStorage helpers for forms/submissions
const STORAGE_KEYS = {
  CONTACTS: 'rhu_submissions_contacts',
  VOLUNTEERS: 'rhu_submissions_volunteers',
  PARTNERS: 'rhu_submissions_partners',
  DONATIONS: 'rhu_submissions_donations',
};

function getStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, val: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // ignore
  }
}

// Helper: try async fn, fall back to fallback value
async function withFallback<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getOrgSettings(): Promise<OrganizationSettings> {
  const firestoreSettings = await withFallback(() => getSiteSettings(), null);
  if (firestoreSettings) {
    return {
      ...initialOrgSettings,
      ...firestoreSettings,
      mission: firestoreSettings.mission || initialOrgSettings.mission,
      vision: firestoreSettings.vision || initialOrgSettings.vision,
      goals: firestoreSettings.goals || initialOrgSettings.goals,
      objectives: firestoreSettings.objectives || initialOrgSettings.objectives,
    };
  }
  return initialOrgSettings;
}

export async function updateOrgSettings(settings: OrganizationSettings): Promise<OrganizationSettings> {
  try {
    await updateSiteSettings(settings);
  } catch {
    // Firestore unavailable
  }
  return settings;
}

export async function getPrograms(): Promise<Program[]> {
  return withFallback(
    () => fsGetPublishedPrograms(),
    initialPrograms.filter((p) => p.published)
  );
}

export async function getAllProgramsAdmin(): Promise<Program[]> {
  return withFallback(() => fsGetPrograms(), initialPrograms);
}

export async function getProgramBySlug(slug: string): Promise<Program | null> {
  const progs = await getPrograms();
  return progs.find((p) => p.slug === slug) || null;
}

export async function getProjects(statusFilter?: string): Promise<Project[]> {
  const published = await withFallback(
    () => fsGetPublishedProjects(statusFilter),
    initialProjects.filter((p) => p.published)
  );
  if (!statusFilter || statusFilter === 'ALL') return published;
  return published.filter((p) => p.status === statusFilter);
}

export async function getAllProjectsAdmin(): Promise<Project[]> {
  return withFallback(() => fsGetProjects(), initialProjects);
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) || null;
}

export async function getArticles(): Promise<Article[]> {
  return withFallback(
    () => fsGetPublishedArticles(),
    initialArticles.filter((a) => a.published)
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find((a) => a.slug === slug) || null;
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  return withFallback(
    () => fsGetPublishedStats(),
    initialImpactStats.filter((s) => s.published).sort((a, b) => a.displayOrder - b.displayOrder)
  );
}

export async function getTeamMembers(): Promise<TeamMember[]> {
  return initialTeam;
}

export async function submitContactForm(data: Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>): Promise<{ success: boolean; id: string; message: string }> {
  await new Promise((res) => setTimeout(res, 400));
  const contacts = getStorage<ContactSubmission[]>(STORAGE_KEYS.CONTACTS, []);
  const newSubmission: ContactSubmission = {
    ...data,
    id: 'contact-' + Date.now(),
    createdAt: new Date().toISOString(),
    status: 'UNREAD',
  };
  contacts.unshift(newSubmission);
  setStorage(STORAGE_KEYS.CONTACTS, contacts);
  return {
    success: true,
    id: newSubmission.id,
    message: 'Thank you for reaching out to Revel House Uganda. A coordinator will respond shortly.',
  };
}

export async function submitVolunteerForm(data: Omit<VolunteerSubmission, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
  await new Promise((res) => setTimeout(res, 400));
  const volunteers = getStorage<VolunteerSubmission[]>(STORAGE_KEYS.VOLUNTEERS, []);
  const newApp: VolunteerSubmission = {
    ...data,
    id: 'vol-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  volunteers.unshift(newApp);
  setStorage(STORAGE_KEYS.VOLUNTEERS, volunteers);
  return {
    success: true,
    message: 'Your volunteer application has been received. Our community coordinator will review your profile.',
  };
}

export async function submitPartnerForm(data: Omit<PartnerSubmission, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
  await new Promise((res) => setTimeout(res, 400));
  const partners = getStorage<PartnerSubmission[]>(STORAGE_KEYS.PARTNERS, []);
  const newPartner: PartnerSubmission = {
    ...data,
    id: 'part-' + Date.now(),
    createdAt: new Date().toISOString(),
  };
  partners.unshift(newPartner);
  setStorage(STORAGE_KEYS.PARTNERS, partners);
  return {
    success: true,
    message: 'Partnership inquiry registered. Our leadership team looks forward to connecting with your organization.',
  };
}

export async function createDonation(data: Omit<DonationSubmission, 'id' | 'createdAt' | 'transactionRef' | 'status'>): Promise<{ success: boolean; transactionRef: string; message: string }> {
  await new Promise((res) => setTimeout(res, 600));
  const donations = getStorage<DonationSubmission[]>(STORAGE_KEYS.DONATIONS, []);
  const ref =
    'RHU-' +
    Math.random().toString(36).substring(2, 8).toUpperCase() +
    '-' +
    Math.floor(1000 + Math.random() * 9000);
  const record: DonationSubmission = {
    ...data,
    id: 'don-' + Date.now(),
    transactionRef: ref,
    createdAt: new Date().toISOString(),
    status: 'COMPLETED',
  };
  donations.unshift(record);
  setStorage(STORAGE_KEYS.DONATIONS, donations);
  return {
    success: true,
    transactionRef: ref,
    message: 'Thank you for your generous commitment to community empowerment in Uganda.',
  };
}

export async function getDonations(): Promise<DonationSubmission[]> {
  return getStorage<DonationSubmission[]>(STORAGE_KEYS.DONATIONS, []);
}

export async function getSubmissionsSummary(): Promise<{
  contacts: ContactSubmission[];
  volunteers: VolunteerSubmission[];
  partners: PartnerSubmission[];
  donations: DonationSubmission[];
}> {
  return {
    contacts: getStorage<ContactSubmission[]>(STORAGE_KEYS.CONTACTS, []),
    volunteers: getStorage<VolunteerSubmission[]>(STORAGE_KEYS.VOLUNTEERS, []),
    partners: getStorage<PartnerSubmission[]>(STORAGE_KEYS.PARTNERS, []),
    donations: getStorage<DonationSubmission[]>(STORAGE_KEYS.DONATIONS, []),
  };
}

export function resetCMSData(): void {
  Object.values(STORAGE_KEYS).forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {
      // ignore
    }
  });
}
