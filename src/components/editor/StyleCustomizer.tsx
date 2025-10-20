'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  updatePrimaryColor,
  updateSecondaryColor,
  updateTextColor, 
  updateBackgroundColor,
  updateAccentColor,
  updateFontFamily,
  updateFontSize,
  updateLineHeight,
  updateSpacing,
  updateBorderStyle,
  updateBorderColor,
  resetStyle,
} from '@/store/slices/styleSlice';
import ColorPicker from '@/components/ui/ColorPicker';
import FontSelector from '@/components/ui/FontSelector';
import SpacingControls from '@/components/ui/SpacingControls';
import BorderStyler from '@/components/ui/BorderStyler';
import ThemePresets from '@/components/ui/ThemePresets';
import { Palette, Type, Maximize2, Minus, ChevronDown, ChevronUp, RotateCcw, Sparkles } from 'lucide-react';

/**
 * Style Customizer Component - Phase 6.1
 * Comprehensive style customization with:
 * - Advanced color picker with presets
 * - Google Fonts integration
 * - Spacing controls
 * - Border/divider styling
 */
export default function StyleCustomizer() {
  const dispatch = useAppDispatch();
  const { currentStyle } = useAppSelector((state) => state.style);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    themes: true,
    colors: false,
    typography: false,
    spacing: false,
    borders: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Section configuration
  const sections = [
    {
      id: 'themes' as const,
      title: 'Theme Presets',
      icon: Sparkles,
      description: 'Quick color schemes',
    },
    {
      id: 'colors' as const,
      title: 'Colors',
      icon: Palette,
      description: 'Customize color scheme',
    },
    {
      id: 'typography' as const,
      title: 'Typography',
      icon: Type,
      description: 'Fonts and text styling',
    },
    {
      id: 'spacing' as const,
      title: 'Spacing & Layout',
      icon: Maximize2,
      description: 'Control spacing and density',
    },
    {
      id: 'borders' as const,
      title: 'Borders & Dividers',
      icon: Minus,
      description: 'Section divider styling',
    },
  ];

  return (
    <div className="style-customizer h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5 text-blue-600" />
          Design Customization
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Personalize your resume appearance
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-3">
          {sections.map((section) => {
            const Icon = section.icon;
            const isExpanded = expandedSections[section.id];

            return (
              <div
                key={section.id}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-gray-600" />
                    <div className="text-left">
                      <h4 className="text-sm font-semibold text-gray-900">
                        {section.title}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {/* Section Content */}
                {isExpanded && (
                  <div className="p-4 pt-0 border-t border-gray-100 animate-fade-in">
                    {section.id === 'themes' && (
                      <div className="pt-4">
                        <ThemePresets />
                      </div>
                    )}

                    {section.id === 'colors' && (
                      <div className="space-y-4 pt-4">
                        <ColorPicker
                          label="Primary Color"
                          value={currentStyle.primaryColor}
                          onChange={(color) => dispatch(updatePrimaryColor(color))}
                        />
                        <ColorPicker
                          label="Secondary Color"
                          value={currentStyle.secondaryColor || '#3b82f6'}
                          onChange={(color) => dispatch(updateSecondaryColor(color))}
                        />
                        <ColorPicker
                          label="Accent Color"
                          value={currentStyle.accentColor || '#60a5fa'}
                          onChange={(color) => dispatch(updateAccentColor(color))}
                        />
                        <ColorPicker
                          label="Text Color"
                          value={currentStyle.textColor || '#1f2937'}
                          onChange={(color) => dispatch(updateTextColor(color))}
                        />
                        <ColorPicker
                          label="Background Color"
                          value={currentStyle.backgroundColor || '#ffffff'}
                          onChange={(color) => dispatch(updateBackgroundColor(color))}
                        />
                      </div>
                    )}

                    {section.id === 'typography' && (
                      <div className="pt-4">
                        <FontSelector
                          value={currentStyle.fontFamily}
                          onChange={(font) => dispatch(updateFontFamily(font))}
                        />
                      </div>
                    )}

                    {section.id === 'spacing' && (
                      <div className="pt-4">
                        <SpacingControls
                          spacing={currentStyle.spacing}
                          onSpacingChange={(spacing) =>
                            dispatch(updateSpacing(spacing))
                          }
                          fontSize={currentStyle.fontSize}
                          onFontSizeChange={(size) =>
                            dispatch(updateFontSize(size))
                          }
                          lineHeight={currentStyle.lineHeight}
                          onLineHeightChange={(height) =>
                            dispatch(updateLineHeight(height))
                          }
                        />
                      </div>
                    )}

                    {section.id === 'borders' && (
                      <div className="pt-4">
                        <BorderStyler
                          borderStyle={currentStyle.borderStyle}
                          borderColor={currentStyle.borderColor}
                          onBorderStyleChange={(style) =>
                            dispatch(updateBorderStyle(style))
                          }
                          onBorderColorChange={(color) =>
                            dispatch(updateBorderColor(color))
                          }
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <button
          onClick={() => dispatch(resetStyle())}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Default
        </button>
      </div>
    </div>
  );
}
