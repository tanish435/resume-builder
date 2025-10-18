import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Resume, Section, StyleConfig } from '@/types/schema';

export interface ResumeState {
  currentResume: Resume | null;
  sections: Section[];
  isLoading: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  hasUnsavedChanges: boolean;
  error: string | null;
}

const initialState: ResumeState = {
  currentResume: null,
  sections: [],
  isLoading: false,
  isSaving: false,
  lastSaved: null,
  hasUnsavedChanges: false,
  error: null,
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Load resume
    setResume: (state, action: PayloadAction<Resume>) => {
      state.currentResume = action.payload;
      state.sections = action.payload.sections || [];
      state.hasUnsavedChanges = false;
      state.error = null;
    },

    // Update resume title
    updateResumeTitle: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.title = action.payload;
        state.hasUnsavedChanges = true;
      }
    },

    // Update resume style config
    updateStyleConfig: (state, action: PayloadAction<StyleConfig>) => {
      if (state.currentResume) {
        state.currentResume.styleConfig = action.payload;
        state.hasUnsavedChanges = true;
      }
    },

    // Update template
    updateTemplate: (state, action: PayloadAction<string>) => {
      if (state.currentResume) {
        state.currentResume.templateId = action.payload;
        state.hasUnsavedChanges = true;
      }
    },

    // Add section
    addSection: (state, action: PayloadAction<Section>) => {
      state.sections.push(action.payload);
      state.hasUnsavedChanges = true;
    },

    // Update section
    updateSection: (
      state,
      action: PayloadAction<{ id: string; data: Partial<Section> }>
    ) => {
      const { id, data } = action.payload;
      const index = state.sections.findIndex((s) => s.id === id);
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], ...data };
        state.hasUnsavedChanges = true;
      }
    },

    // Delete section
    deleteSection: (state, action: PayloadAction<string>) => {
      state.sections = state.sections.filter((s) => s.id !== action.payload);
      state.hasUnsavedChanges = true;
    },

    // Reorder sections
    reorderSections: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const [movedSection] = state.sections.splice(fromIndex, 1);
      state.sections.splice(toIndex, 0, movedSection);
      
      // Update order property
      state.sections.forEach((section, index) => {
        section.order = index;
      });
      
      state.hasUnsavedChanges = true;
    },

    // Toggle section visibility
    toggleSectionVisibility: (state, action: PayloadAction<string>) => {
      const section = state.sections.find((s) => s.id === action.payload);
      if (section) {
        section.isVisible = !section.isVisible;
        state.hasUnsavedChanges = true;
      }
    },

    // Set sections (bulk update)
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.sections = action.payload;
      state.hasUnsavedChanges = true;
    },

    // Loading states
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSaving: (state, action: PayloadAction<boolean>) => {
      state.isSaving = action.payload;
    },

    // Save completed
    saveCompleted: (state) => {
      state.isSaving = false;
      state.hasUnsavedChanges = false;
      state.lastSaved = new Date();
    },

    // Error handling
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSaving = false;
    },

    clearError: (state) => {
      state.error = null;
    },

    // Reset resume
    resetResume: (state) => {
      return initialState;
    },
  },
});

export const {
  setResume,
  updateResumeTitle,
  updateStyleConfig,
  updateTemplate,
  addSection,
  updateSection,
  deleteSection,
  reorderSections,
  toggleSectionVisibility,
  setSections,
  setLoading,
  setSaving,
  saveCompleted,
  setError,
  clearError,
  resetResume,
} = resumeSlice.actions;

export default resumeSlice.reducer;
