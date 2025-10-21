import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

/**
 * GET /api/templates
 * List all available resume templates
 * Query params:
 * - category: string (optional) - Filter by category
 * - premium: boolean (optional) - Filter by premium status
 * - active: boolean (optional) - Filter by active status (default: true)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const category = searchParams.get('category');
    const premium = searchParams.get('premium');
    const active = searchParams.get('active');

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (premium !== null) {
      where.isPremium = premium === 'true';
    }

    // Default to showing only active templates
    if (active === null || active === 'true') {
      where.isActive = true;
    } else if (active === 'false') {
      where.isActive = false;
    }

    // Fetch templates from database
    let templates = await prisma.template.findMany({
      where,
      orderBy: [
        { category: 'asc' },
        { usageCount: 'desc' },
        { name: 'asc' },
      ],
      select: {
        id: true,
        name: true,
        displayName: true,
        description: true,
        structure: true,
        preview: true,
        category: true,
        isPremium: true,
        isActive: true,
        usageCount: true,
      },
    });

    // If no templates in database, return predefined templates
    if (templates.length === 0) {
      templates = [
        {
          id: 'modern',
          name: 'modern',
          displayName: 'Modern',
          description: 'Clean and modern design with a professional look',
          structure: {
            layout: 'single-column',
            sections: ['header', 'summary', 'experience', 'education', 'skills'],
          },
          preview: '/templates/modern-preview.png',
          category: 'modern',
          isPremium: false,
          isActive: true,
          usageCount: 0,
        },
        {
          id: 'professional',
          name: 'professional',
          displayName: 'Professional',
          description: 'Traditional professional layout with clear sections',
          structure: {
            layout: 'single-column',
            sections: ['header', 'experience', 'education', 'skills', 'summary'],
          },
          preview: '/templates/professional-preview.png',
          category: 'professional',
          isPremium: false,
          isActive: true,
          usageCount: 0,
        },
        {
          id: 'creative',
          name: 'creative',
          displayName: 'Creative',
          description: 'Eye-catching design for creative professionals',
          structure: {
            layout: 'two-column',
            sections: ['header', 'summary', 'experience', 'skills', 'projects'],
          },
          preview: '/templates/creative-preview.png',
          category: 'creative',
          isPremium: true,
          isActive: true,
          usageCount: 0,
        },
        {
          id: 'minimal',
          name: 'minimal',
          displayName: 'Minimal',
          description: 'Simple and elegant minimalist design',
          structure: {
            layout: 'single-column',
            sections: ['header', 'experience', 'education', 'skills'],
          },
          preview: '/templates/minimal-preview.png',
          category: 'minimal',
          isPremium: false,
          isActive: true,
          usageCount: 0,
        },
        {
          id: 'compact',
          name: 'compact',
          displayName: 'Compact',
          description: 'Space-efficient layout that fits more content',
          structure: {
            layout: 'two-column',
            sections: ['header', 'skills', 'experience', 'education', 'projects'],
          },
          preview: '/templates/compact-preview.png',
          category: 'professional',
          isPremium: false,
          isActive: true,
          usageCount: 0,
        },
        {
          id: 'executive',
          name: 'executive',
          displayName: 'Executive',
          description: 'Premium template for senior professionals',
          structure: {
            layout: 'single-column',
            sections: ['header', 'summary', 'experience', 'education'],
          },
          preview: '/templates/executive-preview.png',
          category: 'professional',
          isPremium: true,
          isActive: true,
          usageCount: 0,
        },
      ];

      // Apply filters to predefined templates
      if (category) {
        templates = templates.filter((t: any) => t.category === category);
      }
      if (premium !== null) {
        const isPremium = premium === 'true';
        templates = templates.filter((t: any) => t.isPremium === isPremium);
      }
    }

    // Group templates by category
    const groupedByCategory: any = {};
    templates.forEach((template: any) => {
      if (!groupedByCategory[template.category]) {
        groupedByCategory[template.category] = [];
      }
      groupedByCategory[template.category].push(template);
    });

    return NextResponse.json({
      success: true,
      data: {
        templates,
        groupedByCategory,
        total: templates.length,
      },
    });
  } catch (error) {
    console.error('Error fetching templates:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      { status: 500 }
    );
  }
}
