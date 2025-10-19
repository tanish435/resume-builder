'use client';

import { Section, StyleConfig, SummaryData } from '@/types/schema';
import EditableContent from '../EditableContent';

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
        className="text-2xl font-bold mb-3 pb-2 border-b-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
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
      />
    </div>
  );
}
