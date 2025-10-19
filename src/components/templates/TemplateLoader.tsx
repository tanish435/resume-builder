'use client';

import { Suspense, lazy } from 'react';
import type { Resume, Section, StyleConfig } from '@/types/schema';

interface TemplateLoaderProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
  templateId: string;
}

/**
 * Template Loader Component
 * Dynamically loads and renders the active template
 */
export default function TemplateLoader({
  resume,
  sections,
  style,
  templateId,
}: TemplateLoaderProps) {
  // Dynamic template loading based on templateId
  const TemplateComponent = getTemplateComponent(templateId);

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
            <p className="text-gray-500 mt-4">Loading template...</p>
          </div>
        </div>
      }
    >
      <TemplateComponent resume={resume} sections={sections} style={style} />
    </Suspense>
  );
}

/**
 * Get the appropriate template component based on ID
 */
function getTemplateComponent(templateId: string) {
  // Map template IDs to components
  const templateMap: Record<string, any> = {
    modern: lazy(() => import('./ModernTemplate')),
    professional: lazy(() => import('./ProfessionalTemplate')),
    creative: lazy(() => import('./CreativeTemplate')),
    minimal: lazy(() => import('./MinimalTemplate')),
    compact: lazy(() => import('./CompactTemplate')),
  };

  // Return requested template or default to modern
  return templateMap[templateId] || templateMap.modern;
}
