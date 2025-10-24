'use client';

import { SectionType } from '@/types/schema';
import { BaseTemplateUtils, TemplateProps } from './BaseTemplate';

/**
 * Minimal Template - Clean Lines
 * Ultra-minimalist design focusing on content with maximum white space
 * 
 * Layout: Single column with generous spacing
 * Style: Clean lines, subtle dividers, minimal colors, maximum readability
 * Typography: Focus on hierarchy and white space
 * Best For: Academics, researchers, minimalists, senior professionals
 */
export default function MinimalTemplate({ resume, sections, style }: TemplateProps) {
  // Sort and filter visible sections
  const sortedSections = BaseTemplateUtils.sortSections(
    BaseTemplateUtils.getVisibleSections(sections)
  );

  // Get spacing - Minimal template uses extra space
  const baseSpacing = style.spacing || 'relaxed';
  const spacing = BaseTemplateUtils.getSpacingClass(baseSpacing);

  // Personal info section (header)
  const personalInfoSection = sortedSections.find(
    (s) => s.type === SectionType.PERSONAL_INFO
  );

  // Other sections
  const contentSections = sortedSections.filter(
    (s) => s.type !== SectionType.PERSONAL_INFO
  );

  return (
    <div
      className="minimal-template w-full h-full flex flex-col"
      style={{
        ...BaseTemplateUtils.getContainerStyles(style),
        minHeight: '1123px', // A4 height
      }}
    >
      <div className="max-w-3xl mx-auto px-16 py-12 w-full flex-1">
        {/* Header - Personal Info with Subtle Styling */}
        {personalInfoSection && (
          <div className="header-section mb-10 text-center">
            {BaseTemplateUtils.renderSection(personalInfoSection, style)}
          </div>
        )}

        {/* Subtle Divider */}
        {personalInfoSection && (
          <div
            className="divider mb-12 mx-auto rounded-full"
            style={{
              height: '2px',
              width: '80px',
              backgroundColor: style.primaryColor || '#d1d5db',
            }}
          />
        )}

        {/* Main Content with Balanced Spacing */}
        <div className="main-content space-y-10">
          {contentSections.length > 0 ? (
            contentSections.map((section, index) => (
              <div key={section.id} className="section-block">
                {BaseTemplateUtils.renderSection(section, style)}

                {/* Subtle section divider (except last section) */}
                {index < contentSections.length - 1 && (
                  <div
                    className="section-divider my-8 mx-auto rounded-full"
                    style={{
                      height: '1px',
                      width: '60px',
                      backgroundColor: style.borderColor || '#e5e7eb',
                      opacity: 0.5,
                    }}
                  />
                )}
              </div>
            ))
          ) : !personalInfoSection ? (
            BaseTemplateUtils.renderEmptyState()
          ) : (
            <div className="text-center text-gray-400 py-8">
              <p className="text-sm">Add more sections to complete your resume</p>
            </div>
          )}
        </div>

        {/* Footer Space */}
        <div className="footer-space h-8" />
      </div>
    </div>
  );
}
