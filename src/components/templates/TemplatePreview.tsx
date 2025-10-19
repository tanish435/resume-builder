'use client';

import { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';
import { getTemplateMetadata } from '@/lib/templates';

interface TemplatePreviewProps {
  templateId: string;
  onClose: () => void;
}

/**
 * Template Preview Modal
 * Shows a preview of the template layout
 */
export default function TemplatePreview({ templateId, onClose }: TemplatePreviewProps) {
  const [zoom, setZoom] = useState(100);
  const metadata = getTemplateMetadata(templateId);

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 10, 150));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 10, 50));

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {metadata.displayName} Template
            </h3>
            <p className="text-sm text-gray-600">{metadata.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button
              onClick={handleZoomOut}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {zoom}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div
            className="mx-auto bg-white shadow-lg transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              width: '210mm', // A4 width
              minHeight: '297mm', // A4 height
            }}
          >
            {/* Template Layout Visualization */}
            <TemplateLayoutPreview templateId={templateId} />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Category: <span className="font-medium">{metadata.category}</span>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Close Preview
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Template Layout Visualization
 * Shows the structure of each template
 */
function TemplateLayoutPreview({ templateId }: { templateId: string }) {
  const layouts: Record<string, React.ReactElement> = {
    modern: <ModernLayoutPreview />,
    professional: <ProfessionalLayoutPreview />,
    creative: <CreativeLayoutPreview />,
    minimal: <MinimalLayoutPreview />,
  };

  return layouts[templateId] || <ModernLayoutPreview />;
}

// Layout Previews
function ModernLayoutPreview() {
  return (
    <div className="p-12 space-y-6">
      <div className="space-y-2">
        <div className="h-8 bg-gray-800 w-3/4 rounded" />
        <div className="h-4 bg-gray-400 w-1/2 rounded" />
        <div className="h-4 bg-gray-400 w-2/3 rounded" />
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-blue-600 w-1/3 rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 w-5/6 rounded" />
          <div className="h-4 bg-gray-300 w-4/6 rounded" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-6 bg-blue-600 w-1/3 rounded" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded" />
          <div className="h-4 bg-gray-300 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
}

function ProfessionalLayoutPreview() {
  return (
    <div className="flex">
      <div className="w-[30%] bg-gray-100 p-6 space-y-6">
        <div className="space-y-2">
          <div className="h-6 bg-blue-600 w-3/4 rounded" />
          <div className="h-3 bg-gray-400 rounded" />
          <div className="h-3 bg-gray-400 rounded" />
          <div className="h-3 bg-gray-400 w-5/6 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-blue-600 w-3/4 rounded" />
          <div className="h-3 bg-gray-400 rounded" />
          <div className="h-3 bg-gray-400 w-4/6 rounded" />
        </div>
      </div>
      <div className="w-[70%] p-12 space-y-6">
        <div className="space-y-2">
          <div className="h-8 bg-gray-800 w-2/3 rounded" />
          <div className="h-4 bg-gray-400 w-1/2 rounded" />
        </div>
        <div className="space-y-3">
          <div className="h-6 bg-blue-600 w-1/4 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 w-5/6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function CreativeLayoutPreview() {
  return (
    <div className="flex">
      <div className="w-[35%] bg-blue-600 p-8 space-y-6 text-white">
        <div className="space-y-2">
          <div className="h-6 bg-white/90 w-3/4 rounded" />
          <div className="h-3 bg-white/70 rounded" />
          <div className="h-3 bg-white/70 rounded" />
        </div>
        <div className="space-y-2">
          <div className="h-6 bg-white/90 w-2/3 rounded" />
          <div className="h-3 bg-white/70 rounded" />
          <div className="h-3 bg-white/70 w-4/6 rounded" />
        </div>
      </div>
      <div className="w-[65%] p-12 space-y-6">
        <div className="h-2 bg-blue-600 w-24 rounded-full mb-8" />
        <div className="space-y-3">
          <div className="h-6 bg-blue-600 w-1/3 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 w-5/6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

function MinimalLayoutPreview() {
  return (
    <div className="max-w-3xl mx-auto p-16 space-y-12">
      <div className="text-center space-y-3">
        <div className="h-8 bg-gray-800 w-2/3 mx-auto rounded" />
        <div className="h-4 bg-gray-400 w-1/2 mx-auto rounded" />
      </div>
      <div className="h-[2px] bg-gray-300 w-20 mx-auto rounded-full" />
      <div className="space-y-8">
        <div className="space-y-3">
          <div className="h-6 bg-gray-700 w-1/4 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 w-5/6 rounded" />
          </div>
        </div>
        <div className="h-[1px] bg-gray-200 w-16 mx-auto rounded-full" />
        <div className="space-y-3">
          <div className="h-6 bg-gray-700 w-1/4 rounded" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded" />
            <div className="h-4 bg-gray-300 w-4/6 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
