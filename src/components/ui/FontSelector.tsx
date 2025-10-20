'use client';

import { useState, useEffect } from 'react';
import { Type, Search, Check, Download } from 'lucide-react';

interface Font {
  family: string;
  category: 'serif' | 'sans-serif' | 'monospace' | 'display';
  variants?: string[];
  googleFont?: boolean;
}

interface FontSelectorProps {
  value: string;
  onChange: (fontFamily: string) => void;
  showPreview?: boolean;
}

/**
 * Font Selector Component with Google Fonts Integration
 * Features:
 * - System fonts
 * - Popular Google Fonts
 * - Live preview
 * - Font categories
 * - Search functionality
 */
export default function FontSelector({
  value,
  onChange,
  showPreview = true,
}: FontSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());

  // Font library with system and Google Fonts
  const fonts: Font[] = [
    // System Fonts
    { family: 'Arial', category: 'sans-serif' },
    { family: 'Helvetica', category: 'sans-serif' },
    { family: 'Times New Roman', category: 'serif' },
    { family: 'Georgia', category: 'serif' },
    { family: 'Courier New', category: 'monospace' },
    { family: 'Verdana', category: 'sans-serif' },
    { family: 'Trebuchet MS', category: 'sans-serif' },
    { family: 'Palatino', category: 'serif' },
    
    // Google Fonts - Popular Professional Choices
    { family: 'Inter', category: 'sans-serif', googleFont: true },
    { family: 'Roboto', category: 'sans-serif', googleFont: true },
    { family: 'Open Sans', category: 'sans-serif', googleFont: true },
    { family: 'Lato', category: 'sans-serif', googleFont: true },
    { family: 'Montserrat', category: 'sans-serif', googleFont: true },
    { family: 'Source Sans Pro', category: 'sans-serif', googleFont: true },
    { family: 'Raleway', category: 'sans-serif', googleFont: true },
    { family: 'Poppins', category: 'sans-serif', googleFont: true },
    { family: 'Nunito', category: 'sans-serif', googleFont: true },
    { family: 'Work Sans', category: 'sans-serif', googleFont: true },
    
    { family: 'Merriweather', category: 'serif', googleFont: true },
    { family: 'Playfair Display', category: 'serif', googleFont: true },
    { family: 'Lora', category: 'serif', googleFont: true },
    { family: 'PT Serif', category: 'serif', googleFont: true },
    { family: 'Crimson Text', category: 'serif', googleFont: true },
    { family: 'EB Garamond', category: 'serif', googleFont: true },
    
    { family: 'Fira Code', category: 'monospace', googleFont: true },
    { family: 'JetBrains Mono', category: 'monospace', googleFont: true },
    { family: 'Source Code Pro', category: 'monospace', googleFont: true },
    { family: 'IBM Plex Mono', category: 'monospace', googleFont: true },
  ];

  // Load Google Font dynamically
  const loadGoogleFont = (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
      / /g,
      '+'
    )}:wght@400;600;700&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    setLoadedFonts((prev) => new Set([...prev, fontFamily]));
  };

  // Filter fonts based on search and category
  const filteredFonts = fonts.filter((font) => {
    const matchesSearch = font.family
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || font.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Categories
  const categories = [
    { value: 'all', label: 'All Fonts' },
    { value: 'sans-serif', label: 'Sans-Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'monospace', label: 'Monospace' },
  ];

  // Load selected font if it's a Google Font
  useEffect(() => {
    const selectedFont = fonts.find((f) => f.family === value);
    if (selectedFont?.googleFont) {
      loadGoogleFont(selectedFont.family);
    }
  }, [value]);

  return (
    <div className="font-selector space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search fonts..."
          className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Font List */}
      <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
        {filteredFonts.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">
            No fonts found
          </p>
        ) : (
          filteredFonts.map((font) => {
            const isSelected = value === font.family;
            const fontStyle = font.googleFont
              ? { fontFamily: font.family }
              : { fontFamily: `${font.family}, ${font.category}` };

            return (
              <button
                key={font.family}
                onClick={() => {
                  if (font.googleFont) {
                    loadGoogleFont(font.family);
                  }
                  onChange(font.family);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border-2 transition-all hover:border-blue-300 ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-transparent hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 text-left">
                  <Type className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium text-gray-900 truncate"
                      style={showPreview ? fontStyle : undefined}
                    >
                      {font.family}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {font.category}
                      {font.googleFont && (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Download className="w-3 h-3" />
                          Google
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                {isSelected && <Check className="w-5 h-5 text-blue-600" />}
              </button>
            );
          })
        )}
      </div>

      {/* Preview Text */}
      {showPreview && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-xs text-gray-500 mb-2">Preview</p>
          <p
            className="text-base text-gray-900"
            style={{ fontFamily: value }}
          >
            The quick brown fox jumps over the lazy dog
          </p>
          <p
            className="text-sm text-gray-600 mt-1"
            style={{ fontFamily: value }}
          >
            ABCDEFGHIJKLMNOPQRSTUVWXYZ
          </p>
          <p
            className="text-sm text-gray-600"
            style={{ fontFamily: value }}
          >
            abcdefghijklmnopqrstuvwxyz 0123456789
          </p>
        </div>
      )}
    </div>
  );
}
