'use client';

import { useState, useEffect } from 'react';
import type { Resume, Section, StyleConfig } from '@/types/schema';
import { getTemplateComponent, isValidTemplateId, getDefaultTemplateId, getTemplateMetadata } from '@/lib/templates';
import { Loader2 } from 'lucide-react';

interface TemplateLoaderProps {
  resume: Resume;
  sections: Section[];
  style: StyleConfig;
  templateId: string;
}

/**
 * Template Loader Component
 * Dynamically loads and renders the active template with smooth transitions
 * Features:
 * - Dynamic component loading
 * - Data preservation across template switches
 * - Smooth fade transitions
 * - Loading states with template info
 */
export default function TemplateLoader({
  resume,
  sections,
  style,
  templateId,
}: TemplateLoaderProps) {
  // Validate template ID, fallback to default if invalid
  const validTemplateId = isValidTemplateId(templateId) ? templateId : getDefaultTemplateId();

  // State for smooth transitions
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentTemplateId, setCurrentTemplateId] = useState(validTemplateId);

  // Handle template changes with transition
  useEffect(() => {
    if (currentTemplateId !== validTemplateId) {
      // Start transition
      setIsTransitioning(true);

      // Short delay for visual feedback
      const transitionTimer = setTimeout(() => {
        setCurrentTemplateId(validTemplateId);
      }, 150);

      // End transition after animation
      const endTimer = setTimeout(() => {
        setIsTransitioning(false);
      }, 400);

      return () => {
        clearTimeout(transitionTimer);
        clearTimeout(endTimer);
      };
    } else {
      // Ensure transition state is cleared if IDs match
      setIsTransitioning(false);
    }
  }, [validTemplateId, currentTemplateId]);

  // Get template metadata for the target template (for loading message)
  const targetTemplateMetadata = getTemplateMetadata(validTemplateId);

  // Get the component for the current (potentially transitioning) template
  const CurrentTemplate = getTemplateComponent(currentTemplateId);

  return (
    <div className="template-loader-wrapper relative w-full h-full">
      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mx-auto" />
            <p className="text-sm text-gray-600 mt-3 font-medium">
              Switching to {targetTemplateMetadata.displayName}...
            </p>
          </div>
        </div>
      )}

      {/* Template Content with Fade Animation */}
      <div
        className={`template-content transition-opacity duration-300 ${
          isTransitioning ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <CurrentTemplate resume={resume} sections={sections} style={style} />
      </div>
    </div>
  );
}
