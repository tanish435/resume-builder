'use client';

import { Section, StyleConfig, ExperienceData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { Briefcase, MapPin, Calendar } from 'lucide-react';

interface ExperienceSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Experience Section Component
 * Displays work experience entries
 */
export default function ExperienceSection({ section, style }: ExperienceSectionProps) {
  const data = section.data as ExperienceData;

  return (
    <div className="experience-section">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <Briefcase className="w-6 h-6" />
        Work Experience
      </h2>

      {/* Experience Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <div key={entry.id} className="experience-entry">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Position */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${entry.id}].position`}
                    value={entry.position}
                    placeholder="Position Title"
                    as="h3"
                    className="text-lg font-semibold"
                  />

                  {/* Company */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${entry.id}].company`}
                    value={entry.company}
                    placeholder="Company Name"
                    as="p"
                    className="text-gray-700 font-medium"
                  />
                </div>

                {/* Dates */}
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {entry.startDate} - {entry.endDate || 'Present'}
                  </span>
                </div>
              </div>

              {/* Location */}
              {entry.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>{entry.location}</span>
                </div>
              )}

              {/* Description */}
              {entry.description && (
                <p className="text-gray-700 mb-2">{entry.description}</p>
              )}

              {/* Highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2">
                  {entry.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              {/* Technologies */}
              {entry.technologies && entry.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {entry.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 text-xs rounded"
                      style={{
                        backgroundColor: `${style.primaryColor}20`,
                        color: style.primaryColor,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No experience entries added yet</p>
        )}
      </div>
    </div>
  );
}
