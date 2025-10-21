import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { generateSlug, calculateExpirationDate } from '@/lib/shareUtils';
import { z } from 'zod';

const ShareOptionsSchema = z.object({
  expiresInDays: z.number().min(1).max(365).optional().default(90),
  password: z.string().optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
}

/**
 * POST /api/share/[id]
 * Generate a share link for a resume
 */
export async function POST(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;

    // Validate resume ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume ID is required',
        },
        { status: 400 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const options = ShareOptionsSchema.parse(body);

    // Generate unique slug
    const slug = generateSlug();

    // Calculate expiration date
    const expiresAt = calculateExpirationDate(options.expiresInDays);

    // Check if this is the sample resume
    const isSampleResume = id === 'sample-resume-1';

    let shareLink;

    if (isSampleResume) {
      // For sample resume, return mock data without database operation
      shareLink = {
        id: `mock-share-${Date.now()}`,
        resumeId: id,
        slug,
        isActive: true,
        password: options.password || null,
        expiresAt,
        viewCount: 0,
        lastViewedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } else {
      // Check if resume exists in database
      const resume = await prisma.resume.findUnique({
        where: { id },
      });

      if (!resume) {
        return NextResponse.json(
          {
            success: false,
            error: 'Resume not found',
          },
          { status: 404 }
        );
      }

      // Create share link in database
      shareLink = await prisma.shareLink.create({
        data: {
          slug,
          resumeId: id,
          isActive: true,
          password: options.password,
          expiresAt,
          viewCount: 0,
        },
      });
    }

    // Generate the full share URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shareUrl = `${baseUrl}/share/${slug}`;

    return NextResponse.json(
      {
        success: true,
        data: {
          shareLink,
          url: shareUrl,
        },
        message: 'Share link created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating share link:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create share link',
      },
      { status: 500 }
    );
  }
}
