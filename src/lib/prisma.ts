import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for common operations

/**
 * Get user with all resumes
 */
export async function getUserWithResumes(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      resumes: {
        include: {
          template: true,
        },
        orderBy: {
          updatedAt: 'desc',
        },
      },
    },
  });
}

/**
 * Get resume with all sections and template
 */
export async function getResumeWithSections(resumeId: string) {
  return prisma.resume.findUnique({
    where: { id: resumeId },
    include: {
      sections: {
        orderBy: {
          order: 'asc',
        },
      },
      template: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });
}

/**
 * Get resume by share link slug
 */
export async function getResumeByShareLink(slug: string) {
  const shareLink = await prisma.shareLink.findUnique({
    where: { slug },
    include: {
      resume: {
        include: {
          sections: {
            where: {
              isVisible: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          template: true,
        },
      },
    },
  });

  // Update view count
  if (shareLink) {
    await prisma.shareLink.update({
      where: { id: shareLink.id },
      data: {
        viewCount: {
          increment: 1,
        },
        lastViewedAt: new Date(),
      },
    });
  }

  return shareLink;
}

/**
 * Create a new resume with default sections
 */
export async function createResumeWithDefaults(
  userId: string,
  title: string = 'Untitled Resume'
) {
  // Get the first active template (fallback to any template if none active)
  const defaultTemplate = await prisma.template.findFirst({
    where: { isActive: true },
    orderBy: { usageCount: 'desc' },
  });

  if (!defaultTemplate) {
    throw new Error('No templates available. Please run database seed.');
  }

  return prisma.resume.create({
    data: {
      userId,
      title,
      templateId: defaultTemplate.id, // Use actual template ID
      sections: {
        create: [
          {
            type: 'PERSONAL_INFO',
            order: 0,
            data: {
              fullName: '',
              email: '',
              phone: '',
              location: '',
            },
          },
        ],
      },
    },
    include: {
      sections: true,
      template: true,
    },
  });
}


/**
 * Create a resume version snapshot
 */
export async function createResumeVersion(
  resumeId: string,
  action?: string
) {
  // Get current resume state
  const resume = await getResumeWithSections(resumeId);
  if (!resume) throw new Error('Resume not found');

  // Get latest version number
  const latestVersion = await prisma.resumeVersion.findFirst({
    where: { resumeId },
    orderBy: { version: 'desc' },
    select: { version: true },
  });

  const nextVersion = (latestVersion?.version ?? 0) + 1;

  // Create snapshot
  return prisma.resumeVersion.create({
    data: {
      resumeId,
      version: nextVersion,
      action,
      data: {
        title: resume.title,
        templateId: resume.templateId,
        styleConfig: resume.styleConfig,
        sections: resume.sections,
      },
    },
  });
}

/**
 * Get all templates
 */
export async function getAllTemplates() {
  return prisma.template.findMany({
    where: { isActive: true },
    orderBy: { usageCount: 'desc' },
  });
}

/**
 * Get all style presets
 */
export async function getAllStylePresets() {
  return prisma.stylePreset.findMany({
    where: {
      OR: [{ isPublic: true }, { isDefault: true }],
    },
    orderBy: { usageCount: 'desc' },
  });
}

/**
 * Clean up expired share links
 */
export async function cleanupExpiredShareLinks() {
  const now = new Date();
  return prisma.shareLink.updateMany({
    where: {
      expiresAt: {
        lt: now,
      },
      isActive: true,
    },
    data: {
      isActive: false,
    },
  });
}

export default prisma;
