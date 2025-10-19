'use client';

import { useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMode, setActiveSection } from '@/store/slices/editorSlice';
import TemplateLoader from '../templates/TemplateLoader';
import ZoomControls from '../ui/ZoomControls';

/**
 * Main Resume Canvas Component
 * Renders the active template with A4 dimensions and zoom controls
 */
export default function ResumeCanvas() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLDivElement>(null);

  // Redux state
  const { currentResume, sections } = useAppSelector((state) => state.resume);
  const { zoom, mode } = useAppSelector((state) => state.editor);
  const { currentStyle } = useAppSelector((state) => state.style);
  const { activeTemplateId } = useAppSelector((state) => state.template);

  // A4 dimensions at 96 DPI
  const A4_WIDTH = 794; // pixels
  const A4_HEIGHT = 1123; // pixels

  // Switch to view mode when clicking outside canvas
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (canvasRef.current && !canvasRef.current.contains(event.target as Node)) {
        if (mode === 'edit') {
          dispatch(setActiveSection(null));
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mode, dispatch]);

  if (!currentResume) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-gray-500 text-lg">No resume loaded</p>
          <p className="text-gray-400 text-sm mt-2">Create or select a resume to begin</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-gray-100 overflow-auto">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10">
        <ZoomControls />
      </div>

      {/* Canvas Container with Scroll */}
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          ref={canvasRef}
          className="resume-canvas bg-white shadow-2xl transition-transform duration-200 origin-top"
          style={{
            width: `${A4_WIDTH}px`,
            height: `${A4_HEIGHT}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top center',
          }}
        >
          {/* Template Renderer */}
          <TemplateLoader
            resume={currentResume}
            sections={sections}
            style={currentStyle}
            templateId={activeTemplateId}
          />
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .resume-canvas {
            width: 210mm !important;
            height: 297mm !important;
            box-shadow: none !important;
            transform: none !important;
            page-break-after: always;
          }
          
          body {
            margin: 0;
            padding: 0;
          }
          
          /* Hide non-printable elements */
          .no-print {
            display: none !important;
          }
        }
        
        /* Smooth zoom transitions */
        .resume-canvas {
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
