'use client';

import { Resume, Section, StyleConfig, SectionType } from '@/types/schema';
import SectionWrapper from '../resume/SectionWrapper';
import PersonalInfoSection from '../resume/sections/PersonalInfoSection';
import SkillsSection from '../resume/sections/SkillsSection';
import ProjectsSection from '../resume/sections/ProjectsSection';
import CertificationsSection from '../resume/sections/CertificationsSection';
import LanguagesSection from '../resume/sections/LanguagesSection';
import InterestsSection from '../resume/sections/InterestsSection';
import CustomSection from '../resume/sections/CustomSection';
import EducationSection from '../resume/sections/EducationSection';
import ExperienceSection from '../resume/sections/ExperienceSection';
import SummarySection from '../resume/sections/SummarySection';
// import SummarySection from '../resume/sections/SummarySection';
// import ExperienceSection from '../resume/sections/ExperienceSection';
// import EducationSection from '../resume/sections/EducationSection';
// import SkillsSection from '../resume/sections/SkillsSection';
// import ProjectsSection from '../resume/sections/ProjectsSection';
// import CertificationsSection from '../resume/sections/CertificationsSection';
// import LanguagesSection from '../resume/sections/LanguagesSection';
// import InterestsSection from '../resume/sections/InterestsSection';
// import CustomSection from '../resume/sections/CustomSection';

interface ModernTemplateProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
}

/**
 * Modern Template - Single Column Layout
 * Clean, professional design with emphasis on content hierarchy
 */
export default function ModernTemplate({ resume, sections, style }: ModernTemplateProps) {
  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Get spacing based on style config
  const spacing = {
    compact: 'space-y-4',
    normal: 'space-y-6',
    relaxed: 'space-y-8',
  }[style.spacing || 'normal'];

  return (
    <div
      className="modern-template w-full h-full overflow-hidden"
      style={{
        fontFamily: style.fontFamily,
        fontSize: `${style.fontSize}px`,
        lineHeight: style.lineHeight,
        color: style.textColor || '#000000',
        backgroundColor: style.backgroundColor || '#ffffff',
      }}
    >
      {/* Template Container */}
      <div className={`p-12 ${spacing}`}>
        {/* Render sections dynamically */}
        {sortedSections.map((section) => (
          <SectionWrapper
            key={section.id}
            sectionId={section.id}
            sectionType={section.type}
            isVisible={section.isVisible}
          >
            {renderSection(section, style)}
          </SectionWrapper>
        ))}

        {/* Empty State */}
        {sortedSections.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">No sections added yet</p>
            <p className="text-sm mt-2">Add sections from the sidebar to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Render appropriate section component based on type
 */
function renderSection(section: Section, style: StyleConfig) {
  const sectionProps = {
    section,
    style,
  };

  switch (section.type) {
    case SectionType.PERSONAL_INFO:
      return <PersonalInfoSection {...sectionProps} />;
    case SectionType.SUMMARY:
      return <SummarySection {...sectionProps} />;
    case SectionType.EXPERIENCE:
      return <ExperienceSection {...sectionProps} />;
    case SectionType.EDUCATION:
      return <EducationSection {...sectionProps} />;
    case SectionType.SKILLS:
      return <SkillsSection {...sectionProps} />;
    case SectionType.PROJECTS:
      return <ProjectsSection {...sectionProps} />;
    case SectionType.CERTIFICATIONS:
      return <CertificationsSection {...sectionProps} />;
    case SectionType.LANGUAGES:
      return <LanguagesSection {...sectionProps} />;
    case SectionType.INTERESTS:
      return <InterestsSection {...sectionProps} />;
    case SectionType.CUSTOM:
      return <CustomSection {...sectionProps} />;
    default:
      return (
        <div className="text-red-500 p-4 border border-red-300 rounded">
          Unknown section type: {section.type}
        </div>
      );
  }
}
