import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SectionType } from '@/types/schema';

export type EditorMode = 'view' | 'edit' | 'preview';
export type PanelView = 'sections' | 'styling' | 'templates' | 'export' | 'share';

export interface EditorState {
  mode: EditorMode;
  activePanel: PanelView;
  activeSectionId: string | null;
  selectedElementPath: string | null; // e.g., "sections.0.data.fullName"
  isEditingTitle: boolean;
  isSidebarOpen: boolean;
  zoom: number; // 0.5 to 2.0
  showGrid: boolean;
  showRulers: boolean;
  focusedField: string | null;
  clipboardData: any | null;
}

const initialState: EditorState = {
  mode: 'edit',
  activePanel: 'sections',
  activeSectionId: null,
  selectedElementPath: null,
  isEditingTitle: false,
  isSidebarOpen: true,
  zoom: 1.0,
  showGrid: false,
  showRulers: false,
  focusedField: null,
  clipboardData: null,
};

const editorSlice = createSlice({
  name: 'editor',
  initialState,
  reducers: {
    // Mode control
    setMode: (state, action: PayloadAction<EditorMode>) => {
      state.mode = action.payload;
    },

    // Panel navigation
    setActivePanel: (state, action: PayloadAction<PanelView>) => {
      state.activePanel = action.payload;
    },

    // Section selection
    setActiveSection: (state, action: PayloadAction<string | null>) => {
      state.activeSectionId = action.payload;
      state.selectedElementPath = null; // Clear element selection when changing sections
    },

    // Element selection (for inline editing)
    setSelectedElement: (state, action: PayloadAction<string | null>) => {
      state.selectedElementPath = action.payload;
    },

    // Title editing
    setEditingTitle: (state, action: PayloadAction<boolean>) => {
      state.isEditingTitle = action.payload;
    },

    // Sidebar toggle
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },

    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.isSidebarOpen = action.payload;
    },

    // Zoom controls
    setZoom: (state, action: PayloadAction<number>) => {
      // Clamp zoom between 0.5 and 2.0
      state.zoom = Math.max(0.5, Math.min(2.0, action.payload));
    },

    zoomIn: (state) => {
      state.zoom = Math.min(2.0, state.zoom + 0.1);
    },

    zoomOut: (state) => {
      state.zoom = Math.max(0.5, state.zoom - 0.1);
    },

    resetZoom: (state) => {
      state.zoom = 1.0;
    },

    // View helpers
    toggleGrid: (state) => {
      state.showGrid = !state.showGrid;
    },

    toggleRulers: (state) => {
      state.showRulers = !state.showRulers;
    },

    // Focus management
    setFocusedField: (state, action: PayloadAction<string | null>) => {
      state.focusedField = action.payload;
    },

    // Clipboard operations
    copyToClipboard: (state, action: PayloadAction<any>) => {
      state.clipboardData = action.payload;
    },

    clearClipboard: (state) => {
      state.clipboardData = null;
    },

    // Reset editor
    resetEditor: (state) => {
      return initialState;
    },
  },
});

export const {
  setMode,
  setActivePanel,
  setActiveSection,
  setSelectedElement,
  setEditingTitle,
  toggleSidebar,
  setSidebarOpen,
  setZoom,
  zoomIn,
  zoomOut,
  resetZoom,
  toggleGrid,
  toggleRulers,
  setFocusedField,
  copyToClipboard,
  clearClipboard,
  resetEditor,
} = editorSlice.actions;

export default editorSlice.reducer;
