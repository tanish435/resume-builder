import { StyleConfig } from '@/types/schema';

/**
 * Helper function to get font size from style config
 * Falls back to default values if not specified
 */
export function getFontSize(
  style: StyleConfig,
  key: keyof NonNullable<StyleConfig['fontSizes']>,
  fallback: number
): number {
  return style.fontSizes?.[key] ?? fallback;
}

/**
 * Get inline style object for font size
 */
export function getFontSizeStyle(
  style: StyleConfig,
  key: keyof NonNullable<StyleConfig['fontSizes']>,
  fallback: number
): { fontSize: string } {
  return {
    fontSize: `${getFontSize(style, key, fallback)}px`,
  };
}

/**
 * Get all font size defaults
 */
export const DEFAULT_FONT_SIZES = {
  name: 32,
  jobTitle: 16,
  sectionTitle: 18,
  jobPosition: 14,
  company: 13,
  body: 11,
  small: 10,
} as const;
