import { Middleware } from '@reduxjs/toolkit';
import { addSnapshot } from '../slices/historySlice';

// Phase 7.2: Comprehensive Actionable Events Tracking
// Track ALL user-initiated changes for undo/redo functionality

const HISTORY_ACTIONS = [
  // ===== TEXT EDITS =====
  'resume/updateResumeTitle',        // Resume title edits
  'resume/updateSection',            // Section content edits (text, dates, descriptions)
  
  // ===== SECTION MANAGEMENT =====
  'resume/addSection',               // Section addition
  'resume/deleteSection',            // Section removal
  'resume/reorderSections',          // Section reordering (drag & drop)
  'resume/toggleSectionVisibility',  // Show/hide sections
  
  // ===== STYLE CHANGES =====
  // Colors
  'style/updatePrimaryColor',        // Primary color changes
  'style/updateSecondaryColor',      // Secondary color changes
  'style/updateAccentColor',         // Accent color changes
  'style/updateTextColor',           // Text color changes
  'style/updateBackgroundColor',     // Background color changes
  'style/updateBorderColor',         // Border color changes
  
  // Typography
  'style/updateFontFamily',          // Font family changes
  'style/updateFontSize',            // Font size adjustments
  'style/updateLineHeight',          // Line height adjustments
  
  // Layout
  'style/updateSectionSpacing',      // Section spacing changes
  'style/updateSpacing',             // Overall spacing (compact/normal/relaxed)
  'style/updateBorderStyle',         // Border style changes
  
  // Themes & Presets
  'style/applyTheme',                // Theme application
  'style/applyPreset',               // Style preset application
  
  // ===== TEMPLATE SWITCHES =====
  'template/setActiveTemplate',      // Template changes
  
  // ===== ADVANCED FEATURES =====
  'resume/updateStyleConfig',        // Direct style config updates
  'resume/updateTemplate',           // Template updates via resume
];

export const historyMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Call the next dispatch method in the middleware chain
    const result = next(action);

    // Don't track history slice actions (prevent infinite loops)
    if (action.type.startsWith('history/')) {
      return result;
    }

    // Don't track restoration actions
    // Check for _isRestoration meta flag that we'll add during undo/redo
    if (action.meta?._isRestoration) {
      return result;
    }

    // Don't track setSections and setStyle when used for restoration
    // (these should have _isRestoration flag, but double-check)
    const lowLevelRestorationActions = [
      'resume/setSections',
      'style/setStyle',
    ];
    
    if (lowLevelRestorationActions.includes(action.type)) {
      return result;
    }

    // Check if this action should create a history snapshot
    if (HISTORY_ACTIONS.includes(action.type)) {
      const state = store.getState();
      
      // Create snapshot after the action
      store.dispatch(
        addSnapshot({
          resume: state.resume.currentResume,
          sections: state.resume.sections,
          style: state.style.currentStyle,
          template: state.template.activeTemplateId,
          action: getActionDescription(action),
        })
      );
    }

    return result;
  };

// Helper function to get human-readable action descriptions
// Phase 7.2: Enhanced descriptions for better history tracking
function getActionDescription(action: any): string {
  switch (action.type) {
    // ===== TEXT EDITS =====
    case 'resume/updateResumeTitle':
      return `Edited resume title: "${action.payload?.substring(0, 30)}${action.payload?.length > 30 ? '...' : ''}"`;
    
    case 'resume/updateSection': {
      // Extract section type or use generic description
      const sectionData = action.payload?.data;
      const sectionType = sectionData?.type || 'section';
      return `Edited ${sectionType} content`;
    }
    
    // ===== SECTION MANAGEMENT =====
    case 'resume/addSection': {
      const sectionType = action.payload?.type || 'section';
      const sectionTitle = action.payload?.title || '';
      return sectionTitle 
        ? `Added ${sectionType}: "${sectionTitle}"`
        : `Added ${sectionType} section`;
    }
    
    case 'resume/deleteSection': {
      // If we have section info in payload, use it
      return 'Deleted section';
    }
    
    case 'resume/reorderSections': {
      const { fromIndex, toIndex } = action.payload || {};
      if (fromIndex !== undefined && toIndex !== undefined) {
        return `Moved section from position ${fromIndex + 1} to ${toIndex + 1}`;
      }
      return 'Reordered sections';
    }
    
    case 'resume/toggleSectionVisibility':
      return 'Toggled section visibility';
    
    // ===== STYLE CHANGES: Colors =====
    case 'style/updatePrimaryColor':
      return `Changed primary color to ${action.payload}`;
    
    case 'style/updateSecondaryColor':
      return `Changed secondary color to ${action.payload}`;
    
    case 'style/updateAccentColor':
      return `Changed accent color to ${action.payload}`;
    
    case 'style/updateTextColor':
      return `Changed text color to ${action.payload}`;
    
    case 'style/updateBackgroundColor':
      return `Changed background color to ${action.payload}`;
    
    case 'style/updateBorderColor':
      return `Changed border color to ${action.payload || 'none'}`;
    
    // ===== STYLE CHANGES: Typography =====
    case 'style/updateFontFamily':
      return `Changed font to ${action.payload}`;
    
    case 'style/updateFontSize':
      return `Changed font size to ${action.payload}px`;
    
    case 'style/updateLineHeight':
      return `Changed line height to ${action.payload}`;
    
    // ===== STYLE CHANGES: Layout =====
    case 'style/updateSectionSpacing':
      return `Changed section spacing to ${action.payload}px`;
    
    case 'style/updateSpacing': {
      const spacingLabels = {
        compact: 'Compact',
        normal: 'Normal',
        relaxed: 'Relaxed'
      };
      return `Changed spacing to ${spacingLabels[action.payload as keyof typeof spacingLabels] || action.payload}`;
    }
    
    case 'style/updateBorderStyle': {
      const borderStyles = {
        none: 'No Border',
        solid: 'Solid',
        dashed: 'Dashed'
      };
      return `Changed border style to ${borderStyles[action.payload as keyof typeof borderStyles] || action.payload}`;
    }
    
    // ===== STYLE CHANGES: Themes & Presets =====
    case 'style/applyTheme': {
      const themeId = action.payload?.themeId || action.payload;
      return `Applied "${themeId}" theme`;
    }
    
    case 'style/applyPreset':
      return `Applied style preset: ${action.payload}`;
    
    // ===== TEMPLATE SWITCHES =====
    case 'template/setActiveTemplate': {
      const templateName = action.payload?.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()) || action.payload;
      return `Switched to ${templateName} template`;
    }
    
    // ===== ADVANCED FEATURES =====
    case 'resume/updateStyleConfig':
      return 'Updated style configuration';
    
    case 'resume/updateTemplate':
      return `Changed template to ${action.payload}`;
    
    // ===== DEFAULT =====
    default:
      return 'Made changes';
  }
}
