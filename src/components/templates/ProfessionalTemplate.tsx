'use client';

import { SectionType } from '@/types/schema';
import { BaseTemplateUtils, TemplateProps, ColumnContainer } from './BaseTemplate';

/**
 * Professional Template - Two Column Layout
 * Classic professional design with sidebar for secondary information
 * 
 * Layout: Two columns (35% left sidebar, 65% main content)
 * Left Column: Skills, Languages, Certifications, Interests
 * Right Column: Personal Info, Summary, Experience, Education, Projects
 * Style: Traditional, corporate, ATS-friendly
 * Best For: Business professionals, managers, executives, traditional industries
 */
export default function ProfessionalTemplate({ resume, sections, style }: TemplateProps) {
  // Sort and filter visible sections
  const allSections = BaseTemplateUtils.sortSections(
    BaseTemplateUtils.getVisibleSections(sections)
  );

  // Define which sections go in which column
  const leftColumnTypes: SectionType[] = [
    SectionType.SKILLS,
    SectionType.LANGUAGES,
    SectionType.CERTIFICATIONS,
    SectionType.INTERESTS,
  ];

  const rightColumnTypes: SectionType[] = [
    SectionType.PERSONAL_INFO,
    SectionType.SUMMARY,
    SectionType.EXPERIENCE,
    SectionType.EDUCATION,
    SectionType.PROJECTS,
    SectionType.CUSTOM,
  ];

  // Group sections by column
  const { left, right } = BaseTemplateUtils.groupSectionsByColumn(
    allSections,
    leftColumnTypes,
    rightColumnTypes
  );

  return (
    <div
      className="professional-template w-full h-full flex flex-col"
      style={{
        ...BaseTemplateUtils.getContainerStyles(style),
        minHeight: '1123px', // A4 height
      }}
    >
      <div className="flex flex-row flex-1 h-full">
        {/* Left Sidebar - 35% */}
        <div
          className="left-sidebar"
          style={{
            width: '35%',
            maxWidth: '280px',
            padding: '40px 24px',
            backgroundColor: style.accentColor || '#f8fafc',
            borderRight: `1px solid ${style.borderColor || '#e2e8f0'}`,
          }}
        >
          {left.length > 0 ? (
            <div className="space-y-8">
              {left.map((section, index) => (
                <div key={section.id}>
                  {index > 0 && (
                    <div className="my-6 border-t border-gray-300"></div>
                  )}
                  {BaseTemplateUtils.renderSection(section, style)}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-3 text-gray-700">Sidebar sections:</p>
              <ul className="list-none space-y-2 text-xs text-gray-600">
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Skills
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Languages
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                  Certifications
                </li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Main Content - 65% */}
        <div
          className="main-content flex-1"
          style={{
            padding: '40px',
            backgroundColor: '#ffffff',
          }}
        >
          {right.length > 0 ? (
            <div className="space-y-8">
              {right.map((section, index) => (
                <div key={section.id}>
                  {index > 0 && index !== 1 && ( // Don't show divider between PersonalInfo and Summary
                    <div className="my-6 border-t border-gray-200"></div>
                  )}
                  {BaseTemplateUtils.renderSection(section, style)}
                </div>
              ))}
            </div>
          ) : (
            BaseTemplateUtils.renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
}
