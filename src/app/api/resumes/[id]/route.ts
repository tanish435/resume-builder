import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schemas (same as in route.ts)
const PersonalInfoSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  location: z.string().optional(),
  title: z.string().optional(),
  summary: z.string().optional(),
  linkedin: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
});

const EducationItemSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  gpa: z.string().optional(),
  description: z.string().optional(),
});

const ExperienceItemSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company is required'),
  position: z.string().min(1, 'Position is required'),
  location: z.string().optional(),
  startDate: z.string(),
  endDate: z.string().optional(),
  current: z.boolean().optional(),
  description: z.string().optional(),
  achievements: z.array(z.string()).optional(),
});

const SkillItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Skill name is required'),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
  category: z.string().optional(),
});

const ProjectItemSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Project name is required'),
  description: z.string().optional(),
  technologies: z.array(z.string()).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  url: z.string().url().optional().or(z.literal('')),
  github: z.string().url().optional().or(z.literal('')),
  highlights: z.array(z.string()).optional(),
});

const ResumeUpdateSchema = z.object({
  title: z.string().min(1, 'Resume title is required').optional(),
  personalInfo: PersonalInfoSchema.optional(),
  template: z.string().optional(),
  theme: z.string().optional(),
  sections: z.object({
    education: z.array(EducationItemSchema).optional(),
    experience: z.array(ExperienceItemSchema).optional(),
    skills: z.array(SkillItemSchema).optional(),
    projects: z.array(ProjectItemSchema).optional(),
  }).optional(),
});

interface RouteParams {
  params: {
    id: string;
  };
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
    const { id } = params;

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

    // Fetch resume from database
    const resume = await prisma.resume.findUnique({
      where: { id },
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
    const { id } = params;
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

    // Check if resume exists
    const existingResume = await prisma.resume.findUnique({
      where: { id },
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
    };

    if (validatedData.title) updateData.title = validatedData.title;
    if (validatedData.personalInfo) updateData.personalInfo = validatedData.personalInfo;
    if (validatedData.template) updateData.template = validatedData.template;
    if (validatedData.theme) updateData.theme = validatedData.theme;

    // Update sections if provided
    if (validatedData.sections) {
      // Delete existing sections and create new ones
      await prisma.section.deleteMany({
        where: { resumeId: id },
      });

      const sectionsToCreate = [];
      let order = 0;

      if (validatedData.sections.education) {
        sectionsToCreate.push({
          type: 'education',
          content: validatedData.sections.education,
          order: order++,
        });
      }

      if (validatedData.sections.experience) {
        sectionsToCreate.push({
          type: 'experience',
          content: validatedData.sections.experience,
          order: order++,
        });
      }

      if (validatedData.sections.skills) {
        sectionsToCreate.push({
          type: 'skills',
          content: validatedData.sections.skills,
          order: order++,
        });
      }

      if (validatedData.sections.projects) {
        sectionsToCreate.push({
          type: 'projects',
          content: validatedData.sections.projects,
          order: order++,
        });
      }

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
    const { id } = params;

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

    // Check if resume exists
    const existingResume = await prisma.resume.findUnique({
      where: { id },
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
