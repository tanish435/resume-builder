'use client';

import { Section, StyleConfig, ExperienceData, ExperienceEntry } from '@/types/schema';
import EditableContent from '../EditableContent';
import { Briefcase, MapPin, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface ExperienceSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Experience Section Component
 * Displays work experience entries with add/delete functionality
 */
export default function ExperienceSection({ section, style }: ExperienceSectionProps) {
  const dispatch = useAppDispatch();
  const data = section.data as ExperienceData;

  const handleAddEntry = () => {
    const newEntry: ExperienceEntry = {
      id: `exp-${Date.now()}`,
      company: 'Company Name',
      position: 'Position Title',
      location: 'City, Country',
      startDate: 'MM/YYYY',
      endDate: null,
      description: '',
      highlights: [],
      technologies: [],
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
    <div className="experience-section">
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
          <Briefcase className="w-6 h-6" />
          Work Experience
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddEntry();
          }}
          className="no-print flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-blue-100 transition-colors"
          style={{ color: style.primaryColor }}
          title="Add Experience"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Experience Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry, index) => (
            <div key={entry.id} className="experience-entry relative group">
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
                  {/* Position */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].position`}
                    value={entry.position}
                    placeholder="Position Title"
                    as="h3"
                    className="font-semibold"
                    style={getFontSizeStyle(style, 'jobPosition', DEFAULT_FONT_SIZES.jobPosition)}
                  />

                  {/* Company */}
                  <EditableContent
                    sectionId={section.id}
                    fieldPath={`data.entries[${index}].company`}
                    value={entry.company}
                    placeholder="Company Name"
                    as="p"
                    className="text-gray-700 font-medium"
                    style={getFontSizeStyle(style, 'company', DEFAULT_FONT_SIZES.company)}
                  />
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
                    placeholder="MM/YYYY"
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
                <div 
                  className="flex items-center gap-1 text-gray-600 mb-2"
                  style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
                >
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

              {/* Description */}
              {entry.description && (
                <EditableContent
                  sectionId={section.id}
                  fieldPath={`data.entries[${index}].description`}
                  value={entry.description}
                  placeholder="Job description..."
                  multiline
                  as="p"
                  className="text-gray-700 mb-2"
                  style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
                />
              )}

              {/* Highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul 
                  className="list-disc list-inside space-y-1 text-gray-700 ml-2"
                  style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
                >
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
          <div className="text-center py-8">
            <p className="text-gray-400 italic mb-3">No experience entries added yet</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddEntry();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              style={{ color: style.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add Your First Experience
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
