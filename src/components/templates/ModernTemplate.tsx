'use client';

import { Resume, Section, StyleConfig } from '@/types/schema';
import { BaseTemplateUtils, TemplateProps } from './BaseTemplate';

/**
 * Modern Template - Single Column Layout
 * Clean, professional design with emphasis on content hierarchy
 * 
 * Layout: Single column, full width
 * Style: Minimalist, clean lines, emphasis on typography
 * Best For: Tech professionals, software engineers, designers
 */
export default function ModernTemplate({ resume, sections, style }: TemplateProps) {
  // Sort and filter visible sections
  const sortedSections = BaseTemplateUtils.sortSections(
    BaseTemplateUtils.getVisibleSections(sections)
  );

  // Personal info section (header)
  const personalInfoSection = sortedSections.find(
    (s) => s.type === 'PERSONAL_INFO'
  );

  // Other sections
  const contentSections = sortedSections.filter(
    (s) => s.type !== 'PERSONAL_INFO'
  );

  return (
    <div
      className="modern-template w-full h-full flex flex-col"
      style={{
        ...BaseTemplateUtils.getContainerStyles(style),
        minHeight: '1123px', // A4 height
      }}
    >
      {/* Template Container */}
      <div className="px-7 py-5 max-w-4xl mx-auto w-full flex-1">
        {/* Header Section - Personal Info */}
        {personalInfoSection && (
          <div className="header-section mb-">
            {BaseTemplateUtils.renderSection(personalInfoSection, style)}
          </div>
        )}

        {/* Main Content Sections */}
        <div className="main-content space-y-4">
          {contentSections.length > 0 ? (
            contentSections.map((section, index) => (
              <div key={section.id}>

                {BaseTemplateUtils.renderSection(section, style)}
              </div>
            ))
          ) : !personalInfoSection ? (
            BaseTemplateUtils.renderEmptyState()
          ) : (
            <div className="text-center text-gray-400 py-12">
              <p className="text-sm">Add more sections to complete your resume</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
