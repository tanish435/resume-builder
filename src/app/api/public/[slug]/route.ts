import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isExpired } from '@/lib/shareUtils';

interface RouteParams {
  params: {
    slug: string;
  };
}

/**
 * GET /api/public/[slug]
 * Get a public resume by share link slug
 * This endpoint is for public access and doesn't require authentication
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug || typeof slug !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid share link',
        },
        { status: 400 }
      );
    }

    // Check for sample resume slug (development mode)
    const isSampleSlug = slug.startsWith('sample-');

    if (isSampleSlug) {
      // Return mock data for sample resume
      const sampleResumeData = {
        shareLink: {
          id: 'sample-share-1',
          slug,
          isActive: true,
          expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
          viewCount: 42,
          lastViewedAt: new Date().toISOString(),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        },
        resume: {
          id: 'sample-resume-1',
          title: 'Sample Resume',
          personalInfo: {
            fullName: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 123-4567',
            location: 'San Francisco, CA',
            title: 'Full Stack Developer',
            summary: 'Passionate developer with 5+ years of experience building web applications.',
            linkedin: 'https://linkedin.com/in/johndoe',
            github: 'https://github.com/johndoe',
            website: 'https://johndoe.com',
          },
          sections: {
            education: [
              {
                id: '1',
                institution: 'University of California',
                degree: 'Bachelor of Science',
                field: 'Computer Science',
                startDate: '2015-09',
                endDate: '2019-05',
                gpa: '3.8',
                description: 'Focus on Software Engineering and AI',
              },
            ],
            experience: [
              {
                id: '1',
                company: 'Tech Corp',
                position: 'Senior Developer',
                location: 'San Francisco, CA',
                startDate: '2021-01',
                endDate: null,
                current: true,
                description: 'Leading development of core platform features',
                achievements: [
                  'Reduced load time by 40%',
                  'Mentored 5 junior developers',
                  'Architected microservices infrastructure',
                ],
              },
            ],
            skills: [
              { id: '1', name: 'React', level: 'Expert', category: 'Frontend' },
              { id: '2', name: 'Node.js', level: 'Advanced', category: 'Backend' },
              { id: '3', name: 'TypeScript', level: 'Expert', category: 'Language' },
            ],
            projects: [
              {
                id: '1',
                name: 'Resume Builder',
                description: 'A modern resume builder with real-time preview',
                technologies: ['React', 'Next.js', 'Prisma'],
                url: 'https://resumebuilder.com',
                github: 'https://github.com/johndoe/resume-builder',
                highlights: ['1000+ active users', 'Featured on Product Hunt'],
              },
            ],
          },
          template: 'modern',
          theme: 'blue',
        },
      };

      return NextResponse.json({
        success: true,
        data: sampleResumeData,
      });
    }

    // Fetch share link from database
    const shareLink = await prisma.shareLink.findUnique({
      where: { slug },
      include: {
        resume: {
          include: {
            sections: {
              orderBy: {
                order: 'asc',
              },
            },
          },
        },
      },
    });

    if (!shareLink) {
      return NextResponse.json(
        {
          success: false,
          error: 'Share link not found',
        },
        { status: 404 }
      );
    }

    // Check if link is active
    if (!shareLink.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'This share link has been deactivated',
        },
        { status: 410 }
      );
    }

    // Check if link is expired
    if (shareLink.expiresAt && isExpired(shareLink.expiresAt)) {
      return NextResponse.json(
        {
          success: false,
          error: 'This share link has expired',
        },
        { status: 410 }
      );
    }

    // Increment view count
    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });

    // Transform sections data for response
    const sectionsData: any = {};

    shareLink.resume.sections.forEach((section: any) => {
      const sectionType = section.type.toLowerCase().replace('_', '');
      sectionsData[sectionType] = section.data;
    });

    // Parse styleConfig to extract theme
    const styleConfig = shareLink.resume.styleConfig as any;

    // Prepare response
    const responseData = {
      shareLink: {
        id: shareLink.id,
        slug: shareLink.slug,
        isActive: shareLink.isActive,
        expiresAt: shareLink.expiresAt?.toISOString() || null,
        viewCount: shareLink.viewCount + 1, // Include the current view
        lastViewedAt: new Date().toISOString(),
        createdAt: shareLink.createdAt.toISOString(),
      },
      resume: {
        id: shareLink.resume.id,
        title: shareLink.resume.title,
        sections: sectionsData,
        template: shareLink.resume.templateId,
        styleConfig: styleConfig,
      },
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('Error fetching public resume:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch resume',
      },
      { status: 500 }
    );
  }
}
