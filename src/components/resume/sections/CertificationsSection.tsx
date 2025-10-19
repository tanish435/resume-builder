'use client';

import { Section, StyleConfig, CertificationsData } from '@/types/schema';
import { Award, ExternalLink, Calendar } from 'lucide-react';

interface CertificationsSectionProps {
  section: Section;
  style: StyleConfig;
}

/**
 * Certifications Section Component
 * Displays certification entries
 */
export default function CertificationsSection({ section, style }: CertificationsSectionProps) {
  const data = section.data as CertificationsData;

  return (
    <div className="certifications-section">
      {/* Section Title */}
      <h2
        className="text-2xl font-bold mb-4 pb-2 border-b-2 flex items-center gap-2"
        style={{ color: style.primaryColor, borderColor: style.primaryColor }}
      >
        <Award className="w-6 h-6" />
        Certifications
      </h2>

      {/* Certification Entries */}
      <div className="space-y-4">
        {data.entries && data.entries.length > 0 ? (
          data.entries.map((entry) => (
            <div key={entry.id} className="certification-entry">
              {/* Header Row */}
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {/* Certification Name */}
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold">{entry.name}</h3>
                    {entry.url && (
                      <a
                        href={entry.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                        title="View Certification"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  {/* Issuer */}
                  <p className="text-gray-700 font-medium">{entry.issuer}</p>

                  {/* Credential ID */}
                  {entry.credentialId && (
                    <p className="text-sm text-gray-600">
                      Credential ID: {entry.credentialId}
                    </p>
                  )}
                </div>

                {/* Date */}
                {entry.date && (
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{entry.date}</span>
                  </div>
                )}
              </div>

              {/* Expiry Date */}
              {entry.expiryDate && (
                <p className="text-sm text-gray-600 mt-1">
                  Expires: {entry.expiryDate}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 italic">No certifications added yet</p>
        )}
      </div>
    </div>
  );
}
