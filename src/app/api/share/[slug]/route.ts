/**
 * GET /api/share/[slug]
 * Fetch a shared resume by slug and increment view count
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isExpired } from '@/lib/shareUtils';

/**
 * GET /api/share/[slug]
 * Retrieve shared resume data by slug
 * 
 * Features:
 * - Fetches resume with all sections
 * - Increments view counter
 * - Updates last viewed timestamp
 * - Validates expiration
 * - Checks if link is active
 * 
 * Response:
 * - 200: Resume data returned successfully
 * - 404: Share link not found
 * - 410: Share link expired or inactive
 * - 500: Server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        { error: 'Invalid slug' },
        { status: 400 }
      );
    }

    // DEVELOPMENT MODE: Handle mock share links for sample resume
    const isMockShare = slug.startsWith('mock-') || slug.length === 10;
    
    if (isMockShare) {
      // Check if this is for the sample resume
      // In dev mode without database, return mock data
      try {
        const shareLink = await prisma.shareLink.findUnique({
          where: { slug },
          include: {
            resume: {
              include: {
                sections: {
                  where: { isVisible: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
          },
        });

        if (shareLink) {
          // Database found the link, use it
          return handleShareLinkResponse(shareLink, slug);
        }
      } catch (dbError) {
        console.log('Database not available, using mock data for development');
      }

      // Return mock data for development
      return NextResponse.json({
        shareLink: {
          id: `mock-${slug}`,
          slug,
          resumeId: 'sample-resume-1',
          isActive: true,
          expiresAt: null,
          viewCount: 1,
          lastViewedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        },
        resume: {
          id: 'sample-resume-1',
          title: 'My Professional Resume',
          templateId: 'modern',
          styleConfig: {
            primaryColor: '#2563eb',
            textColor: '#1f2937',
            backgroundColor: '#ffffff',
            fontFamily: 'Inter, sans-serif',
            fontSize: 14,
            lineHeight: 1.6,
            spacing: 'normal',
          },
          sections: [],
        },
        message: 'Development mode: Using sample data. Connect database for full functionality.',
      }, { status: 200 });
    }

    // PRODUCTION MODE: Fetch from database
    const shareLink = await prisma.shareLink.findUnique({
      where: { slug },
      include: {
        resume: {
          include: {
            sections: {
              where: { isVisible: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        { error: 'Share link not found' },
        { status: 404 }
      );
    }

    return handleShareLinkResponse(shareLink, slug);
  } catch (error) {
    console.error('Error fetching shared resume:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Helper function to handle share link response
 */
async function handleShareLinkResponse(shareLink: any, slug: string) {
  // Check if link is active
  if (!shareLink.isActive) {
    return NextResponse.json(
      { 
        error: 'This share link has been deactivated',
        status: 'inactive',
      },
      { status: 410 }
    );
  }

  // Check if link has expired
  if (shareLink.expiresAt && isExpired(shareLink.expiresAt)) {
    return NextResponse.json(
      { 
        error: 'This share link has expired',
        status: 'expired',
        expiresAt: shareLink.expiresAt,
      },
      { status: 410 }
    );
  }

  // Increment view count and update last viewed timestamp
  try {
    await prisma.shareLink.update({
      where: { slug },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });
  } catch (updateError) {
    console.error('Failed to update view count:', updateError);
    // Continue anyway - don't fail the request just because we can't update the counter
  }

  // Return resume data
  return NextResponse.json({
    shareLink: {
      id: shareLink.id,
      slug: shareLink.slug,
      resumeId: shareLink.resumeId,
      isActive: shareLink.isActive,
      expiresAt: shareLink.expiresAt,
      viewCount: shareLink.viewCount + 1, // Include the increment we just made
      lastViewedAt: new Date().toISOString(),
      createdAt: shareLink.createdAt,
    },
    resume: {
      id: shareLink.resume.id,
      title: shareLink.resume.title,
      templateId: shareLink.resume.templateId,
      styleConfig: shareLink.resume.styleConfig,
      sections: shareLink.resume.sections,
    },
  }, { status: 200 });
}
