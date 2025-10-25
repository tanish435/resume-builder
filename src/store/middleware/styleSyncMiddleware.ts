import { Middleware } from '@reduxjs/toolkit';
import { updateStyleConfig } from '../slices/resumeSlice';

/**
 * Style Sync Middleware
 * 
 * Synchronizes style changes from styleSlice to resumeSlice.styleConfig
 * This ensures that style changes are properly saved to the database
 */

// Actions from styleSlice that should update resumeSlice
const STYLE_ACTIONS = [
  'style/updatePrimaryColor',
  'style/updateSecondaryColor',
  'style/updateTextColor',
  'style/updateBackgroundColor',
  'style/updateAccentColor',
  'style/updateFontFamily',
  'style/updateFontSize',
  'style/updateIndividualFontSize',
  'style/updateLineHeight',
  'style/updateSpacing',
  'style/updateBorderStyle',
  'style/updateBorderColor',
  'style/setStyle',
  'style/applyPreset',
  'style/applyTheme',
];

export const styleSyncMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Check if this is a style action
    if (STYLE_ACTIONS.includes(action.type)) {
      const state = store.getState();
      const { currentStyle } = state.style;
      const { currentResume } = state.resume;

      // Only sync if we have a current resume
      if (currentResume) {
        console.log('[Style Sync] Syncing style to resume:', action.type);
        
        // Update the resume's styleConfig with the current style
        store.dispatch(updateStyleConfig(currentStyle));
      }
    }

    return result;
  };
