'use client';

import { Section, StyleConfig, PersonalInfoData } from '@/types/schema';
import EditableContent from '../EditableContent';
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from 'lucide-react';

interface PersonalInfoSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Personal Info Section Component
 * Displays contact information and personal details
 */
export default function PersonalInfoSection({ section, style }: PersonalInfoSectionProps) {
  const data = section.data as PersonalInfoData;

  return (
    <div className="personal-info-section text-center">
      {/* Full Name */}
      <EditableContent
        sectionId={section.id}
        fieldPath="data.fullName"
        value={data.fullName || ''}
        placeholder="Your Full Name"
        as="h1"
        className="text-4xl font-bold mb-2"
        style={{ color: style.primaryColor }}
      />

      {/* Job Title */}
      {data.title && (
        <EditableContent
          sectionId={section.id}
          fieldPath="data.title"
          value={data.title}
          placeholder="Your Job Title"
          as="h2"
          className="text-xl text-gray-600 mb-4"
        />
      )}

      {/* Contact Information */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-700">
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
      <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-sm">
        {/* LinkedIn */}
        {data.linkedin && (
          <a
            href={data.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Linkedin className="w-4 h-4" />
            <span>LinkedIn</span>
          </a>
        )}

        {/* GitHub */}
        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-700 hover:underline"
          >
            <Github className="w-4 h-4" />
            <span>GitHub</span>
          </a>
        )}

        {/* Website/Portfolio */}
        {data.website && (
          <a
            href={data.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-gray-700 hover:underline"
          >
            <Globe className="w-4 h-4" />
            <span>Portfolio</span>
          </a>
        )}
      </div>
    </div>
  );
}
