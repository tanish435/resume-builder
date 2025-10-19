'use client';

import { Resume, Section, StyleConfig } from '@/types/schema';

interface CompactTemplateProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
}

/**
 * Compact Template - Dense Layout
 * Coming in Phase 4.2
 */
export default function CompactTemplate({ resume, sections, style }: CompactTemplateProps) {
  return (
    <div className="compact-template p-12">
      <h2 className="text-2xl font-bold text-gray-700">Compact Template</h2>
      <p className="text-gray-500 mt-2">Coming in Phase 4.2</p>
    </div>
  );
}
