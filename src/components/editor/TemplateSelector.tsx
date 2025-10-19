'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { Check, FileText } from 'lucide-react';

/**
 * Template Selector Component
 * Choose from available resume templates
 */
export default function TemplateSelector() {
  const dispatch = useAppDispatch();
  const { activeTemplateId, availableTemplates } = useAppSelector((state) => state.template);

  const templates = [
    {
      id: 'modern',
      name: 'Modern',
      description: 'Clean single-column layout with emphasis on hierarchy',
      preview: '/templates/modern-preview.png',
      isAvailable: true,
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Traditional two-column design for corporate roles',
      preview: '/templates/professional-preview.png',
      isAvailable: false,
    },
    {
      id: 'creative',
      name: 'Creative',
      description: 'Bold and colorful design for creative professionals',
      preview: '/templates/creative-preview.png',
      isAvailable: false,
    },
    {
      id: 'minimal',
      name: 'Minimal',
      description: 'Ultra-clean minimalist design with lots of whitespace',
      preview: '/templates/minimal-preview.png',
      isAvailable: false,
    },
    {
      id: 'compact',
      name: 'Compact',
      description: 'Space-efficient layout for extensive experience',
      preview: '/templates/compact-preview.png',
      isAvailable: false,
    },
  ];

  const handleSelectTemplate = (templateId: string, isAvailable: boolean) => {
    if (!isAvailable) return;
    dispatch(setActiveTemplate(templateId));
  };

  return (
    <div className="template-selector space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Templates
        </h3>
        <p className="text-xs text-gray-500 mt-1">Choose a resume template</p>
      </div>

      {/* Template Grid */}
      <div className="space-y-3">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => handleSelectTemplate(template.id, template.isAvailable)}
            disabled={!template.isAvailable}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
              activeTemplateId === template.id
                ? 'border-blue-600 bg-blue-50'
                : template.isAvailable
                ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
            }`}
          >
            {/* Template Header */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                  {template.name}
                  {activeTemplateId === template.id && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                  {!template.isAvailable && (
                    <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                      Coming Soon
                    </span>
                  )}
                </h4>
                <p className="text-xs text-gray-600 mt-1">{template.description}</p>
              </div>
            </div>

            {/* Template Preview Placeholder */}
            <div className="mt-3 bg-gray-100 rounded aspect-[1/1.4] flex items-center justify-center">
              <div className="text-center text-gray-400">
                <FileText className="w-8 h-8 mx-auto mb-1" />
                <p className="text-xs">Preview</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Note:</strong> More templates are being developed. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
