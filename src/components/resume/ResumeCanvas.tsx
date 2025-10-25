'use client';

import { useEffect, useRef, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setMode, setActiveSection } from '@/store/slices/editorSlice';
import TemplateLoader from '../templates/TemplateLoader';
import ZoomControls from '../ui/ZoomControls';
import { PageFitIndicator } from '../ui/PageFitIndicator';
import { setupAutoOptimization, A4_WIDTH, A4_HEIGHT } from '@/lib/singlePageOptimizer';

/**
 * Main Resume Canvas Component
 * Renders the active template with A4 dimensions and auto-optimization for single page
 */
export default function ResumeCanvas() {
  const dispatch = useAppDispatch();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(A4_HEIGHT);
  const [compressionLevel, setCompressionLevel] = useState<'comfortable' | 'slight' | 'moderate' | 'heavy'>('comfortable');

  // Redux state
  const { currentResume, sections } = useAppSelector((state) => state.resume);
  const { zoom, mode } = useAppSelector((state) => state.editor);
  const { currentStyle } = useAppSelector((state) => state.style);
  const { activeTemplateId } = useAppSelector((state) => state.template);

  // Setup auto-optimization for single page
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const cleanup = setupAutoOptimization('resume-canvas', (settings) => {
      console.log('Resume optimized:', settings);
      
      // Update indicator state
      const height = canvasRef.current?.scrollHeight || A4_HEIGHT;
      setContentHeight(height);
      
      // Determine compression level
      const ratio = A4_HEIGHT / height;
      if (ratio >= 1.0) setCompressionLevel('comfortable');
      else if (ratio >= 0.85) setCompressionLevel('slight');
      else if (ratio >= 0.70) setCompressionLevel('moderate');
      else setCompressionLevel('heavy');
    });
    
    return cleanup;
  }, [sections, currentResume, activeTemplateId]);

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
      <div className="absolute top-4 right-4 z-10 no-print">
        <ZoomControls />
      </div>

      {/* Page Fit Indicator */}
      <PageFitIndicator 
        contentHeight={contentHeight} 
        compressionLevel={compressionLevel}
      />

      {/* Canvas Container with Scroll */}
      <div className="flex items-center justify-center min-h-full p-8">
        <div
          id="resume-canvas"
          ref={canvasRef}
          className="resume-canvas bg-white shadow-2xl transition-transform duration-200 origin-top"
          style={{
            width: `${A4_WIDTH}px`,
            minHeight: `${A4_HEIGHT}px`,
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

      {/* Smooth zoom transitions */}
      <style jsx>{`
        .resume-canvas {
          transition: transform 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
}
