import { Middleware } from '@reduxjs/toolkit';
import { setSaving, saveCompleted, setError } from '../slices/resumeSlice';
import { resumeApi, handleApiError } from '@/lib/api';

// Actions that should trigger auto-save
const AUTO_SAVE_ACTIONS = [
  'resume/updateResumeTitle',
  'resume/updateStyleConfig',
  'resume/updateTemplate',
  'resume/addSection',
  'resume/updateSection',
  'resume/deleteSection',
  'resume/reorderSections',
  'resume/toggleSectionVisibility',
];

let saveTimeout: NodeJS.Timeout | null = null;
const SAVE_DELAY = 2000; // 2 seconds debounce

export const autoSaveMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const result = next(action);

    // Check if this action should trigger auto-save
    if (AUTO_SAVE_ACTIONS.includes(action.type)) {
      // Clear existing timeout
      if (saveTimeout) {
        clearTimeout(saveTimeout);
      }

      // Set new timeout for save
      saveTimeout = setTimeout(async () => {
        const state = store.getState();
        
        // Only save if there are unsaved changes and we have a resume
        if (state.resume.hasUnsavedChanges && state.resume.currentResume) {
          try {
            store.dispatch(setSaving(true));
            
            // Call API to save resume
            await saveResumeToAPI(state);
            
            store.dispatch(saveCompleted());
          } catch (error) {
            store.dispatch(
              setError(
                error instanceof Error ? error.message : 'Failed to save resume'
              )
            );
          }
        }
      }, SAVE_DELAY);
    }

    return result;
  };

// API save function using the API client
async function saveResumeToAPI(state: any): Promise<void> {
  const { currentResume, sections } = state.resume;
  const { currentStyle } = state.style;
  const { activeTemplateId } = state.template;
  
  if (!currentResume) {
    throw new Error('No resume to save');
  }

  // Use the API client to update the resume
  const result = await resumeApi.update(currentResume.id, {
    title: currentResume.title,
    templateId: activeTemplateId,
    styleConfig: currentStyle,
    sections: sections,
    isPublic: currentResume.isPublic,
  });

  if (!result.success) {
    throw new Error(handleApiError(result));
  }
}

// Export for manual save trigger
export const triggerManualSave = async (dispatch: any, state: any) => {
  if (state.resume.currentResume) {
    try {
      dispatch(setSaving(true));
      await saveResumeToAPI(state);
      dispatch(saveCompleted());
    } catch (error) {
      dispatch(
        setError(
          error instanceof Error ? error.message : 'Failed to save resume'
        )
      );
    }
  }
};
