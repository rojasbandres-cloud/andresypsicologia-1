export type UserRole = 'SuperAdmin' | 'Moderador' | 'Psicologo' | 'Paciente' | 'Invitado';

export type RateApprovalStatus = 'approved' | 'pending' | 'rejected';

export interface ProblemRate {
  disorder: string;
  priceUsd: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  fpvNumber?: string;
  isVerified?: boolean;
  isBanned?: boolean;
  banReason?: string;
  avatarUrl?: string;
  titleDocumentUrl?: string;
  titleDocumentName?: string;
  clinicalExperience?: string;
  disordersAddressed?: string[];
  behavioralTechniques?: string[];
  bio?: string;
  city?: string;
  consultationModality?: string;
  createdAt: string;

  // Professional rates & approval flow
  sessionRateUsd?: number;
  problemRates?: ProblemRate[];
  rateApprovalStatus?: RateApprovalStatus;
  pendingProposedRateUsd?: number;
  pendingProblemRates?: ProblemRate[];
  rateNote?: string;
  rateUpdatedAt?: string;

  // Availability & customizable schedule
  availabilityStatus?: 'disponible' | 'no_disponible';
  scheduleHours?: string;
}

export interface PatientContactLead {
  id: string;
  fullName: string;
  age: number;
  idCard: string; // Cédula de Identidad
  phone: string;
  dsmDisorderCategory?: string; // DSM-5-TR category or specific disorder
  customDisorderReason?: string; // When "Otro motivo" is selected
  consultationReason: string; // Max 500 chars
  targetPsychologistId: string;
  targetPsychologistName: string;
  targetPsychologistFpv?: string;
  status: 'No Leído' | 'En Revisión' | 'Contactado' | 'Archivado';
  createdAt: string;
  notes?: string;
}

export interface BehavioralTechnique {
  id: string;
  name: string;
  acronym?: string;
  category: 'Análisis Funcional' | 'Terapias Contextuales (3ra Gen)' | 'Condicionamiento Operante' | 'Exposición y Desensibilización' | 'Interconductismo';
  description: string;
  empiricalEvidence: string;
  clinicalApplications: string[];
  stepByStepProcedure: string[];
  keyAuthors: string[];
  isVisible?: boolean;
}

export interface TherapyRate {
  id: string;
  title: string;
  subtitle: string;
  priceUsd: number;
  duration: string;
  targetAudience: string;
  badge?: string;
  isFeatured?: boolean;
  inclusions: string[];
  isVisible?: boolean;
}

export interface ForumReply {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isVerifiedAuthor?: boolean;
  fpvNumber?: string;
  content: string;
  createdAt: string;
  isCensored?: boolean;
  likes?: number;
  isAnonymous?: boolean;
  realAuthorName?: string;
  parentId?: string; // For Reddit-style nested threading
}

export type PostStatus = 'approved' | 'pending_review' | 'rejected';

export interface ForumThread {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  isVerifiedAuthor?: boolean;
  fpvNumber?: string;
  category: string;
  epistemologicalTag?: string;
  status: PostStatus;
  views: number;
  likes: number;
  isPinned: boolean;
  isClosed: boolean;
  isCensored: boolean;
  createdAt: string;
  replies: ForumReply[];
  isAnonymous?: boolean;
  realAuthorName?: string;
  realAuthorEmail?: string;
  realAuthorId?: string;
  imageUrl?: string; // Image support
}

export type VlogDivision = 'psicologo_psicologo' | 'psicologo_paciente';

export interface VlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorId: string;
  authorName: string;
  authorFpv?: string;
  authorRole: UserRole;
  vlogType: VlogDivision;
  category: 'Análisis de la Conducta' | 'Terapias Contextuales (ACT/DBT)' | 'Interconductismo' | 'Psicología Basada en Evidencia';
  readTimeMinutes: number;
  status: PostStatus;
  tags: string[];
  references: string[];
  publishedAt: string;
  isAnonymous?: boolean;
  realAuthorName?: string;
  realAuthorEmail?: string;
  realAuthorId?: string;
  imageUrl?: string; // Image support
  comments?: ForumReply[]; // Reddit-like comment thread
}

export interface ModerationLog {
  id: string;
  timestamp: string;
  moderatorName: string;
  moderatorRole: UserRole;
  action:
    | 'BAN_USER'
    | 'UNBAN_USER'
    | 'CENSOR_POST'
    | 'UNCENSOR_POST'
    | 'APPROVE_POST'
    | 'REJECT_POST'
    | 'PIN_THREAD'
    | 'CLOSE_THREAD'
    | 'APPROVE_PSYCHOLOGIST'
    | 'REJECT_PSYCHOLOGIST'
    | 'UPDATE_ROLE'
    | 'UPDATE_CMS'
    | 'APPROVE_RATE'
    | 'REJECT_RATE'
    | 'UPDATE_AVAILABILITY'
    | 'UPDATE_SCHEDULE';
  target: string;
  reason: string;
}

export interface AppointmentBooking {
  id: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  consultationReason: string;
  modality: 'Online (Videollamada)' | 'Presencial (Caracas / Consultorio)';
  preferredSchedule: string;
  serviceId: string;
  status: 'Pendiente' | 'Confirmada' | 'Realizada';
  createdAt: string;
}

export interface RateStatistic {
  disorderId: string;
  disorderName: string;
  clinicalFocus: string;
  mean: number;
  median: number;
  mode: number;
  count: number;
  min: number;
  max: number;
  sampleRates: number[];
}

export interface NavMenuItem {
  id: string;
  label: string;
  isVisible: boolean;
  isCustom?: boolean;
}

export interface PostingPermissions {
  vlogPsychOnly: UserRole[];
  vlogCommunity: UserRole[];
  debateSociedad: UserRole[];
}

export interface StatsVisibility {
  showMean: boolean;
  showMedian: boolean;
  showMode: boolean;
}

export interface FooterConfig {
  manifestoText: string;
  rigorCommitmentText: string;
  contactEmail: string;
  contactPhone: string;
  locationText: string;
  customNotice?: string;
}

export interface SiteBrandConfig {
  siteTitle: string;
  headerSubtitle: string;
  logoType: 'official_svg' | 'custom_url' | 'compact_badge';
  customLogoUrl?: string;
  andresMissionStatement: string;
  andresPhotoUrl: string;
  maxSessionRateLimitUsd: number;
  andresSessionRateUsd: number;
  andresProblemRates: ProblemRate[];
  navMenuItems: NavMenuItem[];
  postingPermissions: PostingPermissions;
  statsVisibility: StatsVisibility;
  footerConfig: FooterConfig;
}
