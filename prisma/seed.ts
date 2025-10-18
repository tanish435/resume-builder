import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ============================================
  // SEED TEMPLATES
  // ============================================
  console.log('📄 Seeding templates...');

  const templates = [
    {
      name: 'modern',
      displayName: 'Modern',
      description: 'Clean, single-column layout with bold headings',
      category: 'modern',
      structure: {
        layout: 'single-column',
        columns: {
          main: {
            width: '100%',
            sections: [
              'PERSONAL_INFO',
              'SUMMARY',
              'EXPERIENCE',
              'EDUCATION',
              'SKILLS',
              'PROJECTS',
            ],
          },
        },
        sectionSpacing: 24,
        marginTop: 48,
        marginBottom: 48,
        marginLeft: 48,
        marginRight: 48,
        headerStyle: 'centered',
        sectionDividers: true,
      },
      preview: '/templates/modern-preview.png',
      isActive: true,
    },
    {
      name: 'professional',
      displayName: 'Professional',
      description: 'Traditional two-column layout for professional appeal',
      category: 'professional',
      structure: {
        layout: 'two-column',
        columns: {
          left: {
            width: '35%',
            sections: ['PERSONAL_INFO', 'SKILLS', 'LANGUAGES', 'CERTIFICATIONS'],
          },
          right: {
            width: '65%',
            sections: ['SUMMARY', 'EXPERIENCE', 'EDUCATION', 'PROJECTS'],
          },
        },
        sectionSpacing: 20,
        marginTop: 40,
        marginBottom: 40,
        marginLeft: 32,
        marginRight: 32,
        headerStyle: 'split',
        sectionDividers: false,
      },
      preview: '/templates/professional-preview.png',
      isActive: true,
    },
    {
      name: 'creative',
      displayName: 'Creative',
      description: 'Eye-catching asymmetric design for creative professionals',
      category: 'creative',
      structure: {
        layout: 'two-column',
        columns: {
          left: {
            width: '30%',
            sections: ['PERSONAL_INFO', 'SKILLS', 'INTERESTS'],
          },
          right: {
            width: '70%',
            sections: [
              'SUMMARY',
              'EXPERIENCE',
              'PROJECTS',
              'EDUCATION',
              'CERTIFICATIONS',
            ],
          },
        },
        sectionSpacing: 28,
        marginTop: 36,
        marginBottom: 36,
        marginLeft: 40,
        marginRight: 40,
        headerStyle: 'left',
        sectionDividers: true,
      },
      preview: '/templates/creative-preview.png',
      isActive: true,
    },
    {
      name: 'minimal',
      displayName: 'Minimal',
      description: 'Simple, elegant design with maximum readability',
      category: 'minimal',
      structure: {
        layout: 'single-column',
        columns: {
          main: {
            width: '100%',
            sections: [
              'PERSONAL_INFO',
              'EXPERIENCE',
              'EDUCATION',
              'SKILLS',
              'PROJECTS',
            ],
          },
        },
        sectionSpacing: 32,
        marginTop: 60,
        marginBottom: 60,
        marginLeft: 60,
        marginRight: 60,
        headerStyle: 'left',
        sectionDividers: false,
      },
      preview: '/templates/minimal-preview.png',
      isActive: true,
    },
    {
      name: 'compact',
      displayName: 'Compact',
      description: 'Space-efficient layout to fit more content',
      category: 'professional',
      structure: {
        layout: 'two-column',
        columns: {
          left: {
            width: '40%',
            sections: ['PERSONAL_INFO', 'SKILLS', 'LANGUAGES'],
          },
          right: {
            width: '60%',
            sections: ['EXPERIENCE', 'EDUCATION', 'PROJECTS', 'CERTIFICATIONS'],
          },
        },
        sectionSpacing: 16,
        marginTop: 32,
        marginBottom: 32,
        marginLeft: 32,
        marginRight: 32,
        headerStyle: 'left',
        sectionDividers: false,
      },
      preview: '/templates/compact-preview.png',
      isActive: true,
    },
  ];

  for (const template of templates) {
    await prisma.template.upsert({
      where: { name: template.name },
      update: template,
      create: template,
    });
    console.log(`  ✓ Created/Updated template: ${template.displayName}`);
  }

  // ============================================
  // SEED STYLE PRESETS
  // ============================================
  console.log('\n🎨 Seeding style presets...');

  const stylePresets = [
    {
      name: 'classic-blue',
      description: 'Professional blue theme',
      config: {
        primaryColor: '#2563eb',
        secondaryColor: '#3b82f6',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5,
        spacing: 'normal',
        accentColor: '#60a5fa',
      },
      isDefault: true,
      isPublic: true,
    },
    {
      name: 'elegant-purple',
      description: 'Modern purple theme',
      config: {
        primaryColor: '#7c3aed',
        secondaryColor: '#8b5cf6',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5,
        spacing: 'normal',
        accentColor: '#a78bfa',
      },
      isDefault: true,
      isPublic: true,
    },
    {
      name: 'fresh-green',
      description: 'Vibrant green theme',
      config: {
        primaryColor: '#059669',
        secondaryColor: '#10b981',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5,
        spacing: 'normal',
        accentColor: '#34d399',
      },
      isDefault: true,
      isPublic: true,
    },
    {
      name: 'monochrome',
      description: 'Black and white theme',
      config: {
        primaryColor: '#1f2937',
        secondaryColor: '#374151',
        textColor: '#111827',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5,
        spacing: 'normal',
        accentColor: '#6b7280',
      },
      isDefault: true,
      isPublic: true,
    },
    {
      name: 'warm-orange',
      description: 'Energetic orange theme',
      config: {
        primaryColor: '#ea580c',
        secondaryColor: '#f97316',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Inter',
        fontSize: 14,
        lineHeight: 1.5,
        spacing: 'normal',
        accentColor: '#fb923c',
      },
      isDefault: true,
      isPublic: true,
    },
    {
      name: 'navy-professional',
      description: 'Deep navy for corporate appeal',
      config: {
        primaryColor: '#1e3a8a',
        secondaryColor: '#1e40af',
        textColor: '#1f2937',
        backgroundColor: '#ffffff',
        fontFamily: 'Merriweather',
        fontSize: 13,
        lineHeight: 1.6,
        spacing: 'relaxed',
        accentColor: '#3b82f6',
      },
      isDefault: true,
      isPublic: true,
    },
  ];

  for (const preset of stylePresets) {
    await prisma.stylePreset.upsert({
      where: { name: preset.name },
      update: preset,
      create: preset,
    });
    console.log(`  ✓ Created/Updated style preset: ${preset.name}`);
  }

  console.log('\n✅ Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
