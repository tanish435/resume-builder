'use client';

import { Section, StyleConfig, SkillsData, SkillCategory } from '@/types/schema';
import { Wrench, Plus, Trash2 } from 'lucide-react';
import EditableContent from '../EditableContent';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface SkillsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Skills Section Component
 * Displays skills organized by categories with add/delete functionality
 */
export default function SkillsSection({ section, style }: SkillsSectionProps) {
  const dispatch = useAppDispatch();
  const data = section.data as SkillsData;

  const handleAddCategory = () => {
    const newCategory: SkillCategory = {
      id: `cat-${Date.now()}`,
      name: 'New Category',
      skills: [],
    };

    const updatedData = {
      ...data,
      categories: [...(data.categories || []), newCategory],
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedData = {
      ...data,
      categories: data.categories?.filter((cat) => cat.id !== categoryId),
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleAddSkill = (categoryId: string, skillName: string) => {
    if (!skillName.trim()) return;

    const updatedCategories = data.categories?.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: [...cat.skills, skillName.trim()],
        };
      }
      return cat;
    });

    const updatedData = {
      ...data,
      categories: updatedCategories,
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleDeleteSkill = (categoryId: string, skillIndex: number) => {
    const updatedCategories = data.categories?.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          skills: cat.skills.filter((_, idx) => idx !== skillIndex),
        };
      }
      return cat;
    });

    const updatedData = {
      ...data,
      categories: updatedCategories,
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
    <div className="skills-section">
      {/* Section Title with Add Button */}
      <div className="flex justify-between items-center mb-">
        <h2
          className="font-bold pb-2 border-b-2 flex items-center gap-2 flex-1 uppercase tracking-wide"
          style={{ 
            color: style.primaryColor, 
            borderColor: style.primaryColor,
            fontSize: `${style.fontSizes?.sectionTitle ?? 18}px`
          }}
        >
          <Wrench className="w-6 h-6" />
          Skills
        </h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleAddCategory();
          }}
          className="no-print flex items-center gap-1 px-3 py-1 text-sm rounded hover:bg-blue-100 transition-colors"
          style={{ color: style.primaryColor }}
          title="Add Category"
        >
          <Plus className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* Skills by Category */}
      {data.categories && data.categories.length > 0 ? (
        <div className="space-y-4">
          {data.categories.map((category, index) => (
            <div key={category.id} className="skill-category relative group">
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category.id);
                }}
                className="no-print absolute -right-2 -top-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                title="Delete Category"
              >
                <Trash2 className="w-3 h-3" />
              </button>

              {/* Category Name */}
              <div className="flex items-center justify-center gap-1">
                <EditableContent
                  sectionId={section.id}
                  fieldPath={`data.categories[${index}].name`}
                  value={category.name}
                  placeholder="Category Name"
                  as="span"
                  className="font-semibold text-gray-800"
                  style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
                />
                <span className="font-semibold text-gray-800">:</span>
                
                {/* Skills as comma-separated text */}
                <div 
                  className="flex-1"
                  style={getFontSizeStyle(style, 'body', DEFAULT_FONT_SIZES.body)}
                >
                  {category.skills.map((skill, idx) => (
                    <span key={idx} className="group/skill inline">
                      <span className="text-gray-700">{skill}</span>
                      {idx < category.skills.length - 1 && <span className="text-gray-700">, </span>}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSkill(category.id, idx);
                        }}
                        className="no-print ml-1 opacity-0 group-hover/skill:opacity-100 transition-opacity"
                        title="Remove skill"
                      >
                        <Trash2 className="w-3 h-3 text-red-500 inline" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Add Skill Input */}
              <div className="no-print mt-2">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('skillInput') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddSkill(category.id, input.value);
                      input.value = '';
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="skillInput"
                    type="text"
                    placeholder="Add skill (e.g., React, Python)..."
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm rounded flex items-center gap-1 hover:bg-blue-100 transition-colors"
                    style={{ color: style.primaryColor }}
                  >
                    <Plus className="w-4 h-4" />
                    Add
                  </button>
                </form>
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
        <div className="text-center py-8">
          <p className="text-gray-400 italic mb-3">No skills added yet</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAddCategory();
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors"
            style={{ color: style.primaryColor }}
          >
            <Plus className="w-4 h-4" />
            Add Your First Skill Category
          </button>
        </div>
      )}
    </div>
  );
}
