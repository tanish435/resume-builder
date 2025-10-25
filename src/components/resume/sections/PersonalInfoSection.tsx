'use client';

import { Section, StyleConfig, PersonalInfoData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { Mail, Phone, MapPin, Linkedin, Github, Globe, X, Plus } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';
import { useState } from 'react';
import { getFontSizeStyle, DEFAULT_FONT_SIZES } from '@/lib/fontSizeUtils';

interface PersonalInfoSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Personal Info Section Component
 * Displays contact information and personal details
 */
export default function PersonalInfoSection({ section, style }: PersonalInfoSectionProps) {
  const dispatch = useAppDispatch();
  const data = section.data as PersonalInfoData;
  const [showAddLinks, setShowAddLinks] = useState(false);

  const handleRemoveLink = (field: 'linkedin' | 'github' | 'website') => {
    const updatedData = {
      ...data,
      [field]: undefined,
    };

    dispatch(updateSection({
      id: section.id,
      data: {
        ...section,
        data: updatedData,
      },
    }));
  };

  const handleAddLink = (field: 'linkedin' | 'github' | 'website', value: string) => {
    if (!value.trim()) return;

    const updatedData = {
      ...data,
      [field]: value.trim(),
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
    <div className="personal-info-section text-center">
      {/* Full Name */}
      <EditableContent
        sectionId={section.id}
        fieldPath="data.fullName"
        value={data.fullName || ''}
        placeholder="Your Full Name"
        as="h1"
        className="font-bold mb-2"
        style={{ 
          color: style.primaryColor,
          ...getFontSizeStyle(style, 'name', DEFAULT_FONT_SIZES.name)
        }}
      />

      {/* Job Title */}
      {data.title && (
        <EditableContent
          sectionId={section.id}
          fieldPath="data.title"
          value={data.title}
          placeholder="Your Job Title"
          as="h2"
          className="text-gray-600 mb-4"
          style={getFontSizeStyle(style, 'jobTitle', DEFAULT_FONT_SIZES.jobTitle)}
        />
      )}

      {/* Contact Information */}
      <div 
        className="flex flex-wrap items-center justify-center gap-4 text-gray-700"
        style={getFontSizeStyle(style, 'small', DEFAULT_FONT_SIZES.small)}
      >
        {/* Email */}
        {data.email && (
          <div className="flex items-center gap-1">
            <Mail className="w-4 h-4" />
            <EditableContent
              sectionId={section.id}
              fieldPath="data.email"
              value={data.email}
              placeholder="email@example.com"
              as="span"
            />
          </div>
        )}

        {/* Phone */}
        {data.phone && (
          <div className="flex items-center gap-1">
            <Phone className="w-4 h-4" />
            <EditableContent
              sectionId={section.id}
              fieldPath="data.phone"
              value={data.phone}
              placeholder="+1 234 567 8900"
              as="span"
            />
          </div>
        )}

        {/* Location */}
        {data.location && (
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <EditableContent
              sectionId={section.id}
              fieldPath="data.location"
              value={data.location}
              placeholder="City, Country"
              as="span"
            />
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="mt-3">
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
          {/* LinkedIn */}
          {data.linkedin && (
            <div className="group/link relative inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
              <Linkedin className="w-4 h-4 text-blue-600" />
              <EditableContent
                sectionId={section.id}
                fieldPath="data.linkedin"
                value={data.linkedin}
                placeholder="https://linkedin.com/in/username"
                as="span"
                className="text-blue-600"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLink('linkedin');
                }}
                className="no-print ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity"
                title="Remove LinkedIn"
              >
                <X className="w-3 h-3 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}

          {/* GitHub */}
          {data.github && (
            <div className="group/link relative inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Github className="w-4 h-4 text-gray-700" />
              <EditableContent
                sectionId={section.id}
                fieldPath="data.github"
                value={data.github}
                placeholder="https://github.com/username"
                as="span"
                className="text-gray-700"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLink('github');
                }}
                className="no-print ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity"
                title="Remove GitHub"
              >
                <X className="w-3 h-3 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}

          {/* Website/Portfolio */}
          {data.website && (
            <div className="group/link relative inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              <Globe className="w-4 h-4 text-gray-700" />
              <EditableContent
                sectionId={section.id}
                fieldPath="data.website"
                value={data.website}
                placeholder="https://yourportfolio.com"
                as="span"
                className="text-gray-700"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLink('website');
                }}
                className="no-print ml-1 opacity-0 group-hover/link:opacity-100 transition-opacity"
                title="Remove Portfolio"
              >
                <X className="w-3 h-3 text-red-500 hover:text-red-700" />
              </button>
            </div>
          )}
        </div>

        {/* Add Missing Links */}
        <div className="no-print mt-3">
          {(!data.linkedin || !data.github || !data.website) && (
            <button
              onClick={() => setShowAddLinks(!showAddLinks)}
              className="text-sm px-3 py-1 rounded hover:bg-gray-100 transition-colors flex items-center gap-1 mx-auto"
              style={{ color: style.primaryColor }}
            >
              <Plus className="w-4 h-4" />
              Add Links
            </button>
          )}

          {showAddLinks && (
            <div className="mt-3 space-y-2 max-w-md mx-auto">
              {!data.linkedin && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('linkedinInput') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddLink('linkedin', input.value);
                      input.value = '';
                      setShowAddLinks(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <Linkedin className="w-5 h-5 text-blue-600 mt-1.5" />
                  <input
                    name="linkedinInput"
                    type="url"
                    placeholder="LinkedIn URL (https://linkedin.com/in/...)"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                </form>
              )}

              {!data.github && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('githubInput') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddLink('github', input.value);
                      input.value = '';
                      setShowAddLinks(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <Github className="w-5 h-5 text-gray-700 mt-1.5" />
                  <input
                    name="githubInput"
                    type="url"
                    placeholder="GitHub URL (https://github.com/...)"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </form>
              )}

              {!data.website && (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const input = e.currentTarget.elements.namedItem('websiteInput') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleAddLink('website', input.value);
                      input.value = '';
                      setShowAddLinks(false);
                    }
                  }}
                  className="flex gap-2"
                >
                  <Globe className="w-5 h-5 text-gray-700 mt-1.5" />
                  <input
                    name="websiteInput"
                    type="url"
                    placeholder="Portfolio URL (https://yoursite.com)"
                    className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-gray-700 text-white rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
