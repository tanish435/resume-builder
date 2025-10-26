import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Validation schema for metadata only
const MetadataUpdateSchema = z.object({
  title: z.string().min(1, 'Resume title is required').optional(),
  templateId: z.string().optional(),
  styleConfig: z.record(z.string(), z.any()).optional(), // Allow any style config properties
  isPublic: z.boolean().optional(),
});

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * PATCH /api/resumes/[id]/metadata
 * Update only the metadata of a resume (title, template, style)
 * This is more efficient than updating the entire resume
 */
export async function PATCH(
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
    const validatedData = MetadataUpdateSchema.parse(body);

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

    // Prepare update data - only include fields that are provided
    const updateData: any = {
      updatedAt: new Date(),
      lastEditedAt: new Date(),
    };

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }

    if (validatedData.templateId !== undefined) {
      updateData.templateId = validatedData.templateId;
    }

    if (validatedData.styleConfig !== undefined) {
      updateData.styleConfig = validatedData.styleConfig;
    }

    if (validatedData.isPublic !== undefined) {
      updateData.isPublic = validatedData.isPublic;
    }

    // Update resume metadata
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
      message: 'Resume metadata updated successfully',
    });
  } catch (error) {
    console.error('Error updating resume metadata:', error);

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
        error: 'Failed to update resume metadata',
      },
      { status: 500 }
    );
  }
}
