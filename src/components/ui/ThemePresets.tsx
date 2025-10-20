'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { applyTheme, saveCustomTheme, deleteCustomTheme } from '@/store/slices/styleSlice';
import {
  THEME_PRESETS,
  getThemeCategories,
  createCustomTheme,
  type ThemePreset,
} from '@/lib/themes';
import {
  Palette,
  Check,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Sparkles,
} from 'lucide-react';

/**
 * Theme Presets Component - Phase 6.2
 * Features:
 * - 7 built-in color themes
 * - One-click theme application
 * - Custom theme creation
 * - Theme management (save, edit, delete)
 */
export default function ThemePresets() {
  const dispatch = useAppDispatch();
  const { currentStyle, activeThemeId, customThemes } = useAppSelector(
    (state) => state.style
  );

  // State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customDescription, setCustomDescription] = useState('');

  // Get all themes (built-in + custom)
  const allThemes: ThemePreset[] = [...THEME_PRESETS, ...customThemes];

  // Filter themes by category
  const filteredThemes =
    selectedCategory === 'all'
      ? allThemes
      : allThemes.filter((theme) => theme.category === selectedCategory);

  // Categories
  const categories = [
    { value: 'all', label: 'All Themes', description: 'Show all available themes' },
    ...getThemeCategories(),
  ];

  // Handle theme application
  const handleApplyTheme = (theme: ThemePreset) => {
    dispatch(
      applyTheme({
        themeId: theme.id,
        config: theme.config,
      })
    );
  };

  // Handle custom theme creation
  const handleCreateCustomTheme = () => {
    if (!customName.trim()) {
      alert('Please enter a theme name');
      return;
    }

    const customTheme = createCustomTheme(
      customName,
      customDescription || 'Custom theme',
      currentStyle
    );

    dispatch(saveCustomTheme(customTheme));
    setShowCustomDialog(false);
    setCustomName('');
    setCustomDescription('');

    // Apply the newly created theme
    dispatch(
      applyTheme({
        themeId: customTheme.id,
        config: customTheme.config,
      })
    );
  };

  // Handle custom theme deletion
  const handleDeleteTheme = (themeId: string) => {
    if (confirm('Are you sure you want to delete this custom theme?')) {
      dispatch(deleteCustomTheme(themeId));
    }
  };

  return (
    <div className="theme-presets space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Theme Presets</h4>
          <p className="text-xs text-gray-500 mt-1">
            Apply professional color schemes instantly
          </p>
        </div>
        <button
          onClick={() => setShowCustomDialog(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Save Current
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {categories.map((category) => (
          <button
            key={category.value}
            onClick={() => setSelectedCategory(category.value)}
            className={`px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap transition-colors ${
              selectedCategory === category.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            title={category.description}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto custom-scrollbar pr-2">
        {filteredThemes.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <Palette className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No themes in this category</p>
          </div>
        ) : (
          filteredThemes.map((theme) => {
            const isActive = activeThemeId === theme.id;
            const isCustom = theme.category === 'custom';

            return (
              <div
                key={theme.id}
                className={`theme-card group relative p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isActive
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => handleApplyTheme(theme)}
              >
                {/* Color Preview Dots */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex gap-1.5">
                    <div
                      className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: theme.preview.primaryColor }}
                      title="Primary"
                    />
                    <div
                      className="w-6 h-6 rounded-full border-2 border-white shadow-sm self-center"
                      style={{ backgroundColor: theme.preview.secondaryColor }}
                      title="Secondary"
                    />
                    <div
                      className="w-5 h-5 rounded-full border-2 border-white shadow-sm self-center"
                      style={{ backgroundColor: theme.preview.accentColor }}
                      title="Accent"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5
                        className={`text-sm font-semibold truncate ${
                          isActive ? 'text-blue-900' : 'text-gray-900'
                        }`}
                      >
                        {theme.name}
                      </h5>
                      {isCustom && (
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {theme.description}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <div className="flex-shrink-0">
                      <Check className="w-5 h-5 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Tags */}
                {theme.tags && theme.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {theme.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Font Preview */}
                <div
                  className="text-xs text-gray-400 truncate"
                  style={{ fontFamily: theme.config.fontFamily }}
                >
                  {theme.config.fontFamily} • {theme.config.fontSize}px
                </div>

                {/* Custom Theme Actions */}
                {isCustom && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTheme(theme.id);
                      }}
                      className="p-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                      title="Delete theme"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Premium Badge (if applicable) */}
                {theme.isPremium && (
                  <div className="absolute top-2 left-2">
                    <span className="flex items-center gap-1 px-2 py-1 text-xs bg-yellow-100 text-yellow-700 rounded">
                      <Sparkles className="w-3 h-3" />
                      Pro
                    </span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Custom Theme Dialog */}
      {showCustomDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fade-in">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 animate-slide-in-right">
            {/* Dialog Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Save className="w-5 h-5 text-blue-600" />
                Save Custom Theme
              </h3>
              <button
                onClick={() => setShowCustomDialog(false)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Dialog Content */}
            <div className="p-4 space-y-4">
              {/* Theme Preview */}
              <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
                <div
                  className="w-12 h-12 rounded-full border-2 border-white shadow"
                  style={{ backgroundColor: currentStyle.primaryColor }}
                />
                <div
                  className="w-10 h-10 rounded-full border-2 border-white shadow self-center"
                  style={{ backgroundColor: currentStyle.secondaryColor }}
                />
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow self-center"
                  style={{ backgroundColor: currentStyle.accentColor }}
                />
              </div>

              {/* Theme Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme Name *
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="My Custom Theme"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              {/* Theme Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description (Optional)
                </label>
                <textarea
                  value={customDescription}
                  onChange={(e) => setCustomDescription(e.target.value)}
                  placeholder="A brief description of your theme..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Current Style Info */}
              <div className="text-xs text-gray-500 space-y-1 p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">Current Style:</p>
                <p>Font: {currentStyle.fontFamily}</p>
                <p>Size: {currentStyle.fontSize}px</p>
                <p>Spacing: {currentStyle.spacing}</p>
                <p>Border: {currentStyle.borderStyle || 'none'}</p>
              </div>
            </div>

            {/* Dialog Actions */}
            <div className="flex gap-2 p-4 border-t bg-gray-50">
              <button
                onClick={() => setShowCustomDialog(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateCustomTheme}
                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Theme
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
