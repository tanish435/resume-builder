'use client';

import { Resume, Section, StyleConfig, SectionType } from '@/types/schema';
import SectionWrapper from '../resume/SectionWrapper';
import PersonalInfoSection from '../resume/sections/PersonalInfoSection';
import SummarySection from '../resume/sections/SummarySection';
import ExperienceSection from '../resume/sections/ExperienceSection';
import EducationSection from '../resume/sections/EducationSection';
import SkillsSection from '../resume/sections/SkillsSection';
import ProjectsSection from '../resume/sections/ProjectsSection';
import CertificationsSection from '../resume/sections/CertificationsSection';
import LanguagesSection from '../resume/sections/LanguagesSection';
import InterestsSection from '../resume/sections/InterestsSection';
import CustomSection from '../resume/sections/CustomSection';

/**
 * Base Template Interface
 * All templates must implement this interface for consistency
 */
export interface TemplateProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
}

/**
 * Template Layout Configuration
 */
export interface TemplateLayout {
  type: 'single-column' | 'two-column' | 'three-column' | 'asymmetric';
  columns?: {
    left?: { width: string; sections: Section[] };
    center?: { width: string; sections: Section[] };
    right?: { width: string; sections: Section[] };
  };
  spacing: string;
  padding: string;
  headerStyle: 'centered' | 'left' | 'right' | 'split';
  sectionDividers: boolean;
}

/**
 * Base Template Component
 * Provides common functionality for all templates
 */
export class BaseTemplateUtils {
  /**
   * Render section based on type
   */
  static renderSection(section: Section, style: StyleConfig) {
    const sectionProps = { section, style };

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

  /**
   * Get spacing classes based on style config
   */
  static getSpacingClass(spacing?: 'compact' | 'normal' | 'relaxed'): string {
    return {
      compact: 'space-y-4',
      normal: 'space-y-6',
      relaxed: 'space-y-8',
    }[spacing || 'normal'];
  }

  /**
   * Get section divider style
   */
  static getSectionDivider(style: StyleConfig): string {
    if (!style.borderStyle || style.borderStyle === 'none') {
      return '';
    }

    const borderColor = style.borderColor || style.primaryColor || '#e5e7eb';
    return `border-b border-${style.borderStyle}`;
  }

  /**
   * Sort sections by order
   */
  static sortSections(sections: Section[]): Section[] {
    return [...sections].sort((a, b) => a.order - b.order);
  }

  /**
   * Filter visible sections
   */
  static getVisibleSections(sections: Section[]): Section[] {
    return sections.filter((s) => s.isVisible);
  }

  /**
   * Group sections for multi-column layouts
   */
  static groupSectionsByColumn(
    sections: Section[],
    leftSectionTypes: SectionType[],
    rightSectionTypes: SectionType[]
  ): { left: Section[]; right: Section[] } {
    const left: Section[] = [];
    const right: Section[] = [];

    sections.forEach((section) => {
      if (leftSectionTypes.includes(section.type)) {
        left.push(section);
      } else if (rightSectionTypes.includes(section.type)) {
        right.push(section);
      } else {
        // Default to right column if not specified
        right.push(section);
      }
    });

    return { left, right };
  }

  /**
   * Render wrapped section with common wrapper
   */
  static renderWrappedSection(section: Section, style: StyleConfig) {
    return (
      <SectionWrapper
        key={section.id}
        sectionId={section.id}
        sectionType={section.type}
        isVisible={section.isVisible}
      >
        {BaseTemplateUtils.renderSection(section, style)}
      </SectionWrapper>
    );
  }

  /**
   * Get container styles
   */
  static getContainerStyles(style: StyleConfig) {
    return {
      fontFamily: style.fontFamily,
      fontSize: `${style.fontSize}px`,
      lineHeight: style.lineHeight,
      color: style.textColor || '#000000',
      backgroundColor: style.backgroundColor || '#ffffff',
    };
  }

  /**
   * Empty state component
   */
  static renderEmptyState() {
    return (
      <div className="text-center py-20 text-gray-400">
        <p className="text-lg">No sections added yet</p>
        <p className="text-sm mt-2">Add sections from the sidebar to get started</p>
      </div>
    );
  }
}

/**
 * Section Header Component
 * Reusable styled header for sections
 */
export function SectionHeader({
  title,
  style,
  divider = true,
}: {
  title: string;
  style: StyleConfig;
  divider?: boolean;
}) {
  return (
    <div className={`section-header mb-4 ${divider ? 'pb-2 border-b-2' : ''}`}>
      <h2
        className="text-2xl font-bold uppercase tracking-wide"
        style={{
          color: style.primaryColor || '#1f2937',
          borderColor: style.primaryColor || '#1f2937',
        }}
      >
        {title}
      </h2>
    </div>
  );
}

/**
 * Column Container Component
 * Reusable container for template columns
 */
export function ColumnContainer({
  children,
  width,
  className = '',
  style = {},
}: {
  children: React.ReactNode;
  width?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`column-container ${className}`}
      style={{ width: width || 'auto', ...style }}
    >
      {children}
    </div>
  );
}
