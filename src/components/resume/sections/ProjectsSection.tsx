'use client';

import { Section, StyleConfig, ProjectsData, ProjectEntry } from '@/types/schema';
import EditableContent from '../EditableContent';
import { FolderGit2, ExternalLink, Github, Calendar, Plus, Trash2 } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface ProjectsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Projects Section Component
 * Displays project entries with add/delete functionality
 */
export default function ProjectsSection({ section, style }: ProjectsSectionProps) {
  const dispatch = useAppDispatch();
  const data = section.data as ProjectsData;

  const handleAddEntry = () => {
    const newEntry: ProjectEntry = {
      id: `proj-${Date.now()}`,
      name: 'Project Name',
      description: 'Project description...',
      technologies: [],
      highlights: [],
      url: undefined,
      github: undefined,
      startDate: undefined,
      endDate: undefined,
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

  const handleAddTechnology = (entryId: string, techName: string) => {
    if (!techName.trim()) return;

    const updatedEntries = data.entries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          technologies: [...(entry.technologies || []), techName.trim()],
        };
      }
      return entry;
    });

    const updatedData = {
      ...data,
      entries: updatedEntries,
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleDeleteTechnology = (entryId: string, techIndex: number) => {
    const updatedEntries = data.entries.map((entry) => {
      if (entry.id === entryId) {
        return {
          ...entry,
          technologies: entry.technologies?.filter((_, idx) => idx !== techIndex) || [],
        };
      }
      return entry;
    });

    const updatedData = {
      ...data,
      entries: updatedEntries,
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
    <div className="projects-section">
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
          <FolderGit2 className="w-6 h-6" />
          Projects
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddEntry();
          }}
          className="no-print flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-blue-100 transition-colors"
          style={{ color: style.primaryColor }}
          title="Add Project"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Project Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry, index) => (
            <div key={entry.id} className="project-entry relative group">
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
                  {/* Project Name */}
                  <div className="flex items-center gap-2">
                    <EditableContent
                      sectionId={section.id}
                      fieldPath={`data.entries[${index}].name`}
                      value={entry.name}
                      placeholder="Project Name"
                      as="h3"
                      className="font-semibold"
                      style={getFontSizeStyle(style, 'jobPosition', DEFAULT_FONT_SIZES.jobPosition)}
                    />

                    {/* Links */}
                    <div className="flex items-center gap-2">
                      {entry.url && (
                        <a
                          href={entry.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                          title="View Project"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      {entry.github && (
                        <a
                          href={entry.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-700 hover:text-gray-900"
                          title="View GitHub"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                {(entry.startDate || entry.endDate) && (
                  <div 
                    className="text-gray-600 flex items-center gap-1"
                    style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>
                      {entry.startDate} {entry.endDate && `- ${entry.endDate}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <EditableContent
                sectionId={section.id}
                fieldPath={`data.entries[${index}].description`}
                value={entry.description}
                placeholder="Project description..."
                multiline
                as="p"
                className="text-gray-700 mb-2"
                style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
              />

              {/* Highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul 
                  className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-2"
                  style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
                >
                  {entry.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              {/* Technologies */}
              {entry.technologies && entry.technologies.length > 0 && (
                <div 
                  className="flex flex-wrap gap-2 mt-2"
                  style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
                >
                  {entry.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="group/tech px-2 py-1 text-xs rounded relative inline-flex items-center gap-1 cursor-pointer hover:opacity-75 transition-opacity"
                      style={{
                        backgroundColor: `${style.primaryColor}20`,
                        color: style.primaryColor,
                      }}
                    >
                      {tech}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTechnology(entry.id, idx);
                        }}
                        className="no-print ml-1 opacity-0 group-hover/tech:opacity-100 transition-opacity"
                        title="Remove technology"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Add Technology Input */}
              <div className="no-print mt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('techInput') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddTechnology(entry.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="techInput"
                    type="text"
                    placeholder="Add technology (e.g., React, Node.js)..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    style={{ color: style.primaryColor }}
                  >
                    <Plus className="w-4 h-4" />
                    Add Tech
                  </button>
                </form>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-400 italic mb-3">No projects added yet</p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddEntry();
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
              style={{ color: style.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add Your First Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
