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

  // Get spacing based on style config
  const spacing = BaseTemplateUtils.getSpacingClass(style.spacing);

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
      className="modern-template w-full min-h-screen"
      style={BaseTemplateUtils.getContainerStyles(style)}
    >
      {/* Template Container */}
      <div className={`px-12 py-16 max-w-4xl mx-auto ${spacing}`}>
        {/* Header Section - Personal Info */}
        {personalInfoSection && (
          <div className="header-section mb-10">
            {BaseTemplateUtils.renderWrappedSection(personalInfoSection, style)}
          </div>
        )}

        {/* Main Content Sections */}
        <div className={`main-content ${spacing}`}>
          {contentSections.length > 0 ? (
            BaseTemplateUtils.renderSectionsWithDividers(contentSections, style)
          ) : !personalInfoSection ? (
            BaseTemplateUtils.renderEmptyState()
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">Add more sections to complete your resume</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
