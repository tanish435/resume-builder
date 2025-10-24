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

  const primaryColor = style.primaryColor || '#2563eb';

  return (
    <div
      className="creative-template w-full h-full flex flex-col"
      style={{
        ...BaseTemplateUtils.getContainerStyles(style),
        backgroundColor: '#ffffff',
        minHeight: '1123px', // A4 height
      }}
    >
      <div className="flex flex-row flex-1 h-full">
        {/* Left Column - 35% with Bold Accent Background */}
        <div
          className="left-column"
          style={{
            width: '35%',
            maxWidth: '300px',
            padding: '40px 28px',
            backgroundColor: primaryColor,
            color: '#ffffff',
            backgroundImage: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%)`,
          }}
        >
          <div className="creative-sidebar text-white">
            {left.length > 0 ? (
              <div className="space-y-8">
                {left.map((section, index) => (
                  <div key={section.id}>
                    {index > 0 && (
                      <div className="my-6 border-t border-white/30"></div>
                    )}
                    {BaseTemplateUtils.renderSection(section, {
                      ...style,
                      textColor: '#ffffff',
                      primaryColor: '#ffffff',
                      backgroundColor: 'transparent',
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-white/90">
                <p className="font-semibold mb-3 text-white">Creative sidebar:</p>
                <ul className="list-none space-y-2 text-xs text-white/80">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Personal Info
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Skills
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    Languages
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 65% Main Content */}
        <div
          className="right-column flex-1"
          style={{
            padding: '40px',
            backgroundColor: '#ffffff',
          }}
        >
          {/* Decorative accent elements */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="accent-bar h-1.5 w-32 rounded-full"
              style={{
                backgroundColor: primaryColor,
              }}
            />
            <div
              className="h-1.5 w-20 rounded-full opacity-50"
              style={{
                backgroundColor: primaryColor,
              }}
            />
            <div
              className="h-1.5 w-12 rounded-full opacity-25"
              style={{
                backgroundColor: primaryColor,
              }}
            />
          </div>

          {right.length > 0 ? (
            <div className="space-y-8">
              {right.map((section, index) => (
                <div key={section.id} className="relative">
                  {index > 0 && (
                    <div className="my-8">
                      <div
                        className="h-0.5 w-full rounded"
                        style={{
                          background: `linear-gradient(to right, ${primaryColor}40, transparent)`,
                        }}
                      ></div>
                    </div>
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
