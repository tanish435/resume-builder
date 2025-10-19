'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { Check, FileText, Sparkles, Zap, Palette, Minimize2 } from 'lucide-react';
import { getAllTemplates } from '@/lib/templates';

/**
 * Template Selector Component
 * Choose from available resume templates with smooth transitions
 * Features:
 * - Visual feedback on selection
 * - Template icons and categories
 * - Smooth animations
 * - Active state management
 */
export default function TemplateSelector() {
  const dispatch = useAppDispatch();
  const { activeTemplateId } = useAppSelector((state) => state.template);
  const [switchingTo, setSwitchingTo] = useState<string | null>(null);

  // Get all templates from registry
  const templates = getAllTemplates();

  const handleSelectTemplate = (templateId: string) => {
    if (templateId === activeTemplateId) return;
    
    // Show switching animation
    setSwitchingTo(templateId);
    
    // Dispatch after short delay for smooth transition
    setTimeout(() => {
      dispatch(setActiveTemplate(templateId));
      setSwitchingTo(null);
    }, 150);
  };

  // Get icon for template
  const getTemplateIcon = (templateId: string) => {
    switch (templateId) {
      case 'modern':
        return <Zap className="w-5 h-5" />;
      case 'professional':
        return <FileText className="w-5 h-5" />;
      case 'creative':
        return <Palette className="w-5 h-5" />;
      case 'minimal':
        return <Minimize2 className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
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
        {templates.map((template) => {
          const isActive = activeTemplateId === template.id;
          const isSwitching = switchingTo === template.id;

          return (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template.id)}
              disabled={!template.isActive || isSwitching}
              className={`
                group relative w-full text-left p-4 rounded-lg border-2 
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : isSwitching
                    ? 'border-blue-400 bg-blue-50/50 scale-[0.98]'
                    : template.isActive
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-gray-50 hover:shadow-sm'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }
              `}
            >
              {/* Active Indicator */}
              {isActive && (
                <div className="absolute top-2 right-2">
                  <div className="bg-blue-600 text-white rounded-full p-1">
                    <Check className="w-3 h-3" />
                  </div>
                </div>
              )}

              {/* Switching Indicator */}
              {isSwitching && (
                <div className="absolute inset-0 bg-blue-100/50 rounded-lg flex items-center justify-center">
                  <div className="flex items-center gap-2 text-blue-700">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-700" />
                    <span className="text-xs font-medium">Switching...</span>
                  </div>
                </div>
              )}

              {/* Template Header */}
              <div className="flex items-start gap-3 mb-2">
                {/* Icon */}
                <div
                  className={`p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-gray-100 text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-500'
                  }`}
                >
                  {getTemplateIcon(template.id)}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                    {template.displayName}
                    {template.isPremium && (
                      <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full">
                        <Sparkles className="w-3 h-3" />
                        Premium
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {template.description}
                  </p>
                </div>
              </div>

              {/* Template Category Badge */}
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                  {template.category}
                </span>
                {isActive && (
                  <span className="text-xs text-blue-600 font-medium">Active</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Info */}
      <div className="space-y-3">
        {/* Data Preservation Notice */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800 flex items-start gap-2">
            <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Data Preserved:</strong> Your resume content stays intact when switching templates
            </span>
          </p>
        </div>

        {/* Template Count */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>{templates.length} Templates Available</strong> · Switch anytime without losing data
          </p>
        </div>
      </div>
    </div>
  );
}
