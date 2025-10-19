'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addSection, deleteSection, reorderSections, toggleSectionVisibility } from '@/store/slices/resumeSlice';
import { SectionType, Section } from '@/types/schema';
import { GripVertical, Plus, Eye, EyeOff, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * Section Manager Component
 * Add, remove, reorder, and toggle visibility of resume sections
 */
export default function SectionManager() {
  const dispatch = useAppDispatch();
  const { sections, currentResume } = useAppSelector((state) => state.resume);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Available section types to add
  const availableSectionTypes = [
    { type: SectionType.EXPERIENCE, label: 'Work Experience', icon: '💼' },
    { type: SectionType.EDUCATION, label: 'Education', icon: '🎓' },
    { type: SectionType.SKILLS, label: 'Skills', icon: '🔧' },
    { type: SectionType.PROJECTS, label: 'Projects', icon: '📁' },
    { type: SectionType.CERTIFICATIONS, label: 'Certifications', icon: '🏆' },
    { type: SectionType.LANGUAGES, label: 'Languages', icon: '🌐' },
    { type: SectionType.INTERESTS, label: 'Interests', icon: '❤️' },
    { type: SectionType.CUSTOM, label: 'Custom Section', icon: '📝' },
  ];

  const handleAddSection = (type: SectionType) => {
    if (!currentResume) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      resumeId: currentResume.id,
      type,
      data: getDefaultDataForType(type),
      order: sections.length,
      isVisible: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    dispatch(addSection(newSection));
    setShowAddMenu(false);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (confirm('Are you sure you want to remove this section?')) {
      dispatch(deleteSection(sectionId));
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    dispatch(toggleSectionVisibility(sectionId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    dispatch(reorderSections({ fromIndex: index, toIndex: index - 1 }));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedSections.length - 1) return;
    dispatch(reorderSections({ fromIndex: index, toIndex: index + 1 }));
  };

  return (
    <div className="section-manager space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Sections</h3>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* Add Section Menu */}
      {showAddMenu && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-xs text-gray-600 font-medium mb-2">Choose a section type:</p>
          <div className="grid grid-cols-1 gap-2">
            {availableSectionTypes.map((sectionType) => (
              <button
                key={sectionType.type}
                onClick={() => handleAddSection(sectionType.type)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-xl">{sectionType.icon}</span>
                <span className="text-sm text-gray-700">{sectionType.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section List */}
      <div className="space-y-2">
        {sortedSections.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-sm">No sections yet</p>
            <p className="text-xs mt-1">Click "Add Section" to get started</p>
          </div>
        ) : (
          sortedSections.map((section, index) => (
            <div
              key={section.id}
              className={`group flex items-center gap-2 p-3 bg-white border rounded-lg transition-all ${
                section.isVisible
                  ? 'border-gray-200 hover:border-blue-300'
                  : 'border-gray-100 bg-gray-50 opacity-60'
              }`}
            >
              {/* Drag Handle */}
              <button className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600">
                <GripVertical className="w-4 h-4" />
              </button>

              {/* Section Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {formatSectionType(section.type)}
                </p>
                <p className="text-xs text-gray-500">Order: {index + 1}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Move Up */}
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move up"
                >
                  <ChevronUp className="w-4 h-4 text-gray-600" />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === sortedSections.length - 1}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Move down"
                >
                  <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {/* Toggle Visibility */}
                <button
                  onClick={() => handleToggleVisibility(section.id)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title={section.isVisible ? 'Hide section' : 'Show section'}
                >
                  {section.isVisible ? (
                    <Eye className="w-4 h-4 text-gray-600" />
                  ) : (
                    <EyeOff className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Delete */}
                {section.type !== SectionType.PERSONAL_INFO && (
                  <button
                    onClick={() => handleRemoveSection(section.id)}
                    className="p-1 hover:bg-red-100 rounded"
                    title="Remove section"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Use the eye icon to hide sections without deleting them. Personal
          Info section cannot be removed.
        </p>
      </div>
    </div>
  );
}

/**
 * Get default data structure for a section type
 */
function getDefaultDataForType(type: SectionType): any {
  switch (type) {
    case SectionType.EXPERIENCE:
      return { entries: [] };
    case SectionType.EDUCATION:
      return { entries: [] };
    case SectionType.SKILLS:
      return { categories: [], skills: [] };
    case SectionType.PROJECTS:
      return { entries: [] };
    case SectionType.CERTIFICATIONS:
      return { entries: [] };
    case SectionType.LANGUAGES:
      return { entries: [] };
    case SectionType.INTERESTS:
      return { items: [] };
    case SectionType.SUMMARY:
      return { content: '' };
    case SectionType.CUSTOM:
      return { title: 'Custom Section', content: '' };
    default:
      return {};
  }
}

/**
 * Format section type for display
 */
function formatSectionType(type: SectionType): string {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
