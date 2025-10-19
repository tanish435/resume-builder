'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { 
  setStyle, 
  updatePrimaryColor, 
  updateTextColor, 
  updateBackgroundColor,
  updateFontFamily,
  updateFontSize,
  updateLineHeight,
  updateSpacing
} from '@/store/slices/styleSlice';
import { Palette, Type, Maximize2 } from 'lucide-react';

/**
 * Style Customizer Component
 * Customize colors, fonts, spacing, and other style properties
 */
export default function StyleCustomizer() {
  const dispatch = useAppDispatch();
  const { currentStyle } = useAppSelector((state) => state.style);

  const handleColorChange = (property: 'primaryColor' | 'textColor' | 'backgroundColor', value: string) => {
    if (property === 'primaryColor') {
      dispatch(updatePrimaryColor(value));
    } else if (property === 'textColor') {
      dispatch(updateTextColor(value));
    } else {
      dispatch(updateBackgroundColor(value));
    }
  };

  const handleFontChange = (value: string) => {
    dispatch(updateFontFamily(value));
  };

  const handleFontSizeChange = (value: number) => {
    dispatch(updateFontSize(value));
  };

  const handleLineHeightChange = (value: number) => {
    dispatch(updateLineHeight(value));
  };

  const handleSpacingChange = (value: 'compact' | 'normal' | 'relaxed') => {
    dispatch(updateSpacing(value));
  };

  const fontOptions = [
    { value: 'Inter, sans-serif', label: 'Inter (Modern)' },
    { value: 'Georgia, serif', label: 'Georgia (Classic)' },
    { value: 'Arial, sans-serif', label: 'Arial (Simple)' },
    { value: '"Times New Roman", serif', label: 'Times New Roman (Traditional)' },
    { value: '"Courier New", monospace', label: 'Courier New (Monospace)' },
    { value: 'Helvetica, sans-serif', label: 'Helvetica (Clean)' },
  ];

  const presetColors = [
    { name: 'Blue', primary: '#2563eb', text: '#1f2937', bg: '#ffffff' },
    { name: 'Green', primary: '#059669', text: '#1f2937', bg: '#ffffff' },
    { name: 'Purple', primary: '#7c3aed', text: '#1f2937', bg: '#ffffff' },
    { name: 'Red', primary: '#dc2626', text: '#1f2937', bg: '#ffffff' },
    { name: 'Orange', primary: '#ea580c', text: '#1f2937', bg: '#ffffff' },
    { name: 'Teal', primary: '#0d9488', text: '#1f2937', bg: '#ffffff' },
    { name: 'Dark', primary: '#1f2937', text: '#000000', bg: '#ffffff' },
    { name: 'Navy', primary: '#1e40af', text: '#1f2937', bg: '#ffffff' },
  ];

  return (
    <div className="style-customizer space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Style Customizer
        </h3>
        <p className="text-xs text-gray-500 mt-1">Customize colors, fonts, and layout</p>
      </div>

      {/* Color Presets */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-gray-700">Color Presets</label>
        <div className="grid grid-cols-4 gap-2">
          {presetColors.map((preset) => (
            <button
              key={preset.name}
              onClick={() => {
                dispatch(setStyle({
                  ...currentStyle,
                  primaryColor: preset.primary,
                  textColor: preset.text,
                  backgroundColor: preset.bg,
                }));
              }}
              className="group relative h-12 rounded-lg border-2 transition-all hover:scale-105"
              style={{
                backgroundColor: preset.bg,
                borderColor: currentStyle.primaryColor === preset.primary ? preset.primary : '#e5e7eb',
              }}
              title={preset.name}
            >
              <div
                className="absolute inset-0 rounded-lg opacity-70"
                style={{ backgroundColor: preset.primary }}
              />
              <span className="relative text-xs font-medium text-white drop-shadow">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-700">Custom Colors</label>
        
        {/* Primary Color */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Primary Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyle.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={currentStyle.primaryColor}
              onChange={(e) => handleColorChange('primaryColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#2563eb"
            />
          </div>
        </div>

        {/* Text Color */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Text Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyle.textColor || '#1f2937'}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={currentStyle.textColor || '#1f2937'}
              onChange={(e) => handleColorChange('textColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#1f2937"
            />
          </div>
        </div>

        {/* Background Color */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Background Color</label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={currentStyle.backgroundColor || '#ffffff'}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={currentStyle.backgroundColor || '#ffffff'}
              onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
              className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Type className="w-4 h-4" />
          Typography
        </label>

        {/* Font Family */}
        <div className="space-y-2">
          <label className="text-xs text-gray-600">Font Family</label>
          <select
            value={currentStyle.fontFamily}
            onChange={(e) => handleFontChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontOptions.map((font) => (
              <option key={font.value} value={font.value}>
                {font.label}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-600">Font Size</label>
            <span className="text-xs text-gray-500">{currentStyle.fontSize}px</span>
          </div>
          <input
            type="range"
            min="10"
            max="18"
            step="1"
            value={currentStyle.fontSize}
            onChange={(e) => handleFontSizeChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>10px</span>
            <span>18px</span>
          </div>
        </div>

        {/* Line Height */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-xs text-gray-600">Line Height</label>
            <span className="text-xs text-gray-500">{currentStyle.lineHeight}</span>
          </div>
          <input
            type="range"
            min="1.2"
            max="2.0"
            step="0.1"
            value={currentStyle.lineHeight}
            onChange={(e) => handleLineHeightChange(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1.2</span>
            <span>2.0</span>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="space-y-3 pt-3 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Maximize2 className="w-4 h-4" />
          Spacing
        </label>

        <div className="grid grid-cols-3 gap-2">
          {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
            <button
              key={spacing}
              onClick={() => handleSpacingChange(spacing)}
              className={`px-3 py-2 text-sm rounded border-2 transition-colors ${
                currentStyle.spacing === spacing
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {spacing.charAt(0).toUpperCase() + spacing.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="pt-3 border-t border-gray-200">
        <button
          onClick={() => {
            dispatch(setStyle({
              primaryColor: '#2563eb',
              textColor: '#1f2937',
              backgroundColor: '#ffffff',
              fontFamily: 'Inter, sans-serif',
              fontSize: 14,
              lineHeight: 1.6,
              spacing: 'normal',
            }));
          }}
          className="w-full px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
        >
          Reset to Default
        </button>
      </div>
    </div>
  );
}
