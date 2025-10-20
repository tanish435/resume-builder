'use client';

import { Maximize2, Minimize2 } from 'lucide-react';

interface SpacingControlsProps {
  spacing: 'compact' | 'normal' | 'relaxed';
  onSpacingChange: (spacing: 'compact' | 'normal' | 'relaxed') => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  lineHeight: number;
  onLineHeightChange: (height: number) => void;
}

/**
 * Spacing Controls Component
 * Fine-tuned controls for spacing, font size, and line height
 */
export default function SpacingControls({
  spacing,
  onSpacingChange,
  fontSize,
  onFontSizeChange,
  lineHeight,
  onLineHeightChange,
}: SpacingControlsProps) {
  const spacingPresets = [
    {
      value: 'compact' as const,
      label: 'Compact',
      description: 'Minimal spacing, more content',
      icon: Minimize2,
      lineHeight: 1.4,
    },
    {
      value: 'normal' as const,
      label: 'Normal',
      description: 'Balanced spacing',
      icon: Maximize2,
      lineHeight: 1.6,
    },
    {
      value: 'relaxed' as const,
      label: 'Relaxed',
      description: 'Generous spacing, better readability',
      icon: Maximize2,
      lineHeight: 1.8,
    },
  ];

  const handleSpacingPreset = (
    preset: 'compact' | 'normal' | 'relaxed'
  ) => {
    onSpacingChange(preset);
    const selectedPreset = spacingPresets.find((p) => p.value === preset);
    if (selectedPreset) {
      onLineHeightChange(selectedPreset.lineHeight);
    }
  };

  return (
    <div className="spacing-controls space-y-4">
      {/* Spacing Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          Layout Spacing
        </label>

        <div className="grid grid-cols-1 gap-2">
          {spacingPresets.map((preset) => {
            const Icon = preset.icon;
            return (
              <button
                key={preset.value}
                onClick={() => handleSpacingPreset(preset.value)}
                className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                  spacing === preset.value
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    spacing === preset.value ? 'text-blue-600' : 'text-gray-400'
                  }`}
                />
                <div className="flex-1 text-left">
                  <p
                    className={`text-sm font-medium ${
                      spacing === preset.value
                        ? 'text-blue-900'
                        : 'text-gray-900'
                    }`}
                  >
                    {preset.label}
                  </p>
                  <p className="text-xs text-gray-500">{preset.description}</p>
                </div>
                {spacing === preset.value && (
                  <div className="w-2 h-2 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font Size Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-600">Font Size</label>
          <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
            {fontSize}px
          </span>
        </div>
        <input
          type="range"
          min="10"
          max="18"
          step="0.5"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Small (10px)</span>
          <span>Large (18px)</span>
        </div>
      </div>

      {/* Line Height Control */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-medium text-gray-600">
            Line Height
          </label>
          <span className="text-xs font-mono text-gray-900 bg-gray-100 px-2 py-1 rounded">
            {lineHeight.toFixed(1)}
          </span>
        </div>
        <input
          type="range"
          min="1.2"
          max="2.0"
          step="0.1"
          value={lineHeight}
          onChange={(e) => onLineHeightChange(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Tight (1.2)</span>
          <span>Loose (2.0)</span>
        </div>
      </div>

      {/* Spacing Visual Preview */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-3">Preview</p>
        <div
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
          }}
        >
          <p className="text-gray-900 font-semibold">Senior Software Engineer</p>
          <p className="text-gray-600 mt-1">
            Led development of scalable web applications using React and Node.js.
          </p>
          <ul className="mt-2 space-y-1 text-gray-700">
            <li>• Improved performance by 40%</li>
            <li>• Mentored team of 5 developers</li>
          </ul>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            onFontSizeChange(12);
            onLineHeightChange(1.5);
            onSpacingChange('compact');
          }}
          className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Maximize Content
        </button>
        <button
          onClick={() => {
            onFontSizeChange(14);
            onLineHeightChange(1.7);
            onSpacingChange('relaxed');
          }}
          className="px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Maximize Readability
        </button>
      </div>
    </div>
  );
}
