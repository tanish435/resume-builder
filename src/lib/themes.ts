import { StyleConfig } from '@/types/schema';

/**
 * Theme Preset Interface
 */
export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'classic' | 'custom';
  preview: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
  config: StyleConfig;
  tags?: string[];
  isPremium?: boolean;
}

/**
 * Built-in Theme Presets
 * 6 professionally designed color themes
 */
export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    description: 'Professional and trustworthy, perfect for corporate roles',
    category: 'professional',
    preview: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
    },
    config: {
      primaryColor: '#2563eb',
      secondaryColor: '#3b82f6',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#e5e7eb',
      accentColor: '#60a5fa',
    },
    tags: ['professional', 'corporate', 'traditional'],
  },
  {
    id: 'emerald-green',
    name: 'Emerald Green',
    description: 'Fresh and growth-oriented, ideal for startups and tech',
    category: 'modern',
    preview: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      accentColor: '#34d399',
    },
    config: {
      primaryColor: '#059669',
      secondaryColor: '#10b981',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Inter',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#d1fae5',
      accentColor: '#34d399',
    },
    tags: ['modern', 'startup', 'tech', 'fresh'],
  },
  {
    id: 'royal-purple',
    name: 'Royal Purple',
    description: 'Creative and distinctive, great for design and creative fields',
    category: 'creative',
    preview: {
      primaryColor: '#7c3aed',
      secondaryColor: '#8b5cf6',
      accentColor: '#a78bfa',
    },
    config: {
      primaryColor: '#7c3aed',
      secondaryColor: '#8b5cf6',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Montserrat',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#ede9fe',
      accentColor: '#a78bfa',
    },
    tags: ['creative', 'design', 'distinctive', 'bold'],
  },
  {
    id: 'crimson-red',
    name: 'Crimson Red',
    description: 'Bold and energetic, perfect for leadership roles',
    category: 'creative',
    preview: {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444',
      accentColor: '#f87171',
    },
    config: {
      primaryColor: '#dc2626',
      secondaryColor: '#ef4444',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Lato',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#fee2e2',
      accentColor: '#f87171',
    },
    tags: ['bold', 'leadership', 'energetic', 'powerful'],
  },
  {
    id: 'midnight-navy',
    name: 'Midnight Navy',
    description: 'Sophisticated and authoritative, excellent for executives',
    category: 'professional',
    preview: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      accentColor: '#60a5fa',
    },
    config: {
      primaryColor: '#1e40af',
      secondaryColor: '#3b82f6',
      textColor: '#111827',
      backgroundColor: '#ffffff',
      fontFamily: 'Georgia',
      fontSize: 14,
      lineHeight: 1.7,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#dbeafe',
      accentColor: '#60a5fa',
    },
    tags: ['professional', 'executive', 'sophisticated', 'authoritative'],
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Timeless black and white, for a minimalist approach',
    category: 'classic',
    preview: {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      accentColor: '#6b7280',
    },
    config: {
      primaryColor: '#1f2937',
      secondaryColor: '#374151',
      textColor: '#000000',
      backgroundColor: '#ffffff',
      fontFamily: 'Helvetica',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'compact',
      borderStyle: 'solid',
      borderColor: '#e5e7eb',
      accentColor: '#6b7280',
    },
    tags: ['minimalist', 'classic', 'timeless', 'ats-friendly'],
  },
  {
    id: 'sunset-orange',
    name: 'Sunset Orange',
    description: 'Warm and approachable, great for creative and people-focused roles',
    category: 'creative',
    preview: {
      primaryColor: '#ea580c',
      secondaryColor: '#f97316',
      accentColor: '#fb923c',
    },
    config: {
      primaryColor: '#ea580c',
      secondaryColor: '#f97316',
      textColor: '#1f2937',
      backgroundColor: '#ffffff',
      fontFamily: 'Poppins',
      fontSize: 14,
      lineHeight: 1.6,
      spacing: 'normal',
      borderStyle: 'solid',
      borderColor: '#fed7aa',
      accentColor: '#fb923c',
    },
    tags: ['warm', 'creative', 'approachable', 'friendly'],
  },
];

/**
 * Get theme preset by ID
 */
export function getThemeById(themeId: string): ThemePreset | undefined {
  return THEME_PRESETS.find((theme) => theme.id === themeId);
}

/**
 * Get themes by category
 */
export function getThemesByCategory(
  category: ThemePreset['category']
): ThemePreset[] {
  return THEME_PRESETS.filter((theme) => theme.category === category);
}

/**
 * Get all theme categories
 */
export function getThemeCategories(): Array<{
  value: ThemePreset['category'];
  label: string;
  description: string;
}> {
  return [
    {
      value: 'professional',
      label: 'Professional',
      description: 'Traditional corporate themes',
    },
    {
      value: 'modern',
      label: 'Modern',
      description: 'Contemporary and fresh',
    },
    {
      value: 'creative',
      label: 'Creative',
      description: 'Bold and distinctive',
    },
    {
      value: 'classic',
      label: 'Classic',
      description: 'Timeless and minimal',
    },
    {
      value: 'custom',
      label: 'Custom',
      description: 'User-created themes',
    },
  ];
}

/**
 * Search themes by tag
 */
export function searchThemesByTag(tag: string): ThemePreset[] {
  return THEME_PRESETS.filter((theme) =>
    theme.tags?.some((t) => t.toLowerCase().includes(tag.toLowerCase()))
  );
}

/**
 * Get all unique tags
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  THEME_PRESETS.forEach((theme) => {
    theme.tags?.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Validate theme config
 */
export function validateThemeConfig(config: Partial<StyleConfig>): boolean {
  return !!(
    config.primaryColor &&
    config.textColor &&
    config.backgroundColor &&
    config.fontFamily &&
    config.fontSize &&
    config.lineHeight &&
    config.spacing
  );
}

/**
 * Create custom theme from current style
 */
export function createCustomTheme(
  name: string,
  description: string,
  currentStyle: StyleConfig
): ThemePreset {
  return {
    id: `custom-${Date.now()}`,
    name,
    description,
    category: 'custom',
    preview: {
      primaryColor: currentStyle.primaryColor,
      secondaryColor: currentStyle.secondaryColor || currentStyle.primaryColor,
      accentColor: currentStyle.accentColor || currentStyle.primaryColor,
    },
    config: { ...currentStyle },
    tags: ['custom'],
  };
}
