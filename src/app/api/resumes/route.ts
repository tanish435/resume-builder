import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validation schema for resume creation
const SectionSchema = z.object({
  type: z.string(),
  data: z.any(), // Flexible data structure for different section types
  order: z.number(),
  isVisible: z.boolean().optional().default(true),
});

const ResumeCreateSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  templateId: z.string().optional().default('modern'),
  styleConfig: z.object({
    primaryColor: z.string().optional(),
    textColor: z.string().optional(),
    backgroundColor: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
    lineHeight: z.number().optional(),
    spacing: z.string().optional(),
  }).optional(),
  sections: z.array(SectionSchema).optional().default([]),
  isPublic: z.boolean().optional().default(false),
});

/**
 * POST /api/resumes
 * Create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const validatedData = ResumeCreateSchema.parse(body);

    // Create resume in database
    const userId = session.user.id;

    // Prepare sections data - sections come as an array already
    const sectionsToCreate = validatedData.sections?.map(section => ({
      type: section.type as any, // Cast to match Prisma SectionType enum
      data: section.data,
      order: section.order,
      isVisible: section.isVisible,
    })) || [];

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: validatedData.title,
        templateId: validatedData.templateId || 'modern',
        styleConfig: validatedData.styleConfig || {},
        isPublic: validatedData.isPublic || false,
        sections: {
          create: sectionsToCreate,
        },
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: resume,
        message: 'Resume created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating resume:', error);

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
        error: 'Failed to create resume',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/resumes
 * List all resumes for the current user
 * Query params:
 * - page: number (default: 1)
 * - limit: number (default: 10)
 * - search: string (optional)
 * - sortBy: 'createdAt' | 'updatedAt' | 'title' (default: 'updatedAt')
 * - sortOrder: 'asc' | 'desc' (default: 'desc')
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = (searchParams.get('sortBy') || 'updatedAt') as 'createdAt' | 'updatedAt' | 'title';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    // Validate pagination params
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid pagination parameters',
        },
        { status: 400 }
      );
    }

    // Build where clause for search and user filter
    const where: any = {
      userId: session.user.id, // Filter by authenticated user
    };

    if (search) {
      where.OR = [
        {
          title: {
            contains: search,
            mode: 'insensitive' as const,
          },
        },
        {
          personalInfo: {
            path: ['fullName'],
            string_contains: search,
          },
        },
        {
          personalInfo: {
            path: ['email'],
            string_contains: search,
          },
        },
      ];
    }

    // Fetch resumes with pagination
    const [resumes, total] = await Promise.all([
      prisma.resume.findMany({
        where,
        include: {
          sections: {
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              shareLinks: true,
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.resume.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        resumes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: page * limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resumes',
      },
      { status: 500 }
    );
  }
}
