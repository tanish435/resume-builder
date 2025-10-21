import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Validation schema for resume creation/update
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

const ResumeCreateSchema = z.object({
  title: z.string().min(1, 'Resume title is required'),
  personalInfo: PersonalInfoSchema,
  template: z.string().default('modern'),
  theme: z.string().default('blue'),
  sections: z.object({
    education: z.array(EducationItemSchema).optional(),
    experience: z.array(ExperienceItemSchema).optional(),
    skills: z.array(SkillItemSchema).optional(),
    projects: z.array(ProjectItemSchema).optional(),
  }).optional(),
});

/**
 * POST /api/resumes
 * Create a new resume
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    const validatedData = ResumeCreateSchema.parse(body);

    // Create resume in database
    // Note: Using a default user ID for now (will be replaced with auth)
    const userId = 'default-user-id';

    const sectionsToCreate: any[] = [];
    let order = 0;

    if (validatedData.sections?.education) {
      sectionsToCreate.push({
        type: 'EDUCATION' as const,
        data: validatedData.sections.education,
        order: order++,
      });
    }

    if (validatedData.sections?.experience) {
      sectionsToCreate.push({
        type: 'EXPERIENCE' as const,
        data: validatedData.sections.experience,
        order: order++,
      });
    }

    if (validatedData.sections?.skills) {
      sectionsToCreate.push({
        type: 'SKILLS' as const,
        data: validatedData.sections.skills,
        order: order++,
      });
    }

    if (validatedData.sections?.projects) {
      sectionsToCreate.push({
        type: 'PROJECTS' as const,
        data: validatedData.sections.projects,
        order: order++,
      });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: validatedData.title,
        templateId: validatedData.template,
        sections: {
          create: sectionsToCreate,
        },
      },
      include: {
        sections: true,
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

    // Build where clause for search
    const where = search
      ? {
          OR: [
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
          ],
        }
      : {};

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
