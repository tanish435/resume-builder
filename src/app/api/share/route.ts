/**
 * Share API Route
 * POST /api/share - Generate a shareable link for a resume
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { 
  generateSlug, 
  generateShareUrl, 
  calculateExpirationDate,
  ShareOptions,
  ShareLinkResponse 
} from '@/lib/shareUtils';

/**
 * Maximum number of retries for slug generation if collision occurs
 */
const MAX_SLUG_RETRIES = 5;

/**
 * POST /api/share
 * Generate a unique shareable link for a resume
 * 
 * Request Body:
 * - resumeId: string (required)
 * - expiresInDays: number | null (optional, default: null for no expiration)
 * - password: string | null (optional, for password protection)
 * 
 * Response:
 * - 201: Share link created successfully
 * - 400: Invalid request
 * - 404: Resume not found
 * - 409: Failed to generate unique slug
 * - 500: Server error
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json() as ShareOptions;
    const { resumeId, expiresInDays = null, password = null } = body;

    // Validate required fields
    if (!resumeId || typeof resumeId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: resumeId is required' },
        { status: 400 }
      );
    }

    // TEMPORARY: Skip database check for sample resume (development mode)
    // In production, you would verify the resume exists and user has permission
    const isSampleResume = resumeId === 'sample-resume-1';
    
    if (!isSampleResume) {
      try {
        // Verify resume exists in database
        const resume = await prisma.resume.findUnique({
          where: { id: resumeId },
          select: { id: true, userId: true },
        });

        if (!resume) {
          return NextResponse.json(
            { error: 'Resume not found' },
            { status: 404 }
          );
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue for sample resume even if DB fails
        if (!isSampleResume) {
          return NextResponse.json(
            { error: 'Database connection error' },
            { status: 500 }
          );
        }
      }
    }

    // Generate unique slug with collision handling
    let slug: string | null = null;
    let attempts = 0;

    while (attempts < MAX_SLUG_RETRIES && !slug) {
      const candidateSlug = generateSlug(10);
      
      try {
        // Check if slug already exists (skip for sample resume in dev mode)
        if (!isSampleResume) {
          const existingLink = await prisma.shareLink.findUnique({
            where: { slug: candidateSlug },
          });

          if (!existingLink) {
            slug = candidateSlug;
          }
        } else {
          // For sample resume, just use the generated slug
          slug = candidateSlug;
        }
      } catch (error) {
        // If database check fails, use the slug anyway for sample resume
        if (isSampleResume) {
          slug = candidateSlug;
        }
      }
      
      attempts++;
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Failed to generate unique slug. Please try again.' },
        { status: 409 }
      );
    }

    // Calculate expiration date
    const expiresAt = calculateExpirationDate(expiresInDays);

    // Create share link in database or use mock data for sample resume
    let shareLink;
    
    try {
      shareLink = await prisma.shareLink.create({
        data: {
          slug,
          resumeId,
          expiresAt,
          password: password || null, // TODO: Hash password if provided
          isActive: true,
          viewCount: 0,
        },
      });
    } catch (dbError) {
      console.error('Database create error:', dbError);
      
      // For sample resume, create a mock response
      if (isSampleResume) {
        shareLink = {
          id: `mock-share-${slug}`,
          slug,
          resumeId,
          expiresAt,
          password: null,
          isActive: true,
          viewCount: 0,
          lastViewedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        throw dbError; // Re-throw for non-sample resumes
      }
    }

    // Generate full shareable URL
    const baseUrl = request.nextUrl.origin;
    const shareUrl = generateShareUrl(slug, baseUrl);

    // Format response
    const response: ShareLinkResponse = {
      id: shareLink.id,
      slug: shareLink.slug,
      shareUrl,
      resumeId: shareLink.resumeId,
      isActive: shareLink.isActive,
      expiresAt: shareLink.expiresAt,
      viewCount: shareLink.viewCount,
      createdAt: shareLink.createdAt,
    };

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    console.error('Error creating share link:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/share?resumeId={resumeId}
 * Get all share links for a resume
 * 
 * Query Parameters:
 * - resumeId: string (required)
 * 
 * Response:
 * - 200: Array of share links
 * - 400: Invalid request
 * - 500: Server error
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const resumeId = searchParams.get('resumeId');

    if (!resumeId) {
      return NextResponse.json(
        { error: 'Invalid request: resumeId query parameter is required' },
        { status: 400 }
      );
    }

    // Get all share links for the resume
    const shareLinks = await prisma.shareLink.findMany({
      where: { resumeId },
      orderBy: { createdAt: 'desc' },
    });

    // Format response with full URLs
    const baseUrl = request.nextUrl.origin;
    const response = shareLinks.map((link) => ({
      id: link.id,
      slug: link.slug,
      shareUrl: generateShareUrl(link.slug, baseUrl),
      resumeId: link.resumeId,
      isActive: link.isActive,
      expiresAt: link.expiresAt,
      viewCount: link.viewCount,
      lastViewedAt: link.lastViewedAt,
      createdAt: link.createdAt,
    }));

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('Error fetching share links:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/share
 * Deactivate a share link
 * 
 * Request Body:
 * - shareId: string (required)
 * 
 * Response:
 * - 200: Share link deactivated
 * - 400: Invalid request
 * - 404: Share link not found
 * - 500: Server error
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { shareId } = body;

    if (!shareId || typeof shareId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request: shareId is required' },
        { status: 400 }
      );
    }

    // Update share link to inactive
    const shareLink = await prisma.shareLink.update({
      where: { id: shareId },
      data: { isActive: false },
    });

    return NextResponse.json(
      { 
        message: 'Share link deactivated successfully',
        id: shareLink.id,
        isActive: shareLink.isActive,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error deactivating share link:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
