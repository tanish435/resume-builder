'use client';

import { Section, StyleConfig, SummaryData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface SummarySectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Summary Section Component
 * Displays professional summary or objective
 */
export default function SummarySection({ section, style }: SummarySectionProps) {
  const data = section.data as SummaryData;

  return (
    <div className="summary-section">
      {/* Section Title */}
      <h2
        className="font-bold mb-3 pb-2 border-b-2 uppercase tracking-wide"
        style={{ 
          color: style.primaryColor, 
          borderColor: style.primaryColor,
          fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
        }}
      >
        Professional Summary
      </h2>

      {/* Summary Content */}
      <EditableContent
        sectionId={section.id}
        fieldPath="data.content"
        value={data.content || ''}
        placeholder="Write a brief professional summary highlighting your key achievements and career objectives..."
        multiline
        as="p"
        className="text-gray-700 leading-relaxed"
        style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
      />
    </div>
  );
}
