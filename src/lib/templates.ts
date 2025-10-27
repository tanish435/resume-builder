/**
 * Template Registry
 * Central configuration for all available resume templates
 */

import { Template, TemplateStructure, SectionType } from '@/types/schema';
import ModernTemplate from '@/components/templates/ModernTemplate';
import ProfessionalTemplate from '@/components/templates/ProfessionalTemplate';
import CreativeTemplate from '@/components/templates/CreativeTemplate';
import MinimalTemplate from '@/components/templates/MinimalTemplate';

/**
 * Template Component Map
 * Maps template IDs to their React components
 */
export const TEMPLATE_COMPONENTS = {
  modern: ModernTemplate,
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  minimal: MinimalTemplate,
} as const;

export type TemplateId = keyof typeof TEMPLATE_COMPONENTS;

/**
 * Template Structures
 * Defines the default layout structure for each template
 */
export const TEMPLATE_STRUCTURES: Record<TemplateId, TemplateStructure> = {
  modern: {
    layout: 'single-column',
    sectionSpacing: 24,
    marginTop: 48,
    marginBottom: 48,
    marginLeft: 48,
    marginRight: 48,
    headerStyle: 'left',
    sectionDividers: false,
  },
  professional: {
    layout: 'two-column',
    columns: {
      left: {
        width: '30%',
        sections: [SectionType.SKILLS, SectionType.LANGUAGES, SectionType.CERTIFICATIONS, SectionType.INTERESTS],
      },
      right: {
        width: '70%',
        sections: [SectionType.PERSONAL_INFO, SectionType.SUMMARY, SectionType.EXPERIENCE, SectionType.EDUCATION, SectionType.PROJECTS],
      },
    },
    sectionSpacing: 20,
    marginTop: 32,
    marginBottom: 32,
    marginLeft: 32,
    marginRight: 32,
    headerStyle: 'left',
    sectionDividers: true,
  },
  creative: {
    layout: 'two-column',
    columns: {
      left: {
        width: '35%',
        sections: [SectionType.PERSONAL_INFO, SectionType.SKILLS, SectionType.CERTIFICATIONS, SectionType.LANGUAGES, SectionType.INTERESTS],
      },
      right: {
        width: '65%',
        sections: [SectionType.SUMMARY, SectionType.EXPERIENCE, SectionType.EDUCATION, SectionType.PROJECTS],
      },
    },
    sectionSpacing: 24,
    marginTop: 40,
    marginBottom: 40,
    marginLeft: 40,
    marginRight: 48,
    headerStyle: 'left',
    sectionDividers: false,
  },
  minimal: {
    layout: 'single-column',
    sectionSpacing: 32,
    marginTop: 64,
    marginBottom: 64,
    marginLeft: 64,
    marginRight: 64,
    headerStyle: 'centered',
    sectionDividers: true,
  },
};

/**
 * Template Metadata
 * Detailed information about each template
 */
export const TEMPLATE_METADATA: Record<TemplateId, Omit<Template, 'id' | 'createdAt' | 'updatedAt'>> = {
  modern: {
    name: 'modern',
    displayName: 'Modern',
    description: 'Clean, single-column layout with emphasis on typography and content hierarchy. Perfect for tech professionals.',
    structure: TEMPLATE_STRUCTURES.modern,
    category: 'modern',
    isPremium: false,
    isActive: true,
    usageCount: 0,
    preview: '/templates/previews/modern.png',
  },
  professional: {
    name: 'professional',
    displayName: 'Professional',
    description: 'Classic two-column layout with sidebar. Traditional corporate design that\'s ATS-friendly.',
    structure: TEMPLATE_STRUCTURES.professional,
    category: 'professional',
    isPremium: false,
    isActive: true,
    usageCount: 0,
    preview: '/templates/previews/professional.png',
  },
  creative: {
    name: 'creative',
    displayName: 'Creative',
    description: 'Bold asymmetric layout with accent colors. Stand out with modern, creative design.',
    structure: TEMPLATE_STRUCTURES.creative,
    category: 'creative',
    isPremium: false,
    isActive: true,
    usageCount: 0,
    preview: '/templates/previews/creative.png',
  },
  minimal: {
    name: 'minimal',
    displayName: 'Minimal',
    description: 'Ultra-minimalist design with maximum white space. Focus purely on content and readability.',
    structure: TEMPLATE_STRUCTURES.minimal,
    category: 'minimal',
    isPremium: false,
    isActive: true,
    usageCount: 0,
    preview: '/templates/previews/minimal.png',
  },
};

/**
 * Template Categories
 * For filtering and organization
 */
export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'All Templates', icon: '📄' },
  { id: 'modern', label: 'Modern', icon: '🚀' },
  { id: 'professional', label: 'Professional', icon: '💼' },
  { id: 'creative', label: 'Creative', icon: '🎨' },
  { id: 'minimal', label: 'Minimal', icon: '✨' },
] as const;

/**
 * Get template component by ID
 */
export function getTemplateComponent(templateId: string) {
  return TEMPLATE_COMPONENTS[templateId as TemplateId] || TEMPLATE_COMPONENTS.modern;
}

/**
 * Get template metadata by ID
 */
export function getTemplateMetadata(templateId: string) {
  return TEMPLATE_METADATA[templateId as TemplateId] || TEMPLATE_METADATA.modern;
}

/**
 * Get all available templates
 */
export function getAllTemplates(): Template[] {
  return Object.entries(TEMPLATE_METADATA).map(([id, metadata]) => ({
    id,
    ...metadata,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): Template[] {
  if (category === 'all') {
    return getAllTemplates();
  }

  return getAllTemplates().filter((template) => template.category === category);
}

/**
 * Validate template ID
 */
export function isValidTemplateId(templateId: string): templateId is TemplateId {
  return templateId in TEMPLATE_COMPONENTS;
}

/**
 * Get default template ID
 */
export function getDefaultTemplateId(): TemplateId {
  return 'modern';
}
