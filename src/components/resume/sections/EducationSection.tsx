'use client';

import { Section, StyleConfig, EducationData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { GraduationCap, MapPin, Calendar } from 'lucide-react';

interface EducationSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Education Section Component
 * Displays education entries
 */
export default function EducationSection({ section, style }: EducationSectionProps) {
  const data = section.data as EducationData;

  return (
    <div className="education-section">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <GraduationCap className="w-6 h-6" />
        Education
      </h2>

      {/* Education Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <div key={entry.id} className="education-entry">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Degree */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${entry.id}].degree`}
                    value={entry.degree}
                    placeholder="Degree Title"
                    as="h3"
                    className="text-lg font-semibold"
                  />

                  {/* Institution */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${entry.id}].institution`}
                    value={entry.institution}
                    placeholder="Institution Name"
                    as="p"
                    className="text-gray-700 font-medium"
                  />

                  {/* Field of Study */}
                  {entry.field && (
                    <p className="text-gray-600 text-sm">Field: {entry.field}</p>
                  )}
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

              {/* GPA */}
              {entry.gpa && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">GPA:</span> {entry.gpa}
                </p>
              )}

              {/* Honors */}
              {entry.honors && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Honors:</span> {entry.honors}
                </p>
              )}

              {/* Description */}
              {entry.description && (
                <p className="text-gray-700 mt-2">{entry.description}</p>
              )}

              {/* Highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mt-2">
                  {entry.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No education entries added yet</p>
        )}
      </div>
    </div>
  );
}
