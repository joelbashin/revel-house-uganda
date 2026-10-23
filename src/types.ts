export type ProjectStatus = 'PLANNED' | 'ONGOING' | 'SEEKING FUNDING' | 'COMPLETED';

export type ProgramCategory = 
  | 'Child Care & Protection'
  | 'Education'
  | 'Health & Medical Care'
  | 'Community Outreach'
  | 'Agriculture & Sustainability'
  | 'WASH & Hygiene';

export interface Program {
  id: string;
  title: string;
  slug: string;
  category: ProgramCategory;
  shortDescription: string;
  description: string;
  status: 'ACTIVE' | 'SCALING' | 'PILOT';
  objectives: string[];
  activities: string[];
  impactSummary: string;
  relatedProjects: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  aspectRatio?: string;
}

export interface ProjectUpdate {
  date: string;
  title: string;
  summary: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  status: ProjectStatus;
  location: string;
  summary: string;
  problem: string;
  whyItMatters: string;
  objectives: string[];
  activities: string[];
  progressPercentage: number;
  fundingGoal?: number;
  amountRaised?: number;
  currency?: string;
  whatIsNeeded: string[];
  updates: ProjectUpdate[];
  relatedProgramSlug: string;
  supportEnabled: boolean;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  isWASH?: boolean;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  category: string;
  author: string;
  authorRole: string;
  publishedDate: string;
  readTime: string;
  excerpt: string;
  content: string[];
  relatedProjectSlug?: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

export interface ImpactStat {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  source: string;
  date: string;
  displayOrder: number;
  published: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  department: 'Leadership' | 'Community Operations' | 'Advisory';
}

export interface OrganizationSettings {
  name: string;
  tagline: string;
  mission: string;
  vision: string;
  goals?: string[];
  objectives?: string[];
  registrationNumber: string;
  foundedYear: string;
  country: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  safeguardingLead: string;
  safeguardingEmail: string;
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
    threads?: string;
  };
  bankDetails: {
    bankName: string;
    accountName: string;
    accountNumber: string;
    swiftCode: string;
  };
}

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'UNREAD' | 'READ';
}

export interface VolunteerSubmission {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location: string;
  areaOfInterest: string;
  availability: string;
  skills: string;
  createdAt: string;
}

export interface PartnerSubmission {
  id: string;
  organizationName: string;
  contactPerson: string;
  email: string;
  phone?: string;
  partnerType: string;
  message: string;
  createdAt: string;
}

export interface DonationSubmission {
  id: string;
  amount: number;
  frequency: 'one-time' | 'monthly';
  designation: string;
  donorName: string;
  donorEmail: string;
  paymentMethod: 'card' | 'bank_transfer' | 'mobile_money';
  phone?: string;
  anonymous: boolean;
  createdAt: string;
  transactionRef: string;
  status: 'COMPLETED' | 'PENDING';
}
