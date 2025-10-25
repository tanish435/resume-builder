'use client';

import { Section, StyleConfig, LanguagesData } from '@/types/schema';
import { Languages } from 'lucide-react';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface LanguagesSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Languages Section Component
 * Displays language proficiencies
 */
export default function LanguagesSection({ section, style }: LanguagesSectionProps) {
  const data = section.data as LanguagesData;

  // Proficiency level colors
  const getProficiencyColor = (proficiency: string) => {
    const colors = {
      Native: 'bg-green-500',
      Fluent: 'bg-blue-500',
      Professional: 'bg-indigo-500',
      Intermediate: 'bg-yellow-500',
      Basic: 'bg-gray-400',
    };
    return colors[proficiency as keyof typeof colors] || 'bg-gray-400';
  };

  return (
    <div className="languages-section">
      {/* Section Title */}
      <h2
        className="font-bold mb-4 pb-2 border-b-2 flex items-center gap-2 uppercase tracking-wide"
        style={{ 
          color: style.primaryColor, 
          borderColor: style.primaryColor,
          fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
        }}
      >
        <Languages className="w-6 h-6" />
        Languages
      </h2>

      {/* Language Entries */}
      <div className="space-y-3">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <div 
              key={entry.id} 
              className="language-entry flex items-center justify-between"
              style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
            >
              {/* Language Name */}
              <span className="font-medium text-gray-800">{entry.language}</span>

              {/* Proficiency Badge */}
              <span
                className={`
                  px-3 py-1 rounded-full text-white
                  ${getProficiencyColor(entry.proficiency)}
                `}
                style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
              >
                {entry.proficiency}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No languages added yet</p>
        )}
      </div>
    </div>
  );
}
