'use client';

import { SectionType } from '@/types/schema';
import { BaseTemplateUtils, TemplateProps, ColumnContainer } from './BaseTemplate';

/**
 * Creative Template - Asymmetric Layout
 * Bold, modern design with asymmetric columns and accent colors
 * 
 * Layout: Asymmetric two columns (35% left, 65% right)
 * Left Column: Personal Info, Skills, Certifications, Languages, Interests
 * Right Column: Summary, Experience, Education, Projects
 * Style: Modern, bold colors, creative typography, visual hierarchy
 * Best For: Designers, creatives, marketers, startup professionals
 */
export default function CreativeTemplate({ resume, sections, style }: TemplateProps) {
  // Sort and filter visible sections
  const allSections = BaseTemplateUtils.sortSections(
    BaseTemplateUtils.getVisibleSections(sections)
  );

  // Define which sections go in which column
  const leftColumnTypes: SectionType[] = [
    SectionType.PERSONAL_INFO,
    SectionType.SKILLS,
    SectionType.CERTIFICATIONS,
    SectionType.LANGUAGES,
    SectionType.INTERESTS,
  ];

  const rightColumnTypes: SectionType[] = [
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
      className="creative-template w-full min-h-screen"
      style={{
        ...BaseTemplateUtils.getContainerStyles(style),
        backgroundColor: '#ffffff',
      }}
    >
      <div className="flex flex-row min-h-screen">
        {/* Left Column - 35% with Accent Background */}
        <div
          className={`left-column p-10 ${spacing}`}
          style={{
            width: '35%',
            minWidth: '320px',
            backgroundColor: style.primaryColor || '#2563eb',
            color: '#ffffff',
          }}
        >
          <div className="creative-sidebar text-white">
            {left.length > 0 ? (
              left.map((section) => (
                <div
                  key={section.id}
                  className="section-wrapper mb-6"
                >
                  {BaseTemplateUtils.renderWrappedSection(section, {
                    ...style,
                    textColor: '#ffffff',
                    primaryColor: '#ffffff',
                    backgroundColor: 'transparent',
                  })}
                </div>
              ))
            ) : (
              <div className="text-sm text-white/80">
                <p>Add sections like:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Personal Info</li>
                  <li>Skills</li>
                  <li>Languages</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 65% Main Content */}
        <div
          className={`right-column p-12 ${spacing}`}
          style={{
            width: '65%',
            flex: '1',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Decorative accent bar */}
          <div
            className="accent-bar h-2 mb-8 w-24 rounded-full"
            style={{
              backgroundColor: style.primaryColor || '#2563eb',
            }}
          />

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
