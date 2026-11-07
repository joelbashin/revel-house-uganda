import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import {
  ContactSubmission,
  DonationSubmission,
  PartnerSubmission,
  VolunteerSubmission,
} from '../types';

type ContactInput = Omit<ContactSubmission, 'id' | 'createdAt' | 'status'>;
type VolunteerInput = Omit<VolunteerSubmission, 'id' | 'createdAt'>;
type PartnerInput = Omit<PartnerSubmission, 'id' | 'createdAt'>;
type DonationInput = Omit<DonationSubmission, 'id' | 'createdAt' | 'transactionRef' | 'status'>;

function clean(value: string | undefined, maxLength: number): string {
  return (value || '').trim().slice(0, maxLength);
}

function toIsoString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === 'string') return value;
  return new Date().toISOString();
}

export async function createContactSubmission(data: ContactInput): Promise<string> {
  const ref = await addDoc(collection(db, 'contact_submissions'), {
    name: clean(data.name, 120),
    email: clean(data.email, 254),
    phone: clean(data.phone, 40),
    subject: clean(data.subject, 200),
    message: clean(data.message, 5000),
    status: 'UNREAD',
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function createVolunteerSubmission(data: VolunteerInput): Promise<string> {
  const ref = await addDoc(collection(db, 'volunteer_submissions'), {
    fullName: clean(data.fullName, 120),
    email: clean(data.email, 254),
    phone: clean(data.phone, 40),
    location: clean(data.location, 200),
    areaOfInterest: clean(data.areaOfInterest, 120),
    availability: clean(data.availability, 120),
    skills: clean(data.skills, 3000),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function createPartnerSubmission(data: PartnerInput): Promise<string> {
  const ref = await addDoc(collection(db, 'partner_submissions'), {
    organizationName: clean(data.organizationName, 200),
    contactPerson: clean(data.contactPerson, 120),
    email: clean(data.email, 254),
    phone: clean(data.phone, 40),
    partnerType: clean(data.partnerType, 120),
    message: clean(data.message, 5000),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export async function createDonationPledge(
  data: DonationInput
): Promise<{ id: string; transactionRef: string }> {
  const ref = doc(collection(db, 'donations'));
  const transactionRef = `RHU-${ref.id.slice(0, 8).toUpperCase()}`;

  await setDoc(ref, {
    amount: Math.round(data.amount * 100) / 100,
    frequency: data.frequency,
    designation: clean(data.designation, 200) || 'Where Most Needed',
    donorName: clean(data.donorName, 120),
    donorEmail: clean(data.donorEmail, 254),
    paymentMethod: data.paymentMethod,
    phone: clean(data.phone, 40),
    anonymous: Boolean(data.anonymous),
    transactionRef,
    // Pledges stay pending until a server-side payment verification confirms them.
    status: 'PENDING',
    createdAt: serverTimestamp(),
  });

  return { id: ref.id, transactionRef };
}

export async function getDonations(): Promise<DonationSubmission[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'donations'), orderBy('createdAt', 'desc')));
    return snapshot.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        amount: Number(data.amount) || 0,
        frequency: data.frequency === 'monthly' ? 'monthly' : 'one-time',
        designation: String(data.designation || ''),
        donorName: String(data.donorName || ''),
        donorEmail: String(data.donorEmail || ''),
        paymentMethod: data.paymentMethod || 'bank_transfer',
        phone: data.phone ? String(data.phone) : undefined,
        anonymous: Boolean(data.anonymous),
        transactionRef: String(data.transactionRef || ''),
        status: data.status === 'COMPLETED' ? 'COMPLETED' : 'PENDING',
        createdAt: toIsoString(data.createdAt),
      } satisfies DonationSubmission;
    });
  } catch {
    return [];
  }
}

export async function getSubmissionsSummary(): Promise<{
  contacts: ContactSubmission[];
  volunteers: VolunteerSubmission[];
  partners: PartnerSubmission[];
  donations: DonationSubmission[];
}> {
  const [contacts, volunteers, partners, donations] = await Promise.all([
    getDocs(query(collection(db, 'contact_submissions'), orderBy('createdAt', 'desc'))).catch(() => null),
    getDocs(query(collection(db, 'volunteer_submissions'), orderBy('createdAt', 'desc'))).catch(() => null),
    getDocs(query(collection(db, 'partner_submissions'), orderBy('createdAt', 'desc'))).catch(() => null),
    getDonations(),
  ]);

  return {
    contacts:
      contacts?.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          name: String(data.name || ''),
          email: String(data.email || ''),
          phone: data.phone ? String(data.phone) : undefined,
          subject: String(data.subject || ''),
          message: String(data.message || ''),
          status: data.status === 'READ' ? 'READ' : 'UNREAD',
          createdAt: toIsoString(data.createdAt),
        } satisfies ContactSubmission;
      }) || [],
    volunteers:
      volunteers?.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          fullName: String(data.fullName || ''),
          email: String(data.email || ''),
          phone: data.phone ? String(data.phone) : undefined,
          location: String(data.location || ''),
          areaOfInterest: String(data.areaOfInterest || ''),
          availability: String(data.availability || ''),
          skills: String(data.skills || ''),
          createdAt: toIsoString(data.createdAt),
        } satisfies VolunteerSubmission;
      }) || [],
    partners:
      partners?.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          organizationName: String(data.organizationName || ''),
          contactPerson: String(data.contactPerson || ''),
          email: String(data.email || ''),
          phone: data.phone ? String(data.phone) : undefined,
          partnerType: String(data.partnerType || ''),
          message: String(data.message || ''),
          createdAt: toIsoString(data.createdAt),
        } satisfies PartnerSubmission;
      }) || [],
    donations,
  };
}
