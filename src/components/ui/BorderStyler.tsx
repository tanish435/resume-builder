'use client';

import { Minus, Check } from 'lucide-react';

interface BorderStylerProps {
  borderStyle?: 'none' | 'solid' | 'dashed';
  borderColor?: string;
  onBorderStyleChange: (style: 'none' | 'solid' | 'dashed' | undefined) => void;
  onBorderColorChange: (color: string | undefined) => void;
}

/**
 * Border Styler Component
 * Controls for section dividers and border styling
 */
export default function BorderStyler({
  borderStyle,
  borderColor,
  onBorderStyleChange,
  onBorderColorChange,
}: BorderStylerProps) {
  const borderStyles = [
    {
      value: 'none' as const,
      label: 'None',
      description: 'No dividers',
      preview: null,
    },
    {
      value: 'solid' as const,
      label: 'Solid',
      description: 'Clean line',
      preview: (
        <div className="w-full h-0.5 bg-gray-400" />
      ),
    },
    {
      value: 'dashed' as const,
      label: 'Dashed',
      description: 'Subtle breaks',
      preview: (
        <div className="w-full h-0.5 border-t-2 border-dashed border-gray-400" />
      ),
    },
  ];

  const colorPresets = [
    { name: 'Light Gray', color: '#e5e7eb' },
    { name: 'Gray', color: '#9ca3af' },
    { name: 'Dark Gray', color: '#4b5563' },
    { name: 'Black', color: '#000000' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Primary', color: 'currentColor' },
  ];

  const currentBorderStyle = borderStyle || 'none';
  const currentBorderColor = borderColor || '#e5e7eb';

  return (
    <div className="border-styler space-y-4">
      {/* Border Style Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Minus className="w-4 h-4" />
          Section Dividers
        </label>

        <div className="grid grid-cols-1 gap-2">
          {borderStyles.map((style) => (
            <button
              key={style.value}
              onClick={() => onBorderStyleChange(style.value === 'none' ? undefined : style.value)}
              className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                currentBorderStyle === style.value
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex-1 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={`text-sm font-medium ${
                      currentBorderStyle === style.value
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {style.label}
                  </p>
                  {currentBorderStyle === style.value && (
                    <Check className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <p className="text-xs text-gray-500 mb-2">{style.description}</p>
                {style.preview && (
                  <div className="w-full py-2">
                    {style.preview}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Border Color (only show if style is not 'none') */}
      {currentBorderStyle !== 'none' && (
        <div className="space-y-3 pt-3 border-t border-gray-200 animate-fade-in">
          <label className="text-xs font-medium text-gray-600">
            Divider Color
          </label>

          {/* Color Presets */}
          <div className="grid grid-cols-3 gap-2">
            {colorPresets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => onBorderColorChange(preset.color)}
                className={`group relative px-3 py-2 rounded-lg border-2 transition-all hover:scale-105 ${
                  currentBorderColor === preset.color
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded border border-gray-300"
                    style={{
                      backgroundColor:
                        preset.color === 'currentColor' ? '#2563eb' : preset.color,
                    }}
                  />
                  <span
                    className={`text-xs ${
                      currentBorderColor === preset.color
                        ? 'text-blue-900 font-medium'
                        : 'text-gray-700'
                    }`}
                  >
                    {preset.name}
                  </span>
                </div>
                {currentBorderColor === preset.color && (
                  <Check className="absolute top-1 right-1 w-3 h-3 text-blue-600" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="space-y-2">
            <label className="text-xs text-gray-600">Custom Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={currentBorderColor === 'currentColor' ? '#2563eb' : currentBorderColor}
                onChange={(e) => onBorderColorChange(e.target.value)}
                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
              />
              <input
                type="text"
                value={currentBorderColor}
                onChange={(e) => onBorderColorChange(e.target.value)}
                className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="#e5e7eb"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Preview</p>
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Experience</h4>
            <p className="text-xs text-gray-600 mt-1">
              Software Engineer • 2020-2023
            </p>
          </div>
          
          {currentBorderStyle !== 'none' && (
            <div
              className={`w-full ${
                currentBorderStyle === 'solid' ? 'h-px' : 'h-0.5 border-t-2 border-dashed'
              }`}
              style={{
                backgroundColor: currentBorderStyle === 'solid' ? currentBorderColor : 'transparent',
                borderColor: currentBorderStyle === 'dashed' ? currentBorderColor : 'transparent',
              }}
            />
          )}
          
          <div>
            <h4 className="text-sm font-semibold text-gray-900">Education</h4>
            <p className="text-xs text-gray-600 mt-1">
              B.S. Computer Science • 2016-2020
            </p>
          </div>
        </div>
      </div>

      {/* Border Width (if not 'none') */}
      {currentBorderStyle !== 'none' && (
        <div className="space-y-2 pt-3 border-t border-gray-200">
          <label className="text-xs font-medium text-gray-600">
            Line Thickness
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button className="px-3 py-2 text-xs border-2 border-blue-600 bg-blue-50 rounded">
              Thin
            </button>
            <button className="px-3 py-2 text-xs border border-gray-300 rounded hover:border-gray-400">
              Medium
            </button>
            <button className="px-3 py-2 text-xs border border-gray-300 rounded hover:border-gray-400">
              Thick
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
