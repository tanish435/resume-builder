'use client';

import { Section, StyleConfig, SkillsData } from '@/types/schema';
import { Wrench } from 'lucide-react';

interface SkillsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Skills Section Component
 * Displays skills organized by categories
 */
export default function SkillsSection({ section, style }: SkillsSectionProps) {
  const data = section.data as SkillsData;

  return (
    <div className="skills-section">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <Wrench className="w-6 h-6" />
        Skills
      </h2>

      {/* Skills by Category */}
      {data.categories && data.categories.length > 0 ? (
        <div className="space-y-4">
          {data.categories.map((category) => (
            <div key={category.id} className="skill-category">
              {/* Category Name */}
              <h3 className="font-semibold text-gray-800 mb-2">{category.name}</h3>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-full text-sm"
                    style={{
                      backgroundColor: `${style.primaryColor}15`,
                      color: style.textColor || '#000000',
                      border: `1px solid ${style.primaryColor}40`,
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : data.skills && data.skills.length > 0 ? (
        /* Flat Skills List (Alternative Structure) */
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill, idx) => (
            <span
              key={idx}
              className="px-3 py-1 rounded-full text-sm"
              style={{
                backgroundColor: `${style.primaryColor}15`,
                color: style.textColor || '#000000',
                border: `1px solid ${style.primaryColor}40`,
              }}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No skills added yet</p>
      )}
    </div>
  );
}
