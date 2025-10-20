import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { StyleConfig, StylePreset } from '@/types/schema';
import type { ThemePreset } from '@/lib/themes';

export interface StyleState {
  currentStyle: StyleConfig;
  availablePresets: StylePreset[];
  customStyles: StyleConfig[];
  customThemes: ThemePreset[];
  isLoadingPresets: boolean;
  activePresetId: string | null;
  activeThemeId: string | null;
}

const defaultStyle: StyleConfig = {
  primaryColor: '#2563eb',
  secondaryColor: '#3b82f6',
  textColor: '#1f2937',
  backgroundColor: '#ffffff',
  fontFamily: 'Inter',
  fontSize: 14,
  lineHeight: 1.5,
  spacing: 'normal',
  accentColor: '#60a5fa',
};

const initialState: StyleState = {
  currentStyle: defaultStyle,
  availablePresets: [],
  customStyles: [],
  customThemes: [],
  isLoadingPresets: false,
  activePresetId: null,
  activeThemeId: null,
};

const styleSlice = createSlice({
  name: 'style',
  initialState,
  reducers: {
    // Set complete style config
    setStyle: (state, action: PayloadAction<StyleConfig>) => {
      state.currentStyle = action.payload;
      state.activePresetId = null; // Custom style
    },

    // Update individual style properties
    updatePrimaryColor: (state, action: PayloadAction<string>) => {
      state.currentStyle.primaryColor = action.payload;
      state.activePresetId = null;
    },

    updateSecondaryColor: (state, action: PayloadAction<string>) => {
      state.currentStyle.secondaryColor = action.payload;
      state.activePresetId = null;
    },

    updateTextColor: (state, action: PayloadAction<string>) => {
      state.currentStyle.textColor = action.payload;
      state.activePresetId = null;
    },

    updateBackgroundColor: (state, action: PayloadAction<string>) => {
      state.currentStyle.backgroundColor = action.payload;
      state.activePresetId = null;
    },

    updateAccentColor: (state, action: PayloadAction<string>) => {
      state.currentStyle.accentColor = action.payload;
      state.activePresetId = null;
    },

    updateFontFamily: (state, action: PayloadAction<string>) => {
      state.currentStyle.fontFamily = action.payload;
      state.activePresetId = null;
    },

    updateFontSize: (state, action: PayloadAction<number>) => {
      state.currentStyle.fontSize = action.payload;
      state.activePresetId = null;
    },

    updateLineHeight: (state, action: PayloadAction<number>) => {
      state.currentStyle.lineHeight = action.payload;
      state.activePresetId = null;
    },

    updateSpacing: (
      state,
      action: PayloadAction<'compact' | 'normal' | 'relaxed'>
    ) => {
      state.currentStyle.spacing = action.payload;
      state.activePresetId = null;
    },

    updateBorderStyle: (
      state,
      action: PayloadAction<'none' | 'solid' | 'dashed' | undefined>
    ) => {
      state.currentStyle.borderStyle = action.payload;
      state.activePresetId = null;
    },

    updateBorderColor: (state, action: PayloadAction<string | undefined>) => {
      state.currentStyle.borderColor = action.payload;
      state.activePresetId = null;
    },

    // Presets
    setAvailablePresets: (state, action: PayloadAction<StylePreset[]>) => {
      state.availablePresets = action.payload;
    },

    applyPreset: (state, action: PayloadAction<string>) => {
      const preset = state.availablePresets.find((p) => p.id === action.payload);
      if (preset) {
        state.currentStyle = preset.config as StyleConfig;
        state.activePresetId = preset.id;
      }
    },

    // Custom styles
    saveCustomStyle: (state, action: PayloadAction<StyleConfig>) => {
      state.customStyles.push(action.payload);
    },

    deleteCustomStyle: (state, action: PayloadAction<number>) => {
      state.customStyles.splice(action.payload, 1);
    },

    // Loading state
    setLoadingPresets: (state, action: PayloadAction<boolean>) => {
      state.isLoadingPresets = action.payload;
    },

    // Reset to default
    resetStyle: (state) => {
      state.currentStyle = defaultStyle;
      state.activePresetId = null;
      state.activeThemeId = null;
    },

    // Theme actions
    applyTheme: (state, action: PayloadAction<{ themeId: string; config: StyleConfig }>) => {
      state.currentStyle = action.payload.config;
      state.activeThemeId = action.payload.themeId;
      state.activePresetId = null;
    },

    saveCustomTheme: (state, action: PayloadAction<ThemePreset>) => {
      state.customThemes.push(action.payload);
    },

    deleteCustomTheme: (state, action: PayloadAction<string>) => {
      state.customThemes = state.customThemes.filter(
        (theme) => theme.id !== action.payload
      );
      if (state.activeThemeId === action.payload) {
        state.activeThemeId = null;
      }
    },

    updateCustomTheme: (state, action: PayloadAction<ThemePreset>) => {
      const index = state.customThemes.findIndex(
        (theme) => theme.id === action.payload.id
      );
      if (index !== -1) {
        state.customThemes[index] = action.payload;
      }
    },

    // Reset all
    resetStyleState: () => {
      return initialState;
    },
  },
});

export const {
  setStyle,
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
  setAvailablePresets,
  applyPreset,
  saveCustomStyle,
  deleteCustomStyle,
  setLoadingPresets,
  resetStyle,
  applyTheme,
  saveCustomTheme,
  deleteCustomTheme,
  updateCustomTheme,
  resetStyleState,
} = styleSlice.actions;

export default styleSlice.reducer;

// Selectors
export const selectCurrentStyle = (state: { style: StyleState }) =>
  state.style.currentStyle;

export const selectAvailablePresets = (state: { style: StyleState }) =>
  state.style.availablePresets;

export const selectActivePreset = (state: { style: StyleState }) => {
  if (!state.style.activePresetId) return null;
  return state.style.availablePresets.find(
    (p) => p.id === state.style.activePresetId
  );
};
