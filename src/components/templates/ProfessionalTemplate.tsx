'use client';

import { Resume, Section, StyleConfig } from '@/types/schema';

interface ProfessionalTemplateProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
}

/**
 * Professional Template - Two Column Layout
 * Coming in Phase 4.2
 */
export default function ProfessionalTemplate({ resume, sections, style }: ProfessionalTemplateProps) {
  return (
    <div className="professional-template p-12">
      <h2 className="text-2xl font-bold text-gray-700">Professional Template</h2>
      <p className="text-gray-500 mt-2">Coming in Phase 4.2</p>
    </div>
  );
}
