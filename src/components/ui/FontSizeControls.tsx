'use client';

import { StyleConfig } from '@/types/schema';
import { useAppDispatch } from '@/store/hooks';
import { updateIndividualFontSize } from '@/store/slices/styleSlice';

interface FontSizeControlsProps {
  fontSizes?: StyleConfig['fontSizes'];
}

export default function FontSizeControls({ fontSizes }: FontSizeControlsProps) {
  const dispatch = useAppDispatch();

  const fontSizeSettings = [
    {
      key: 'name' as const,
      label: 'Name/Title',
      description: 'Your name in the header',
      min: 20,
      max: 48,
      default: 32,
    },
    {
      key: 'jobTitle' as const,
      label: 'Job Title',
      description: 'Professional headline',
      min: 12,
      max: 24,
      default: 16,
    },
    {
      key: 'sectionTitle' as const,
      label: 'Section Titles',
      description: 'Experience, Education, etc.',
      min: 12,
      max: 24,
      default: 18,
    },
    {
      key: 'jobPosition' as const,
      label: 'Position/Role',
      description: 'Job titles in experience',
      min: 10,
      max: 20,
      default: 14,
    },
    {
      key: 'company' as const,
      label: 'Company Names',
      description: 'Organization names',
      min: 10,
      max: 18,
      default: 13,
    },
    {
      key: 'body' as const,
      label: 'Body Text',
      description: 'Descriptions and content',
      min: 8,
      max: 16,
      default: 11,
    },
    {
      key: 'small' as const,
      label: 'Small Text',
      description: 'Dates, locations',
      min: 7,
      max: 14,
      default: 10,
    },
  ];

  const handleChange = (
    key: keyof NonNullable<StyleConfig['fontSizes']>,
    value: number
  ) => {
    dispatch(updateIndividualFontSize({ key, value }));
  };

  return (
    <div className="space-y-4">
      <div className="text-xs text-gray-500 mb-3">
        Adjust font sizes for different text elements
      </div>
      
      {fontSizeSettings.map((setting) => {
        const currentValue = fontSizes?.[setting.key] ?? setting.default;
        
        return (
          <div key={setting.key} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-medium text-gray-700">
                  {setting.label}
                </label>
                <p className="text-[10px] text-gray-500">
                  {setting.description}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={currentValue}
                  onChange={(e) =>
                    handleChange(setting.key, parseInt(e.target.value) || setting.default)
                  }
                  min={setting.min}
                  max={setting.max}
                  className="w-14 px-2 py-1 text-xs text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-500">px</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="range"
                value={currentValue}
                onChange={(e) =>
                  handleChange(setting.key, parseInt(e.target.value))
                }
                min={setting.min}
                max={setting.max}
                step={1}
                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>
            
            {/* Visual preview */}
            <div 
              className="text-gray-700 truncate px-2 py-1 bg-gray-50 rounded border border-gray-200"
              style={{ fontSize: `${currentValue}px`, lineHeight: 1.2 }}
            >
              Sample Text
            </div>
          </div>
        );
      })}

      <div className="pt-3 border-t border-gray-200">
        <button
          onClick={() => {
            fontSizeSettings.forEach((setting) => {
              handleChange(setting.key, setting.default);
            });
          }}
          className="w-full px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          Reset to Defaults
        </button>
      </div>
    </div>
  );
}
