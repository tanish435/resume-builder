// ============================================
// DATABASE SCHEMA TYPES
// ============================================

export enum SectionType {
  PERSONAL_INFO = 'PERSONAL_INFO',
  SUMMARY = 'SUMMARY',
  EXPERIENCE = 'EXPERIENCE',
  EDUCATION = 'EDUCATION',
  SKILLS = 'SKILLS',
  PROJECTS = 'PROJECTS',
  CERTIFICATIONS = 'CERTIFICATIONS',
  LANGUAGES = 'LANGUAGES',
  INTERESTS = 'INTERESTS',
  CUSTOM = 'CUSTOM',
}

// ============================================
// STYLE CONFIGURATION
// ============================================
export interface StyleConfig {
  primaryColor: string;
  secondaryColor?: string;
  textColor?: string;
  backgroundColor?: string;
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  spacing: 'compact' | 'normal' | 'relaxed';
  borderStyle?: 'none' | 'solid' | 'dashed';
  borderColor?: string;
  accentColor?: string;
}

// ============================================
// SECTION DATA TYPES (Polymorphic)
// ============================================

export interface PersonalInfoData {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  website?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  title?: string; // Job title/headline
  photo?: string; // Profile photo URL
}

export interface SummaryData {
  content: string; // Rich text or plain text summary
}

export interface ExperienceEntry {
  id: string;
  company: string;
  position: string;
  location?: string;
  startDate: string; // ISO date or "MM/YYYY"
  endDate?: string | null; // null for current
  description?: string;
  highlights?: string[]; // Bullet points
  technologies?: string[]; // Tech stack used
}

export interface ExperienceData {
  entries: ExperienceEntry[];
}

export interface EducationEntry {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  location?: string;
  startDate: string;
  endDate?: string | null;
  gpa?: string;
  honors?: string;
  description?: string;
  highlights?: string[];
}

export interface EducationData {
  entries: EducationEntry[];
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface SkillsData {
  categories: SkillCategory[];
  // Alternative flat structure
  skills?: string[];
}

export interface ProjectEntry {
  id: string;
  name: string;
  description: string;
  url?: string;
  github?: string;
  startDate?: string;
  endDate?: string;
  technologies?: string[];
  highlights?: string[];
}

export interface ProjectsData {
  entries: ProjectEntry[];
}

export interface CertificationEntry {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  expiryDate?: string;
  credentialId?: string;
  url?: string;
}

export interface CertificationsData {
  entries: CertificationEntry[];
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: 'Native' | 'Fluent' | 'Professional' | 'Intermediate' | 'Basic';
}

export interface LanguagesData {
  entries: LanguageEntry[];
}

export interface InterestEntry {
  id: string;
  interest: string;
}

export interface InterestsData {
  entries: InterestEntry[];
}

export interface CustomSectionData {
  title: string;
  content: string; // Rich text or structured data
  entries?: Array<{
    id: string;
    [key: string]: any;
  }>;
}

// Union type for all section data
export type SectionData =
  | PersonalInfoData
  | SummaryData
  | ExperienceData
  | EducationData
  | SkillsData
  | ProjectsData
  | CertificationsData
  | LanguagesData
  | InterestsData
  | CustomSectionData;

// ============================================
// SECTION MODEL
// ============================================
export interface Section {
  id: string;
  resumeId: string;
  type: SectionType;
  data: SectionData;
  order: number;
  isVisible: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ============================================
// TEMPLATE STRUCTURE
// ============================================
export interface TemplateStructure {
  layout: 'single-column' | 'two-column' | 'three-column' | 'custom';
  columns?: {
    left?: {
      width: string; // e.g., '30%'
      sections: SectionType[];
    };
    right?: {
      width: string;
      sections: SectionType[];
    };
    main?: {
      width: string;
      sections: SectionType[];
    };
  };
  sectionSpacing: number;
  marginTop: number;
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  headerStyle?: 'centered' | 'left' | 'split';
  sectionDividers?: boolean;
}

export interface Template {
  id: string;
  name: string;
  displayName: string;
  description?: string;
  structure: TemplateStructure;
  preview?: string;
  category: string;
  isPremium: boolean;
  isActive: boolean;
  usageCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ============================================
// RESUME MODEL
// ============================================
export interface Resume {
  id: string;
  userId: string;
  title: string;
  templateId: string;
  styleConfig: StyleConfig;
  isPublic: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  lastEditedAt: string; // ISO string
  sections?: Section[];
  template?: Template;
}

// ============================================
// RESUME VERSION (for Undo/Redo)
// ============================================
export interface ResumeVersionData {
  title: string;
  templateId: string;
  styleConfig: StyleConfig;
  sections: Section[];
}

export interface ResumeVersion {
  id: string;
  resumeId: string;
  data: ResumeVersionData;
  version: number;
  action?: string;
  createdAt: string; // ISO string
}

// ============================================
// SHARE LINK MODEL
// ============================================
export interface ShareLink {
  id: string;
  resumeId: string;
  slug: string;
  isActive: boolean;
  password?: string;
  expiresAt?: string; // ISO string
  viewCount: number;
  lastViewedAt?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ============================================
// USER MODEL
// ============================================
export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  emailVerified?: string; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

// ============================================
// STYLE PRESET MODEL
// ============================================
export interface StylePreset {
  id: string;
  name: string;
  description?: string;
  config: StyleConfig;
  isDefault: boolean;
  isPublic: boolean;
  usageCount: number;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}
