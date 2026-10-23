// Standalone admin setup script — run with: npx tsx src/scripts/setupAdmin.ts
// No project imports (avoids import.meta.env issues in Node)

import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import {
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';

// Firebase config — same values as .env
const firebaseConfig = {
  apiKey:            'AIzaSyA4YnE4Lz1lVozZwQvsPsxO8pr_lDQbuiU',
  authDomain:        'revel-5818b.firebaseapp.com',
  projectId:         'revel-5818b',
  storageBucket:     'revel-5818b.firebasestorage.app',
  messagingSenderId: '723226388374',
  appId:             '1:723226388374:web:1feeef8870f31bc5b89fb7',
};

const ADMIN_EMAIL    = 'admin@revelhouseuganda.org';
const ADMIN_PASSWORD = process.env.SETUP_ADMIN_PASSWORD || 'Revel@2026!';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db  = getFirestore(app);

// ── inline seed data (copied from cmsData.ts / sponsorshipGallery.ts) ─────────

const orgSettings = {
  name: 'Revel House Uganda',
  tagline: 'Empowering communities through sustainable development',
  mission: 'To empower vulnerable communities in Uganda through sustainable development programs that promote child welfare, education, health, and livelihood improvement.',
  vision: 'A Uganda where every child is protected, every community is resilient, and every family has the opportunity to thrive.',
  foundedYear: 2019,
  registrationNumber: '800300/2024',
  country: 'Uganda',
  founded: '2019',
  contact: {
    email: 'frankhalland64@gmail.com',
    phone: '+256 742 195432 / +256771495075',
    address: 'Kampala / Central Region, Uganda',
  },
  safeguarding: {
    email: 'revelhouseuganda@gmail.com',
    phone: '+256 742 195432 / +256771495075',
    description: 'We maintain zero tolerance for child abuse. All concerns are taken seriously and reported through established channels.',
  },
  socialMedia: {
    facebook: 'https://facebook.com/revelhouseuganda',
    twitter: 'https://twitter.com/revelhouseuganda',
    instagram: 'https://instagram.com/revelhouseuganda',
    linkedin: 'https://linkedin.com/company/revelhouseuganda',
    youtube: 'https://youtube.com/@revelhouseuganda',
  },
  goals: [
    'Ensure access to quality education for vulnerable children',
    'Improve health outcomes in underserved communities',
    'Promote sustainable livelihoods and economic empowerment',
    'Strengthen child protection systems at community level',
    'Enhance water, sanitation, and hygiene (WASH) infrastructure',
  ],
  objectives: [
    'Provide educational scholarships and school supplies to orphaned and vulnerable children',
    'Establish community health clinics and mobile health outreach programs',
    'Train community health workers in disease prevention and health promotion',
    'Support income-generating activities for families and caregivers',
    'Construct safe water points and sanitation facilities in rural communities',
    'Conduct child safeguarding training for community leaders and partners',
    'Promote environmental conservation and sustainable agriculture',
    'Build institutional capacity for effective service delivery',
  ],
};

const programs = [
  {
    id: 'prog-child-welfare',
    title: 'Child Welfare & Protection',
    slug: 'child-welfare-protection',
    category: 'child-care',
    status: 'ongoing',
    published: true,
    description: 'Comprehensive child protection services including identification, case management, psychosocial support, and family reunification for vulnerable children across our target communities.',
    longDescription: 'Our Child Welfare & Protection program provides a safety net for the most vulnerable children in our communities. Through a network of trained community volunteers and social workers, we identify at-risk children, provide immediate support, and develop long-term case management plans. The program includes psychosocial support, family tracing and reunification, legal aid referrals, and establishment of community-based child protection committees.',
    objectives: [
      'Identify and register all vulnerable children in target communities',
      'Provide psychosocial support to children affected by abuse, neglect, or exploitation',
      'Establish functional community child protection committees',
      'Facilitate family reunification where safe and appropriate',
      'Refer complex cases to specialized service providers',
    ],
    activities: [
      'Community awareness campaigns on child rights and protection',
      'Training of community child protection committees',
      'Individual case management and follow-up',
      'Psychosocial support sessions and support groups',
      'Family mediation and reunification processes',
    ],
    impact: 'Over 500 children have been identified and supported through our protection services since the program began.',
    image: '/images/wash-team.jpg',
    icon: 'Shield',
  },
  {
    id: 'prog-education',
    title: 'Education & Learning',
    slug: 'education-learning',
    category: 'education',
    status: 'ongoing',
    published: true,
    description: 'Quality education access through scholarships, learning materials, school infrastructure support, and after-school tutoring for children in underserved communities.',
    longDescription: 'The Education & Learning program ensures that every child in our communities has access to quality education. We provide scholarships, school supplies, and uniforms to children who would otherwise be unable to attend school. Our program also supports school infrastructure improvements, trains teachers in child-centered pedagogy, and runs after-school tutoring programs to improve learning outcomes.',
    objectives: [
      'Provide scholarships to at least 200 vulnerable children annually',
      'Improve school infrastructure in partner schools',
      'Enhance teacher capacity through training and mentorship',
      'Establish after-school tutoring and homework support programs',
      'Promote early childhood development through community-based programs',
    ],
    activities: [
      'Scholarship selection and disbursement',
      'School supplies and uniform distribution',
      'Teacher training workshops and classroom observations',
      'After-school tutoring sessions at community centers',
      'Early childhood development activities for preschool children',
    ],
    impact: 'Over 300 children are currently enrolled in our scholarship program with a 95% school retention rate.',
    image: '/images/kids-teamwork.jpg',
    icon: 'GraduationCap',
  },
  {
    id: 'prog-health',
    title: 'Health & Nutrition',
    slug: 'health-nutrition',
    category: 'health',
    status: 'ongoing',
    published: true,
    description: 'Community health outreach including nutrition screening, health education, immunization support, and referrals to health facilities for children and caregivers.',
    longDescription: 'Our Health & Nutrition program works to improve health outcomes for children and their families in rural communities. Through community health outreach, we provide nutrition screening and support, health education, immunization awareness, and referrals to formal health services. The program also trains community health volunteers to serve as first responders for common childhood illnesses.',
    objectives: [
      'Reduce malnutrition rates among children under 5 in target communities',
      'Increase immunization coverage to above 90% in target areas',
      'Train community health volunteers in disease prevention',
      'Provide nutrition supplementation for malnourished children',
      'Conduct quarterly health outreach camps',
    ],
    activities: [
      'Monthly nutrition screening and growth monitoring',
      'Community health education sessions',
      'Immunization mobilization and referral',
      'Distribution of nutritional supplements',
      'Quarterly mobile health clinics',
    ],
    impact: 'Malnutrition rates among children under 5 have decreased by 30% in target communities.',
    image: '/images/wash-toilet.jpg',
    icon: 'Heart',
  },
  {
    id: 'prog-community',
    title: 'Community Livelihoods',
    slug: 'community-livelihoods',
    category: 'community-outreach',
    status: 'ongoing',
    published: true,
    description: 'Economic empowerment through vocational skills training, savings group formation, agricultural support, and micro-enterprise development for families and caregivers.',
    longDescription: 'The Community Livelihoods program empowers families and caregivers with the skills and resources they need to become economically self-sufficient. Through vocational training, savings group formation, agricultural support, and micro-enterprise development, we help families build sustainable livelihoods that benefit their children and communities.',
    objectives: [
      'Train 300 adults in vocational skills annually',
      'Establish and support 20 village savings and loan associations',
      'Improve agricultural productivity for 500 smallholder farming families',
      'Facilitate access to micro-finance for women and youth groups',
      'Promote climate-smart agriculture practices',
    ],
    activities: [
      'Vocational skills training (tailoring, carpentry, welding)',
      'Formation and mentoring of savings groups',
      'Agricultural extension services and input distribution',
      'Market linkage facilitation for local producers',
      'Micro-enterprise development training and start-up kits',
    ],
    impact: 'Over 400 adults have been trained, with 75% reporting improved household income.',
    image: '/images/community-event.jpg',
    icon: 'Users',
  },
  {
    id: 'prog-wash',
    title: 'WASH',
    slug: 'wash',
    category: 'wash',
    status: 'ongoing',
    published: true,
    description: 'Water, Sanitation & Hygiene infrastructure development including borehole drilling, latrine construction, hygiene promotion, and community-led total sanitation.',
    longDescription: 'Our WASH program addresses the critical need for safe water, improved sanitation, and hygiene practices in rural communities. We construct boreholes, build latrines, and promote hygiene behaviors through community-led total sanitation approaches. The program has already achieved Open Defecation Free status in several communities.',
    objectives: [
      'Provide safe water access to 10 communities through borehole drilling',
      'Construct 200 household latrines in target areas',
      'Achieve Open Defecation Free status in all target communities',
      'Train 50 community health promoters in WASH advocacy',
      'Establish water user committees for sustainable borehole management',
    ],
    activities: [
      'Borehole site assessment, drilling, and commissioning',
      'Latrine construction and household sanitation improvement',
      'Community hygiene promotion campaigns',
      'Training of water user committees and hygiene promoters',
      'Community-Led Total Sanitation (CLTS) triggering and follow-up',
    ],
    impact: '12 communities have achieved Open Defecation Free status, providing safe water access to over 8,000 people.',
    image: '/images/wash-toilet.jpg',
    icon: 'Droplets',
  },
];

const projects = [
  {
    id: 'proj-toilet',
    title: 'Toilet for Every Home',
    slug: 'toilet-for-every-home',
    status: 'ongoing',
    location: 'Rural communities in Central Uganda',
    budget: '$120,000',
    fundingGoal: 120000,
    fundingCurrent: 45000,
    progressPercent: 38,
    isWashFlagship: true,
    description: 'Providing safe, dignified sanitation through household latrine construction across rural communities in Central Uganda.',
    longDescription: 'The Toilet for Every Home project aims to eliminate open defecation in rural communities by constructing affordable, durable household latrines. Each latrine is built with locally sourced materials and community labor, ensuring sustainability and ownership.',
    objectives: [
      'Construct 200 household latrines across 10 villages',
      'Achieve Open Defecation Free certification in all target communities',
      'Train masons in latrine construction techniques',
      'Establish community sanitation committees',
    ],
    activities: [
      'Community mobilization and triggering',
      'Latrine design and construction',
      'Mason training and certification',
      'Post-construction monitoring and follow-up',
    ],
    image: '/images/wash-toilet.jpg',
  },
  {
    id: 'proj-school',
    title: 'School Sponsorship Program',
    slug: 'school-sponsorship-program',
    status: 'ongoing',
    location: 'Wakiso and Mpigi Districts',
    budget: '$85,000',
    fundingGoal: 85000,
    fundingCurrent: 62000,
    progressPercent: 73,
    isWashFlagship: false,
    description: 'Supporting vulnerable children with full school sponsorship including fees, materials, uniforms, and mentoring.',
    longDescription: 'The School Sponsorship Program provides comprehensive educational support to orphaned and vulnerable children. Each sponsored child receives school fees, uniforms, learning materials, and regular mentoring to ensure they stay in school and achieve their potential.',
    objectives: [
      'Sponsor 200 children across primary and secondary school',
      'Achieve 95% school retention rate among sponsored children',
      'Provide mentoring and psychosocial support',
      'Engage families in children\'s education through community meetings',
    ],
    activities: [
      'Child identification and selection',
      'School fees payment and material distribution',
      'Mentoring sessions and home visits',
      'Community engagement meetings',
    ],
    image: '/images/kids-teamwork.jpg',
  },
  {
    id: 'proj-farming',
    title: 'Sustainable Farming Initiative',
    slug: 'sustainable-farming-initiative',
    status: 'seeking-funding',
    location: 'Mpigi District',
    budget: '$45,000',
    fundingGoal: 45000,
    fundingCurrent: 12000,
    progressPercent: 27,
    isWashFlagship: false,
    description: 'Training farmers in climate-smart agriculture and connecting them to markets for improved livelihoods.',
    longDescription: 'The Sustainable Farming Initiative equips smallholder farmers with climate-smart agricultural techniques, improved seed varieties, and market access to increase productivity and income.',
    objectives: [
      'Train 200 farmers in climate-smart agriculture',
      'Establish demonstration farms in each target village',
      'Facilitate market linkage for 100 farming households',
      'Introduce improved seed varieties and organic farming methods',
    ],
    activities: [
      'Farmer field schools and practical training',
      'Demonstration farm establishment',
      'Market linkage facilitation',
      'Input distribution and follow-up',
    ],
    image: '/images/community-event.jpg',
  },
  {
    id: 'proj-health-outreach',
    title: 'Community Health Outreach',
    slug: 'community-health-outreach',
    status: 'planned',
    location: 'Multiple districts',
    budget: '$60,000',
    fundingGoal: 60000,
    fundingCurrent: 0,
    progressPercent: 0,
    isWashFlagship: false,
    description: 'Mobile health clinics bringing essential healthcare services to remote communities.',
    longDescription: 'The Community Health Outreach project will deploy mobile health clinics to remote communities that lack access to formal health services, providing screenings, treatment, and health education.',
    objectives: [
      'Establish 3 mobile health clinic routes',
      'Serve 5,000 patients in the first year',
      'Train 30 community health volunteers',
      'Provide referral pathways for complex cases',
    ],
    activities: [
      'Mobile clinic deployment and scheduling',
      'Health screenings and treatment',
      'Community health education sessions',
      'Health volunteer training and supervision',
    ],
    image: '/images/wash-team.jpg',
  },
];

const impactStats = [
  { id: 'stat-children', value: 1200, suffix: '+', label: 'Children Supported', description: 'Vulnerable children receiving ongoing care and support through our programs', source: 'Annual Report 2024', date: '2024-12-31' },
  { id: 'stat-communities', value: 25, suffix: '', label: 'Communities Reached', description: 'Rural communities actively benefiting from our development programs', source: 'Program Database 2024', date: '2024-12-31' },
  { id: 'stat-toilets', value: 450, suffix: '+', label: 'Latrines Built', description: 'Household latrines constructed providing safe sanitation to families', source: 'WASH Project Records', date: '2024-12-31' },
  { id: 'stat-water', value: 15, suffix: '', label: 'Boreholes Drilled', description: 'Community boreholes providing safe water access to thousands', source: 'WASH Project Records', date: '2024-12-31' },
  { id: 'stat-families', value: 800, suffix: '+', label: 'Families Empowered', description: 'Families supported through livelihoods and economic empowerment programs', source: 'Livelihoods Database 2024', date: '2024-12-31' },
  { id: 'stat-volunteers', value: 60, suffix: '+', label: 'Community Volunteers', description: 'Trained community volunteers supporting program implementation', source: 'Volunteer Registry 2024', date: '2024-12-31' },
];

const articles = [
  {
    id: 'art-wash-milestone',
    title: 'WASH Project Reaches 12 Communities',
    slug: 'wash-project-reaches-12-communities',
    category: 'WASH',
    author: 'Revel House Team',
    date: '2024-11-15',
    readTime: '5 min read',
    published: true,
    featured: true,
    excerpt: 'Our WASH initiative has achieved Open Defecation Free status in 12 rural communities, providing safe water and sanitation to over 8,000 people.',
    content: [
      'We are thrilled to announce a major milestone in our WASH (Water, Sanitation & Hygiene) program. Twelve rural communities across Central Uganda have achieved Open Defecation Free (ODF) status, marking a significant step toward improved public health and dignity for over 8,000 residents.',
      'The achievement is the result of over two years of sustained community engagement, hygiene promotion, and infrastructure development. Each community went through the Community-Led Total Sanitation (CLTS) process, which includes community triggering, latrine construction, and verification.',
      'Our team of community health promoters worked tirelessly alongside village leaders and residents to build household latrines, establish water user committees, and promote handwashing and safe water storage practices.',
      'This milestone would not have been possible without the dedication of our community volunteers and the support of our partners. We look forward to scaling this success to additional communities in the coming year.',
    ],
    tags: ['WASH', 'Sanitation', 'Community Health', 'Milestone'],
    image: '/images/wash-toilet.jpg',
  },
  {
    id: 'art-sponsorship-growth',
    title: 'Child Sponsorship Program Expands to 200 Children',
    slug: 'child-sponsorship-program-expands',
    category: 'Child Protection',
    author: 'Revel House Team',
    date: '2024-10-20',
    readTime: '4 min read',
    published: true,
    featured: false,
    excerpt: 'Our school sponsorship program has grown to support 200 vulnerable children across primary and secondary schools in Wakiso and Mpigi Districts.',
    content: [
      'The Revel House Uganda school sponsorship program has reached a new milestone, now supporting 200 orphaned and vulnerable children across primary and secondary schools in Wakiso and Mpigi Districts.',
      'Each sponsored child receives comprehensive support including school fees, uniforms, learning materials, and regular mentoring. The program maintains a 95% school retention rate, significantly above the national average for vulnerable children.',
      'Our approach combines material support with psychosocial care. Each child is assigned a mentor who conducts regular home visits and maintains contact with the child\'s school to monitor progress and address challenges.',
      'Families are also engaged through community meetings and parenting sessions, ensuring a supportive environment for each child\'s education and development.',
    ],
    tags: ['Education', 'Child Protection', 'Sponsorship'],
    image: '/images/kids-teamwork.jpg',
  },
  {
    id: 'art-farming-training',
    title: 'Farmers Embrace Climate-Smart Agriculture',
    slug: 'farmers-embrace-climate-smart-agriculture',
    category: 'Community Livelihoods',
    author: 'Revel House Team',
    date: '2024-09-10',
    readTime: '6 min read',
    published: true,
    featured: false,
    excerpt: 'Over 150 farmers in Mpigi District have been trained in climate-smart agricultural techniques, improving yields and household food security.',
    content: [
      'Climate change poses a significant threat to smallholder farmers in Uganda. In response, Revel House Uganda has been training farmers in climate-smart agriculture (CSA) techniques that help them adapt to changing weather patterns while improving productivity.',
      'Over 150 farmers across six villages in Mpigi District have completed our comprehensive training program, which covers drought-resistant crop varieties, organic farming methods, soil conservation, and water harvesting techniques.',
      'Early results are encouraging. Participating farmers have reported a 30-40% increase in crop yields compared to the previous season, with particular improvements in maize and bean production.',
      'The program also includes formation of farmer groups and savings associations, ensuring that the benefits extend beyond individual farms to strengthen community resilience.',
    ],
    tags: ['Agriculture', 'Climate Change', 'Livelihoods'],
    image: '/images/community-event.jpg',
  },
  {
    id: 'art-health-camp',
    title: 'Quarterly Health Camp Serves 300 Patients',
    slug: 'quarterly-health-camp-serves-300',
    category: 'Health',
    author: 'Revel House Team',
    date: '2024-08-05',
    readTime: '3 min read',
    published: true,
    featured: false,
    excerpt: 'Our latest quarterly health camp provided free medical consultations, nutrition screening, and immunization services to over 300 community members.',
    content: [
      'Revel House Uganda\'s quarterly health camp brought essential healthcare services directly to communities in need. The camp, held at Kajjansi Trading Center, provided free medical consultations, nutrition screening, and immunization awareness to over 300 residents.',
      'Working in partnership with local health facilities, our team of community health workers facilitated consultations with doctors and nurses, distributed basic medications, and referred patients with complex conditions for follow-up care.',
      'The nutrition screening component identified 25 children under 5 with moderate acute malnutrition, who were enrolled in our supplementary feeding program. Caregivers received education on nutritious meal preparation using locally available foods.',
      'These health camps are a critical part of our community health strategy, bridging the gap between rural communities and formal health services.',
    ],
    tags: ['Health', 'Community Outreach', 'Nutrition'],
    image: '/images/wash-team.jpg',
  },
  {
    id: 'art-odf-certification',
    title: 'Three Villages Achieve ODF Certification',
    slug: 'three-villages-achieve-odf-certification',
    category: 'WASH',
    author: 'Revel House Team',
    date: '2024-07-12',
    readTime: '4 min read',
    published: true,
    featured: false,
    excerpt: 'Three villages in Mpigi District have been officially certified as Open Defecation Free after completing our comprehensive sanitation program.',
    content: [
      'We are proud to announce that three villages in Mpigi District have been officially certified as Open Defecation Free (ODF) by the district health office. This achievement represents months of community mobilization, hygiene promotion, and latrine construction.',
      'The ODF certification process involves rigorous verification by district health officials, including household-level inspections to ensure that all families have access to and are using improved sanitation facilities.',
      'In each of the three villages, over 95% of households now have a functional latrine, a significant increase from less than 30% at the start of the program.',
      'Community members expressed pride in their achievement and committed to maintaining their ODF status through continued hygiene practices and community monitoring.',
    ],
    tags: ['WASH', 'Sanitation', 'Certification'],
    image: '/images/wash-toilet.jpg',
  },
];

const galleryPhotos = [
  { id: 'photo-1', image: '/images/wash-toilet.jpg', ratio: '4/3', title: 'Community Latrine Construction', location: 'Mpigi District', date: '2024-06-15', category: 'wash', credit: 'Revel House Uganda', description: 'Community members during the construction of a household latrine.' },
  { id: 'photo-2', image: '/images/wash-team.jpg', ratio: '3/2', title: 'WASH Team Training', location: 'Wakiso District', date: '2024-05-20', category: 'wash', credit: 'Revel House Uganda', description: 'Community health promoters during WASH training.' },
  { id: 'photo-3', image: '/images/kids-teamwork.jpg', ratio: '4/3', title: 'School Children Activities', location: 'Mpigi District', date: '2024-04-10', category: 'education', credit: 'Revel House Uganda', description: 'Children participating in team-building activities at school.' },
  { id: 'photo-4', image: '/images/community-event.jpg', ratio: '3/2', title: 'Community Engagement Meeting', location: 'Wakiso District', date: '2024-03-25', category: 'community', credit: 'Revel House Uganda', description: 'Community members gathered for a program briefing.' },
  { id: 'photo-5', image: '/images/wash-toilet.jpg', ratio: '1/1', title: 'Completed Latrine', location: 'Mpigi District', date: '2024-02-18', category: 'wash', credit: 'Revel House Uganda', description: 'A newly completed household latrine ready for use.' },
];

// ── seed functions ────────────────────────────────────────────────────────────

async function seedCollection(name: string, items: any[]): Promise<number> {
  for (const item of items) {
    const { id, ...rest } = item;
    await setDoc(doc(db, name, id), {
      ...rest,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
  return items.length;
}

async function main() {
  // 1. Create or sign in Firebase Auth user
  let user;
  try {
    const created = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    user = created.user;
    console.log('Created Firebase Auth user:', ADMIN_EMAIL, '| uid:', user.uid);
  } catch (err: any) {
    if (err.code === 'auth/email-already-in-use') {
      console.log('User already exists — signing in...');
      const signedIn = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
      user = signedIn.user;
      console.log('Signed in. uid:', user.uid);
    } else {
      throw err;
    }
  }

  // 2. Write admins/{uid} document
  await setDoc(doc(db, 'admins', user.uid), {
    email: ADMIN_EMAIL,
    role: 'admin',
    active: true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log('Wrote admins/' + user.uid);

  // 3. Seed all CMS collections
  const progs = await seedCollection('programs', programs);
  console.log('Seeded programs:', progs);

  const projs = await seedCollection('projects', projects);
  console.log('Seeded projects:', projs);

  const arts = await seedCollection('articles', articles);
  console.log('Seeded articles:', arts);

  const stats = await seedCollection('stats', impactStats);
  console.log('Seeded impact stats:', stats);

  // 4. Seed site_settings/global
  await setDoc(doc(db, 'site_settings', 'global'), {
    ...orgSettings,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true });
  console.log('Seeded site_settings/global');

  // 5. Seed gallery
  let galleryCount = 0;
  for (const photo of galleryPhotos) {
    await setDoc(doc(db, 'sponsorship_photos', photo.id), {
      image_path: photo.image,
      aspect_ratio: photo.ratio,
      title: photo.title,
      location: photo.location,
      photo_date: photo.date,
      category: photo.category,
      credit: photo.credit,
      description: photo.description,
      link: null,
      display_order: parseInt(photo.id.replace('photo-', ''), 10),
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    }, { merge: true });
    galleryCount++;
  }
  console.log('Seeded gallery photos:', galleryCount);

  // 6. Summary
  console.log('');
  console.log('========================================');
  console.log('  SETUP COMPLETE');
  console.log('========================================');
  console.log('Admin email:    ', ADMIN_EMAIL);
  console.log('Admin password: ', ADMIN_PASSWORD);
  console.log('Programs:       ', progs);
  console.log('Projects:       ', projs);
  console.log('Articles:       ', arts);
  console.log('Stats:          ', stats);
  console.log('Gallery photos: ', galleryCount);
  console.log('========================================');
}

main().catch((err) => {
  console.error('SETUP FAILED');
  console.error('Code:   ', err.code   || 'n/a');
  console.error('Message:', err.message || err);
  process.exit(1);
});
