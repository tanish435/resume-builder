'use client';

import { Section, StyleConfig, EducationData, EducationEntry } from '@/types/schema';
import EditableContent from '../EditableContent';
import { GraduationCap, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface EducationSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Education Section Component
 * Displays education entries with add/delete functionality
 */
export default function EducationSection({ section, style }: EducationSectionProps) {
  const dispatch = useAppDispatch();
  const data = section.data as EducationData;

  const handleAddEntry = () => {
    const newEntry: EducationEntry = {
      id: `edu-${Date.now()}`,
      institution: 'University Name',
      degree: 'Degree Type',
      field: 'Major/Field of Study',
      location: 'City, Country',
      startDate: 'YYYY',
      endDate: undefined,
      gpa: undefined,
      honors: undefined,
      description: undefined,
      highlights: [],
    };

    const updatedData = {
      ...data,
      entries: [...(data.entries || []), newEntry],
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleDeleteEntry = (entryId: string) => {
    const updatedData = {
      ...data,
      entries: data.entries.filter((entry) => entry.id !== entryId),
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  return (
    <div className="education-section">
      {/* Section Title with Add Button */}
      <div className="flex justify-between items-center mb-4">
        <h2
          className="font-bold pb-2 border-b-2 flex items-center gap-2 flex-1 uppercase tracking-wide"
          style={{ 
            color: style.primaryColor, 
            borderColor: style.primaryColor,
            fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
          }}
        >
          <GraduationCap className="w-6 h-6" />
          Education
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddEntry();
          }}
          className="no-print flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-blue-100 transition-colors"
          style={{ color: style.primaryColor }}
          title="Add Education"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Education Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry, index) => (
            <div key={entry.id} className="education-entry relative group">
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteEntry(entry.id);
                }}
                className="no-print absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                title="Delete Entry"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Degree */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].degree`}
                    value={entry.degree}
                    placeholder="Degree Title"
                    as="h3"
                    className="font-semibold"
                    style={getFontSizeStyle(style, 'jobPosition', DEFAULT_FONT_SIZES.jobPosition)}
                  />

                  {/* Institution */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].institution`}
                    value={entry.institution}
                    placeholder="Institution Name"
                    as="p"
                    className="text-gray-700 font-medium"
                    style={getFontSizeStyle(style, 'company', DEFAULT_FONT_SIZES.company)}
                  />

                  {/* Field of Study */}
                  {entry.field && (
                    <div 
                      className="flex items-baseline gap-1 text-gray-600"
                      style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
                    >
                      <span>Field:</span>
                      <EditableContent
                        sectionId={section.id}
                        fieldPath={`data.entries[${index}].field`}
                        value={entry.field}
                        placeholder="Major/Field"
                        as="span"
                      />
                    </div>
                  )}
                </div>

                {/* Dates */}
                <div 
                  className="text-gray-600 flex items-center gap-1"
                  style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
                >
                  <Calendar className="w-4 h-4" />
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].startDate`}
                    value={entry.startDate}
                    placeholder="YYYY"
                    as="span"
                    className="inline-block"
                  />
                  <span> - </span>
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].endDate`}
                    value={entry.endDate || 'Present'}
                    placeholder="Present"
                    as="span"
                    className="inline-block"
                  />
                </div>
              </div>

              {/* Location */}
              {entry.location && (
                <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                  <MapPin className="w-4 h-4" />
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].location`}
                    value={entry.location}
                    placeholder="City, Country"
                    as="span"
                  />
                </div>
              )}

              {/* GPA */}
              {entry.gpa && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">GPA:</span>{' '}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].gpa`}
                    value={entry.gpa}
                    placeholder="4.0"
                    as="span"
                  />
                </p>
              )}

              {/* Honors */}
              {entry.honors && (
                <p className="text-sm text-gray-700">
                  <span className="font-medium">Honors:</span>{' '}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].honors`}
                    value={entry.honors}
                    placeholder="Dean's List, Cum Laude"
                    as="span"
                  />
                </p>
              )}

              {/* Description */}
              {entry.description && (
                <EditableContent
                  sectionId={section.id}
                  fieldPath={`data.entries[${index}].description`}
                  value={entry.description}
                  placeholder="Education description..."
                  multiline
                  as="p"
                  className="text-gray-700 mt-2"
                />
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
          <div className="text-center py-8">
            <p className="text-gray-400 italic mb-3">No education entries added yet</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddEntry();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              style={{ color: style.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add Your First Education
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
