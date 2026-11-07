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
import {
  createContactSubmission,
  createVolunteerSubmission,
  createPartnerSubmission,
  createDonationPledge,
  getDonations as fsGetDonations,
  getSubmissionsSummary as fsGetSubmissionsSummary,
} from './submissionsService';


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
  const id = await createContactSubmission(data);
  return {
    success: true,
    id,
    message: 'Thank you for reaching out to Revel House Uganda. A coordinator will respond shortly.',
  };
}

export async function submitVolunteerForm(data: Omit<VolunteerSubmission, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
  await createVolunteerSubmission(data);
  return {
    success: true,
    message: 'Your volunteer application has been received. Our community coordinator will review your profile.',
  };
}

export async function submitPartnerForm(data: Omit<PartnerSubmission, 'id' | 'createdAt'>): Promise<{ success: boolean; message: string }> {
  await createPartnerSubmission(data);
  return {
    success: true,
    message: 'Partnership inquiry registered. Our leadership team looks forward to connecting with your organization.',
  };
}

export async function createDonation(data: Omit<DonationSubmission, 'id' | 'createdAt' | 'transactionRef' | 'status'>): Promise<{ success: boolean; transactionRef: string; message: string }> {
  const { transactionRef } = await createDonationPledge(data);
  return {
    success: true,
    transactionRef,
    message: 'Your pledge has been recorded. It will be marked as a completed donation only after our finance team verifies the bank transfer.',
  };
}

export async function getDonations(): Promise<DonationSubmission[]> {
  return fsGetDonations();
}

export async function getSubmissionsSummary(): Promise<{
  contacts: ContactSubmission[];
  volunteers: VolunteerSubmission[];
  partners: PartnerSubmission[];
  donations: DonationSubmission[];
}> {
  return fsGetSubmissionsSummary();
}