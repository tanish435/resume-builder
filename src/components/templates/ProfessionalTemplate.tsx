'use client';

import { SectionType } from '@/types/schema';
import { BaseTemplateUtils, TemplateProps, ColumnContainer } from './BaseTemplate';

/**
 * Professional Template - Two Column Layout
 * Classic professional design with sidebar for secondary information
 * 
 * Layout: Two columns (30% left sidebar, 70% main content)
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

  // Get spacing
  const spacing = BaseTemplateUtils.getSpacingClass(style.spacing);

  return (
    <div
      className="professional-template w-full min-h-screen"
      style={BaseTemplateUtils.getContainerStyles(style)}
    >
      <div className="flex flex-row min-h-screen">
        {/* Left Sidebar - 30% */}
        <div
          className={`left-sidebar p-8 ${spacing}`}
          style={{
            width: '30%',
            minWidth: '280px',
            backgroundColor: style.accentColor || '#f3f4f6',
            borderRight: `2px solid ${style.borderColor || '#e5e7eb'}`,
          }}
        >
          {left.length > 0 ? (
            left.map((section) => BaseTemplateUtils.renderWrappedSection(section, style))
          ) : (
            <div className="text-sm text-gray-500">
              <p>Add sections like:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Skills</li>
                <li>Languages</li>
                <li>Certifications</li>
              </ul>
            </div>
          )}
        </div>

        {/* Right Main Content - 70% */}
        <div
          className={`main-content p-12 ${spacing}`}
          style={{
            width: '70%',
            flex: '1',
          }}
        >
          {right.length > 0 ? (
            right.map((section) => BaseTemplateUtils.renderWrappedSection(section, style))
          ) : (
            BaseTemplateUtils.renderEmptyState()
          )}
        </div>
      </div>
    </div>
  );
}
