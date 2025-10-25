'use client';

import { Section, StyleConfig, CustomSectionData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { FileText } from 'lucide-react';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface CustomSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Custom Section Component
 * Displays user-defined custom content
 */
export default function CustomSection({ section, style }: CustomSectionProps) {
  const data = section.data as CustomSectionData;

  return (
    <div className="custom-section">
      {/* Section Title */}
      <h2
        className="font-bold mb-4 pb-2 border-b-2 flex items-center gap-2 uppercase tracking-wide"
        style={{ 
          color: style.primaryColor, 
          borderColor: style.primaryColor,
          fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
        }}
      >
        <FileText className="w-6 h-6" />
        <EditableContent
          sectionId={section.id}
          fieldPath="data.title"
          value={data.title || 'Custom Section'}
          placeholder="Section Title"
          as="span"
        />
      </h2>

      {/* Content */}
      <EditableContent
        sectionId={section.id}
        fieldPath="data.content"
        value={data.content || ''}
        placeholder="Enter custom section content..."
        multiline
        as="div"
        className="text-gray-700 leading-relaxed"
        style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
      />

      {/* Custom Entries (if structured data) */}
      {data.entries && data.entries.length > 0 && (
        <div 
          className="space-y-3 mt-4"
          style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
        >
          {data.entries.map((entry) => (
            <div key={entry.id} className="custom-entry p-3 bg-gray-50 rounded">
              {Object.entries(entry)
                .filter(([key]) => key !== 'id')
                .map(([key, value]) => (
                  <div key={key} className="mb-2">
                    <span className="font-medium text-gray-700">{key}: </span>
                    <span className="text-gray-600">{String(value)}</span>
                  </div>
                ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
