'use client';

import { Resume, Section, StyleConfig } from '@/types/schema';

interface MinimalTemplateProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
}

/**
 * Minimal Template - Clean & Simple Layout
 * Coming in Phase 4.2
 */
export default function MinimalTemplate({ resume, sections, style }: MinimalTemplateProps) {
  return (
    <div className="minimal-template p-12">
      <h2 className="text-2xl font-bold text-gray-700">Minimal Template</h2>
      <p className="text-gray-500 mt-2">Coming in Phase 4.2</p>
    </div>
  );
}
