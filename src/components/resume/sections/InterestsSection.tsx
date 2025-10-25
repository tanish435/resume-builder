'use client';

import { Section, StyleConfig, InterestsData } from '@/types/schema';
import { Heart } from 'lucide-react';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface InterestsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Interests Section Component
 * Displays personal interests and hobbies
 */
export default function InterestsSection({ section, style }: InterestsSectionProps) {
  const data = section.data as InterestsData;

  return (
    <div className="interests-section">
      {/* Section Title */}
      <h2
        className="font-bold mb-4 pb-2 border-b-2 flex items-center gap-2 uppercase tracking-wide"
        style={{ 
          color: style.primaryColor, 
          borderColor: style.primaryColor,
          fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
        }}
      >
        <Heart className="w-6 h-6" />
        Interests
      </h2>

      {/* Interest Entries */}
      <div 
        className="flex flex-wrap gap-3"
        style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
      >
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <span
              key={entry.id}
              className="px-4 py-2 rounded-lg"
              style={{
                backgroundColor: `${style.primaryColor}10`,
                color: style.textColor || '#000000',
                border: `1px solid ${style.primaryColor}30`,
              }}
            >
              {entry.interest}
            </span>
          ))
        ) : (
          <p className="text-gray-400 italic">No interests added yet</p>
        )}
      </div>
    </div>
  );
}
