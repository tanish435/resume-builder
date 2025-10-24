import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validation schemas - simplified to match dashboard data structure
const SectionSchema = z.object({
  type: z.string(),
  data: z.any(), // Flexible data field for any section type
  order: z.number(),
  isVisible: z.boolean().optional().default(true),
});

const ResumeUpdateSchema = z.object({
  title: z.string().min(1, 'Resume title is required').optional(),
  templateId: z.string().optional(),
  styleConfig: z.object({
    primaryColor: z.string().optional(),
    textColor: z.string().optional(),
    backgroundColor: z.string().optional(),
    fontFamily: z.string().optional(),
    fontSize: z.number().optional(),
    lineHeight: z.number().optional(),
    margins: z.object({
      top: z.number().optional(),
      bottom: z.number().optional(),
      left: z.number().optional(),
      right: z.number().optional(),
    }).optional(),
    spacing: z.union([
      z.string(), // Allow string for backward compatibility
      z.object({
        section: z.number().optional(),
        paragraph: z.number().optional(),
      })
    ]).optional(),
    accentColor: z.string().optional(),
    borderColor: z.string().optional(),
    borderStyle: z.string().optional(),
  }).optional(),
  sections: z.array(SectionSchema).optional(),
  isPublic: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/resumes/[id]
 * Get a single resume by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID format
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume ID is required',
        },
        { status: 400 }
      );
    }

    // Fetch resume from database - ensure it belongs to the user
    const resume = await prisma.resume.findFirst({
      where: { 
        id,
        userId: session.user.id, // Only get user's own resumes
      },
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
        shareLinks: {
          where: {
            isActive: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
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

    return NextResponse.json({
      success: true,
      data: resume,
    });
  } catch (error) {
    console.error('Error fetching resume:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resume',
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/resumes/[id]
 * Update a resume
 */
export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();

    // Validate ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume ID is required',
        },
        { status: 400 }
      );
    }

    // Validate request body
    const validatedData = ResumeUpdateSchema.parse(body);

    // Check if resume exists and belongs to user
    const existingResume = await prisma.resume.findFirst({
      where: { 
        id,
        userId: session.user.id, // Only allow updating own resumes
      },
      include: { sections: true },
    });

    if (!existingResume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
      lastEditedAt: new Date(),
    };

    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.templateId !== undefined) updateData.templateId = validatedData.templateId;
    if (validatedData.styleConfig !== undefined) updateData.styleConfig = validatedData.styleConfig;
    if (validatedData.isPublic !== undefined) updateData.isPublic = validatedData.isPublic;

    // Update sections if provided
    if (validatedData.sections !== undefined) {
      // Delete existing sections and create new ones
      await prisma.section.deleteMany({
        where: { resumeId: id },
      });

      const sectionsToCreate = validatedData.sections.map(section => ({
        type: section.type as any,
        data: section.data,
        order: section.order,
        isVisible: section.isVisible !== undefined ? section.isVisible : true,
      }));

      updateData.sections = {
        create: sectionsToCreate,
      };
    }

    // Update resume in database
    const updatedResume = await prisma.resume.update({
      where: { id },
      data: updateData,
      include: {
        sections: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedResume,
      message: 'Resume updated successfully',
    });
  } catch (error) {
    console.error('Error updating resume:', error);

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
        error: 'Failed to update resume',
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/resumes/[id]
 * Delete a resume (soft delete by marking as inactive)
 */
export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Validate ID
    if (!id || id.trim() === '') {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume ID is required',
        },
        { status: 400 }
      );
    }

    // Check if resume exists and belongs to user
    const existingResume = await prisma.resume.findFirst({
      where: { 
        id,
        userId: session.user.id, // Only allow deleting own resumes
      },
    });

    if (!existingResume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Resume not found',
        },
        { status: 404 }
      );
    }

    // Hard delete: Remove resume and all related data
    // This will cascade delete sections and share links due to onDelete: Cascade in schema
    await prisma.resume.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting resume:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete resume',
      },
      { status: 500 }
    );
  }
}
