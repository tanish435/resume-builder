'use client';

import { useState } from 'react';
import { Pipette, Palette, Check } from 'lucide-react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  presets?: string[];
  showOpacity?: boolean;
}

/**
 * Advanced Color Picker Component
 * Features:
 * - Native color input
 * - Hex code input
 * - Color presets
 * - Opacity control (optional)
 * - Recently used colors
 */
export default function ColorPicker({
  label,
  value,
  onChange,
  presets = [],
  showOpacity = false,
}: ColorPickerProps) {
  const [showPresets, setShowPresets] = useState(false);
  const [recentColors, setRecentColors] = useState<string[]>([]);

  // Default color presets if none provided
  const defaultPresets = [
    '#2563eb', // Blue
    '#059669', // Green
    '#7c3aed', // Purple
    '#dc2626', // Red
    '#ea580c', // Orange
    '#0d9488', // Teal
    '#1f2937', // Dark Gray
    '#1e40af', // Navy
    '#be123c', // Rose
    '#ca8a04', // Yellow
    '#000000', // Black
    '#ffffff', // White
  ];

  const colorPresets = presets.length > 0 ? presets : defaultPresets;

  const handleColorChange = (newColor: string) => {
    onChange(newColor);
    
    // Add to recent colors (max 6)
    if (!recentColors.includes(newColor)) {
      setRecentColors([newColor, ...recentColors.slice(0, 5)]);
    }
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  return (
    <div className="color-picker space-y-2">
      {/* Label */}
      <label className="text-xs font-medium text-gray-700">{label}</label>

      {/* Color Input Row */}
      <div className="flex items-center gap-2">
        {/* Color Swatch + Picker */}
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            title="Pick a color"
          />
          <Pipette className="absolute bottom-1 right-1 w-3 h-3 text-white drop-shadow pointer-events-none" />
        </div>

        {/* Hex Input */}
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const hex = e.target.value;
            if (/^#[0-9A-F]{6}$/i.test(hex)) {
              handleColorChange(hex);
            }
          }}
          className="flex-1 px-3 py-2 text-sm font-mono border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="#2563eb"
          pattern="^#[0-9A-F]{6}$"
        />

        {/* Presets Toggle */}
        <button
          onClick={() => setShowPresets(!showPresets)}
          className={`p-2 rounded border-2 transition-colors ${
            showPresets
              ? 'border-blue-500 bg-blue-50 text-blue-600'
              : 'border-gray-300 hover:border-gray-400'
          }`}
          title="Show color presets"
        >
          <Palette className="w-4 h-4" />
        </button>
      </div>

      {/* RGB Display */}
      {hexToRgb(value) && (
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>RGB:</span>
          <span className="font-mono">
            {hexToRgb(value)!.r}, {hexToRgb(value)!.g}, {hexToRgb(value)!.b}
          </span>
        </div>
      )}

      {/* Color Presets */}
      {showPresets && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-fade-in">
          {/* Recent Colors */}
          {recentColors.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600">Recent</p>
              <div className="grid grid-cols-6 gap-2">
                {recentColors.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleColorChange(color)}
                    className="group relative w-8 h-8 rounded border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: value === color ? '#2563eb' : '#e5e7eb',
                    }}
                    title={color}
                  >
                    {value === color && (
                      <Check className="w-4 h-4 text-white drop-shadow absolute inset-0 m-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Preset Colors */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-600">Presets</p>
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className="group relative w-8 h-8 rounded border-2 transition-all hover:scale-110"
                  style={{
                    backgroundColor: color,
                    borderColor: value === color ? '#2563eb' : '#e5e7eb',
                  }}
                  title={color}
                >
                  {value === color && (
                    <Check className="w-4 h-4 text-white drop-shadow absolute inset-0 m-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
