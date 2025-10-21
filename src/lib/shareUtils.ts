/**
 * Share Utilities
 * Functions for generating and managing shareable resume links
 */

import { customAlphabet } from 'nanoid';

/**
 * Custom alphabet for URL-safe slugs
 * Excludes confusing characters like 0/O, 1/I/l
 */
const SLUG_ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';

/**
 * Generate a unique, URL-safe slug
 * @param length - Length of the slug (default: 10)
 * @returns A unique slug string
 */
export function generateSlug(length: number = 10): string {
  const nanoid = customAlphabet(SLUG_ALPHABET, length);
  return nanoid();
}

/**
 * Generate a shareable URL from a slug
 * @param slug - The unique slug
 * @param baseUrl - The base URL (optional, defaults to current origin)
 * @returns Full shareable URL
 */
export function generateShareUrl(slug: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : '');
  return `${base}/share/${slug}`;
}

/**
 * Validate slug format
 * @param slug - The slug to validate
 * @returns true if valid, false otherwise
 */
export function isValidSlug(slug: string): boolean {
  // Check if slug contains only allowed characters
  const slugRegex = /^[23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]+$/;
  return slugRegex.test(slug) && slug.length >= 8 && slug.length <= 20;
}

/**
 * Calculate expiration date
 * @param days - Number of days until expiration (null for no expiration)
 * @returns Date object or null
 */
export function calculateExpirationDate(days: number | null): Date | null {
  if (days === null || days <= 0) {
    return null;
  }
  
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + days);
  return expirationDate;
}

/**
 * Check if a share link has expired
 * @param expiresAt - The expiration date
 * @returns true if expired, false otherwise
 */
export function isExpired(expiresAt: Date | null): boolean {
  if (!expiresAt) {
    return false; // No expiration means never expired
  }
  
  return new Date() > new Date(expiresAt);
}

/**
 * Format share link analytics
 * @param viewCount - Number of views
 * @param createdAt - Creation date
 * @param lastViewedAt - Last viewed date
 * @returns Formatted analytics object
 */
export function formatShareAnalytics(
  viewCount: number,
  createdAt: Date,
  lastViewedAt: Date | null
) {
  return {
    views: viewCount,
    createdAt: createdAt.toISOString(),
    lastViewed: lastViewedAt ? lastViewedAt.toISOString() : null,
    daysActive: Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)),
  };
}

/**
 * Share options interface
 */
export interface ShareOptions {
  resumeId: string;
  expiresInDays?: number | null;
  password?: string | null;
}

/**
 * Share link response interface
 */
export interface ShareLinkResponse {
  id: string;
  slug: string;
  shareUrl: string;
  resumeId: string;
  isActive: boolean;
  expiresAt: Date | null;
  viewCount: number;
  createdAt: Date;
}
