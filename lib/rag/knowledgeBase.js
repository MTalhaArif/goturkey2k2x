import { universities } from '@/lib/universities';

const coreChunks = [
  {
    id: 'process-overview',
    title: 'Application Process Overview',
    category: 'process',
    keywords: ['process', 'steps', 'how', 'apply', 'application', 'start', 'begin'],
    content:
      'Applying through GoTurkey 2k2x follows 5 steps: 1) Explore Programs — browse partner universities and pick a program and study level (Vocational School, Undergraduate, Master\'s, or Ph.D.). 2) Prepare Documents — upload the required documents (see the document checklist). 3) Submit Application — once documents are uploaded, submit the application for review. 4) Get Acceptance — GoTurkey 2k2x reviews the application, then the university issues an offer letter. 5) Visa & Travel — after accepting the offer and paying the deposit, GoTurkey 2k2x assists with the student visa and travel to Turkey. Students create an account at /register, complete their profile, then start an application from their student dashboard.',
  },
  {
    id: 'registration-account',
    title: 'Creating an Account and Starting an Application',
    category: 'process',
    keywords: ['register', 'account', 'signup', 'sign up', 'login', 'dashboard', 'reference'],
    content:
      'To begin, a student creates a free account at the Register page with first name, last name, email, and password, plus an optional "reference" field (agent name, friend, or how they heard about GoTurkey 2k2x). After registering they land on the student dashboard, where they first complete a profile (date of birth, nationality, mother\'s name, phone number, plus optional documentation and accommodation service preferences), then click "Start New Application," search for a university by name/city/program, choose a study level and program, and begin uploading documents.',
  },
  {
    id: 'documents-core',
    title: 'Required Documents — All Applicants',
    category: 'documents',
    keywords: ['documents', 'document', 'papers', 'upload', 'checklist', 'required', 'need'],
    content:
      'Every applicant, regardless of study level, must upload: a white-background passport-style picture, a copy of their passport, their high school certificate, their high school transcript, and a CV/resume. These are uploaded from the application\'s Document Checklist screen in the student dashboard.',
  },
  {
    id: 'documents-masters-phd',
    title: 'Additional Documents for Master\'s and Ph.D. Applicants',
    category: 'documents',
    keywords: ['masters', "master's", 'phd', 'ph.d.', 'bachelor', 'graduate', 'documents'],
    content:
      'In addition to the core documents, Master\'s and Ph.D. applicants must also upload their Bachelor\'s degree and Bachelor\'s transcript. Ph.D. applicants must additionally upload their Master\'s degree and Master\'s transcript. Undergraduate and Vocational School applicants do not need these.',
  },
  {
    id: 'documents-optional',
    title: 'Optional Documents',
    category: 'documents',
    keywords: ['optional', 'language', 'recommendation', 'letter', 'certificate', 'documents'],
    content:
      'Optional documents that can strengthen an application: a language proficiency certificate (e.g. English/Turkish test results), a recommendation letter, and any other supporting document. If a document upload fails, a student can instead paste a Google Drive folder link containing all their documents as a fallback, directly on the application page.',
  },
  {
    id: 'stages-pipeline',
    title: 'Application Stages Explained',
    category: 'stages',
    keywords: ['stage', 'status', 'pipeline', 'under review', 'submitted', 'accepted', 'rejected', 'offer'],
    content:
      'Each application moves through stages, visible on the student dashboard: Documents Pending (still gathering/uploading required files) → Submitted (application sent for review) → Under Review (GoTurkey 2k2x and the university are reviewing it) → Offer Sent (the university issued an offer letter, downloadable from the application page) → Payment Pending (student has been asked to pay the deposit/tuition and upload proof of payment) → Accepted (seat confirmed). An application can also be marked Rejected if it was not successful at any point.',
  },
  {
    id: 'payment-offer',
    title: 'Offer Letters and Payment',
    category: 'payment',
    keywords: ['offer', 'letter', 'payment', 'pay', 'deposit', 'proof', 'slip', 'receipt'],
    content:
      'Once a university issues an offer letter, it appears on the student\'s application page with a download link, and the stage moves to Offer Sent. To secure the seat, the student then pays the required deposit/tuition to the university and uploads a bank receipt or proof of payment on the same application page; this moves the stage to Payment Pending. GoTurkey 2k2x confirms the payment and the application moves to Accepted.',
  },
  {
    id: 'services-post-landing',
    title: 'Post-Landing and Academic Services',
    category: 'services',
    keywords: ['services', 'visa', 'airport', 'pickup', 'accommodation', 'registration', 'sim', 'bank', 'residency'],
    content:
      'GoTurkey 2k2x offers: University Admissions (guaranteed acceptance support at top Turkish universities), Visa Assistance (guidance through the entire student visa process), Airport Pickup (transfer from the airport to accommodation), Accommodation Drop (help finding and settling into housing), University Registration (help with final registration steps at the university), Student SIM & Transport Card (getting connected and mobile from day one), Residency Registration (support obtaining the Turkish residence permit / İkamet), and Bank Account Opening (help setting up local finances).',
  },
  {
    id: 'documentation-services',
    title: 'Documentation Services Available on the Profile',
    category: 'services',
    keywords: ['documentation', 'residence permit', 'ikamet', 'rental contract', 'health insurance', 'tax number', 'address registration', 'nufus'],
    content:
      'When completing their profile, students can request assistance with specific documentation services in Turkey: Residence Permit (İkamet), Notarized Rental Contract, Health Insurance, Tax Number, Address Registration, and Nüfus Registration, or specify another need under "Other." These are optional add-on requests, not required for the application itself.',
  },
  {
    id: 'accommodation-options',
    title: 'Accommodation Options',
    category: 'services',
    keywords: ['accommodation', 'housing', 'room', 'apartment', 'studio', 'live', 'stay'],
    content:
      'Students can indicate the type of accommodation they are looking for on their profile: Shared Room, Private Room, Studio Apartment, or Apartment. GoTurkey 2k2x uses this to help arrange housing as part of the accommodation service.',
  },
  {
    id: 'universities-general',
    title: 'Partner Universities Overview',
    category: 'universities',
    keywords: ['university', 'universities', 'private', 'state', 'foundation', 'list', 'partner'],
    content:
      'GoTurkey 2k2x works with 196 Turkish universities in total: 69 private ("Foundation") universities and 127 state universities, across many cities. Foundation (private) universities generally offer faster admissions and more flexible/guaranteed-acceptance pathways, which is why the "New Application" search defaults to private universities only, though state universities can also be selected. The full list with programs is browsable on the Universities page, and searchable within the student dashboard when starting a new application.',
  },
  {
    id: 'contact-info',
    title: 'Contact Information',
    category: 'contact',
    keywords: ['contact', 'email', 'phone', 'call', 'whatsapp', 'reach', 'instagram'],
    content:
      'Students can reach GoTurkey 2k2x by email at talhasays94@gmail.com, by phone/WhatsApp at +90 537 699 43 02, via the Instagram profile @goturkey2k2x, or by joining the WhatsApp Channel linked in the site footer. For anything not covered here, direct the student to contact the team through one of these channels.',
  },
  {
    id: 'about-company',
    title: 'About GoTurkey 2k2x',
    category: 'about',
    keywords: ['about', 'company', 'who', 'mission', 'guarantee'],
    content:
      'GoTurkey 2k2x is an educational consulting company connecting international students with Turkish universities, providing admissions support and comprehensive post-landing services (visa, housing, registration, and more) so students can focus on their studies. It is led by CEO Muhammad Talha Arif.',
  },
];

const universityChunks = universities.map((uni) => ({
  id: `uni-${uni.id}`,
  title: uni.name,
  category: 'university',
  keywords: [uni.name, uni.city, uni.type, ...(uni.programs || [])],
  content: `${uni.name} is a ${uni.type === 'Foundation' ? 'private (Foundation)' : 'state'} university located in ${uni.city}, Turkey. Website: ${uni.website}. Programs offered: ${(uni.programs || []).join(', ')}.`,
}));

export const knowledgeBase = [...coreChunks, ...universityChunks];

export const defaultChunkIds = ['process-overview', 'documents-core', 'stages-pipeline', 'services-post-landing', 'contact-info'];
