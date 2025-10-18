import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Template } from '@/types/schema';

export interface TemplateState {
  activeTemplateId: string;
  availableTemplates: Template[];
  isLoadingTemplates: boolean;
  templateCategories: string[];
  selectedCategory: string | null;
  error: string | null;
}

const initialState: TemplateState = {
  activeTemplateId: 'modern', // Default template
  availableTemplates: [],
  isLoadingTemplates: false,
  templateCategories: ['all', 'modern', 'professional', 'creative', 'minimal'],
  selectedCategory: 'all',
  error: null,
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Set active template
    setActiveTemplate: (state, action: PayloadAction<string>) => {
      state.activeTemplateId = action.payload;
    },

    // Load available templates
    setAvailableTemplates: (state, action: PayloadAction<Template[]>) => {
      state.availableTemplates = action.payload;
      state.isLoadingTemplates = false;
      
      // Extract unique categories
      const categories = new Set<string>(['all']);
      action.payload.forEach((template) => {
        if (template.category) {
          categories.add(template.category);
        }
      });
      state.templateCategories = Array.from(categories);
    },

    // Filter by category
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload;
    },

    // Loading state
    setLoadingTemplates: (state, action: PayloadAction<boolean>) => {
      state.isLoadingTemplates = action.payload;
    },

    // Increment template usage count (for analytics)
    incrementTemplateUsage: (state, action: PayloadAction<string>) => {
      const template = state.availableTemplates.find(
        (t) => t.id === action.payload
      );
      if (template) {
        template.usageCount += 1;
      }
    },

    // Error handling
    setTemplateError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoadingTemplates = false;
    },

    clearTemplateError: (state) => {
      state.error = null;
    },

    // Reset template state
    resetTemplateState: () => {
      return initialState;
    },
  },
});

export const {
  setActiveTemplate,
  setAvailableTemplates,
  setSelectedCategory,
  setLoadingTemplates,
  incrementTemplateUsage,
  setTemplateError,
  clearTemplateError,
  resetTemplateState,
} = templateSlice.actions;

export default templateSlice.reducer;

// Selectors
export const selectActiveTemplate = (state: { template: TemplateState }) => {
  return state.template.availableTemplates.find(
    (t) => t.id === state.template.activeTemplateId
  );
};

export const selectFilteredTemplates = (state: { template: TemplateState }) => {
  const { availableTemplates, selectedCategory } = state.template;
  
  if (!selectedCategory || selectedCategory === 'all') {
    return availableTemplates;
  }
  
  return availableTemplates.filter((t) => t.category === selectedCategory);
};

export const selectTemplatesByCategory = (state: { template: TemplateState }) => {
  const { availableTemplates } = state.template;
  const grouped: Record<string, Template[]> = {};
  
  availableTemplates.forEach((template) => {
    const category = template.category || 'other';
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category].push(template);
  });
  
  return grouped;
};
