'use client';

import { Section, StyleConfig, InterestsData } from '@/types/schema';
import { Heart } from 'lucide-react';

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
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <Heart className="w-6 h-6" />
        Interests
      </h2>

      {/* Interest Entries */}
      <div className="flex flex-wrap gap-3">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <span
              key={entry.id}
              className="px-4 py-2 rounded-lg text-sm"
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
