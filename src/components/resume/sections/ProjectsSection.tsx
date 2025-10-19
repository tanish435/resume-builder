'use client';

import { Section, StyleConfig, ProjectsData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { FolderGit2, ExternalLink, Github, Calendar } from 'lucide-react';

interface ProjectsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Projects Section Component
 * Displays project entries
 */
export default function ProjectsSection({ section, style }: ProjectsSectionProps) {
  const data = section.data as ProjectsData;

  return (
    <div className="projects-section">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <FolderGit2 className="w-6 h-6" />
        Projects
      </h2>

      {/* Project Entries */}
      <div className="space-y-5">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <div key={entry.id} className="project-entry">
              {/* Header Row */}
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  {/* Project Name */}
                  <div className="flex items-center gap-2">
                    <EditableContent
                      sectionId={section.id}
                      fieldPath={`data.entries[${entry.id}].name`}
                      value={entry.name}
                      placeholder="Project Name"
                      as="h3"
                      className="text-lg font-semibold"
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
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {entry.startDate} {entry.endDate && `- ${entry.endDate}`}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 mb-2">{entry.description}</p>

              {/* Highlights */}
              {entry.highlights && entry.highlights.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-2 mb-2">
                  {entry.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}

              {/* Technologies */}
              {entry.technologies && entry.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
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
          <p className="text-gray-400 italic">No projects added yet</p>
        )}
      </div>
    </div>
  );
}
