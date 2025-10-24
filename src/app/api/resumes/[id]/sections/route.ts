import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validation schema for sections
const SectionSchema = z.object({
  type: z.string(),
  data: z.any(), // Flexible data field for any section type
  order: z.number(),
  isVisible: z.boolean().optional().default(true),
});

const SectionsUpdateSchema = z.object({
  sections: z.array(SectionSchema),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PUT /api/resumes/[id]/sections
 * Update only the sections of a resume (more efficient than full resume update)
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
    const validatedData = SectionsUpdateSchema.parse(body);

    // Check if resume exists and belongs to user
    const existingResume = await prisma.resume.findFirst({
      where: {
        id,
        userId: session.user.id,
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

    // Delete existing sections and create new ones in a transaction
    await prisma.$transaction(async (tx) => {
      // Delete all existing sections
      await tx.section.deleteMany({
        where: { resumeId: id },
      });

      // Create new sections
      const sectionsToCreate = validatedData.sections.map(section => ({
        resumeId: id,
        type: section.type as any,
        data: section.data,
        order: section.order,
        isVisible: section.isVisible !== undefined ? section.isVisible : true,
      }));

      await tx.section.createMany({
        data: sectionsToCreate,
      });

      // Update resume's lastEditedAt timestamp
      await tx.resume.update({
        where: { id },
        data: {
          updatedAt: new Date(),
          lastEditedAt: new Date(),
        },
      });
    });

    // Fetch updated resume with sections
    const updatedResume = await prisma.resume.findUnique({
      where: { id },
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
      message: 'Sections updated successfully',
    });
  } catch (error) {
    console.error('Error updating sections:', error);

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
        error: 'Failed to update sections',
      },
      { status: 500 }
    );
  }
}
