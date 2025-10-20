import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Resume, Section } from '@/types/schema';

export interface HistorySnapshot {
  resume: Resume | null;
  sections: Section[];
  style?: any; // Style configuration
  template?: string; // Template name
  timestamp: number;
  action: string; // Description of what changed
}

export interface HistoryState {
  past: HistorySnapshot[];
  present: HistorySnapshot | null;
  future: HistorySnapshot[];
  maxHistory: number;
  canUndo: boolean;
  canRedo: boolean;
  lastAction: string; // Last action description for UI
}

const initialState: HistoryState = {
  past: [],
  present: null,
  future: [],
  maxHistory: 50, // Keep last 50 snapshots
  canUndo: false,
  canRedo: false,
  lastAction: '',
};

const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    // Add a new snapshot (called after every change)
    addSnapshot: (
      state,
      action: PayloadAction<{
        resume: Resume | null;
        sections: Section[];
        style?: any;
        template?: string;
        action: string;
      }>
    ) => {
      const { resume, sections, style, template, action: actionDesc } = action.payload;

      // Create new snapshot
      const newSnapshot: HistorySnapshot = {
        resume,
        sections: JSON.parse(JSON.stringify(sections)), // Deep clone
        style: style ? JSON.parse(JSON.stringify(style)) : undefined,
        template,
        timestamp: Date.now(),
        action: actionDesc,
      };

      // If we have a present state, push it to past
      if (state.present) {
        state.past.push(state.present);
        
        // Limit history size
        if (state.past.length > state.maxHistory) {
          state.past.shift(); // Remove oldest
        }
      }

      // Set new present
      state.present = newSnapshot;

      // Clear future (new branch in history)
      state.future = [];

      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = false;
      state.lastAction = actionDesc;
    },

    // Undo action
    undo: (state) => {
      if (state.past.length === 0) return;

      // Move present to future
      if (state.present) {
        state.future.unshift(state.present);
      }

      // Move last past state to present
      const previous = state.past.pop();
      if (previous) {
        state.present = previous;
        state.lastAction = `Undid: ${previous.action}`;
      }

      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },

    // Redo action
    redo: (state) => {
      if (state.future.length === 0) return;

      // Move present to past
      if (state.present) {
        state.past.push(state.present);
      }

      // Move first future state to present
      const next = state.future.shift();
      if (next) {
        state.present = next;
        state.lastAction = `Redid: ${next.action}`;
      }

      // Update flags
      state.canUndo = state.past.length > 0;
      state.canRedo = state.future.length > 0;
    },

    // Clear history
    clearHistory: (state) => {
      state.past = [];
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
      state.lastAction = '';
    },

    // Initialize history with current state
    initializeHistory: (
      state,
      action: PayloadAction<{
        resume: Resume | null;
        sections: Section[];
        style?: any;
        template?: string;
      }>
    ) => {
      const { resume, sections, style, template } = action.payload;
      
      state.present = {
        resume,
        sections: JSON.parse(JSON.stringify(sections)),
        style: style ? JSON.parse(JSON.stringify(style)) : undefined,
        template,
        timestamp: Date.now(),
        action: 'Initial state',
      };
      
      state.past = [];
      state.future = [];
      state.canUndo = false;
      state.canRedo = false;
      state.lastAction = 'Initial state';
    },

    // Set max history size
    setMaxHistory: (state, action: PayloadAction<number>) => {
      state.maxHistory = action.payload;
      
      // Trim past if needed
      if (state.past.length > state.maxHistory) {
        state.past = state.past.slice(-state.maxHistory);
      }
    },

    // Reset history
    resetHistory: () => {
      return initialState;
    },

    // Update last action (for external use)
    updateLastAction: (state, action: PayloadAction<string>) => {
      state.lastAction = action.payload;
    },
  },
});

export const {
  addSnapshot,
  undo,
  redo,
  clearHistory,
  initializeHistory,
  setMaxHistory,
  resetHistory,
  updateLastAction,
} = historySlice.actions;

export default historySlice.reducer;

// Selectors
export const selectCanUndo = (state: { history: HistoryState }) =>
  state.history.canUndo;

export const selectCanRedo = (state: { history: HistoryState }) =>
  state.history.canRedo;

export const selectLastAction = (state: { history: HistoryState }) =>
  state.history.present?.action || '';

export const selectHistoryCount = (state: { history: HistoryState }) => ({
  past: state.history.past.length,
  future: state.history.future.length,
});
