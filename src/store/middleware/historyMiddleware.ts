import { Middleware } from '@reduxjs/toolkit';
import { addSnapshot } from '../slices/historySlice';

// Actions that should trigger history snapshots
const HISTORY_ACTIONS = [
  // Resume actions
  'resume/updateResumeTitle',
  'resume/updateStyleConfig',
  'resume/updateTemplate',
  'resume/addSection',
  'resume/updateSection',
  'resume/deleteSection',
  'resume/reorderSections',
  'resume/toggleSectionVisibility',
  
  // Style actions
  'style/updatePrimaryColor',
  'style/updateSecondaryColor',
  'style/updateAccentColor',
  'style/updateTextColor',
  'style/updateBackgroundColor',
  'style/updateFontFamily',
  'style/updateFontSize',
  'style/updateLineHeight',
  'style/updateSectionSpacing',
  'style/updateBorderStyle',
  'style/updateBorderColor',
  'style/applyTheme',
  
  // Template actions
  'template/setActiveTemplate',
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
function getActionDescription(action: any): string {
  switch (action.type) {
    // Resume actions
    case 'resume/updateResumeTitle':
      return 'Updated resume title';
    case 'resume/updateStyleConfig':
      return 'Updated style configuration';
    case 'resume/updateTemplate':
      return 'Changed template';
    case 'resume/addSection':
      return `Added ${action.payload.type} section`;
    case 'resume/updateSection':
      return 'Updated section';
    case 'resume/deleteSection':
      return 'Deleted section';
    case 'resume/reorderSections':
      return 'Reordered sections';
    case 'resume/toggleSectionVisibility':
      return 'Toggled section visibility';
    
    // Style actions
    case 'style/updatePrimaryColor':
      return 'Changed primary color';
    case 'style/updateSecondaryColor':
      return 'Changed secondary color';
    case 'style/updateAccentColor':
      return 'Changed accent color';
    case 'style/updateTextColor':
      return 'Changed text color';
    case 'style/updateBackgroundColor':
      return 'Changed background color';
    case 'style/updateFontFamily':
      return 'Changed font family';
    case 'style/updateFontSize':
      return 'Changed font size';
    case 'style/updateLineHeight':
      return 'Changed line height';
    case 'style/updateSectionSpacing':
      return 'Changed section spacing';
    case 'style/updateBorderStyle':
      return 'Changed border style';
    case 'style/updateBorderColor':
      return 'Changed border color';
    case 'style/applyTheme':
      return `Applied ${action.payload.themeId} theme`;
    
    // Template actions
    case 'template/setActiveTemplate':
      return `Changed to ${action.payload} template`;
    
    default:
      return 'Made changes';
  }
}
