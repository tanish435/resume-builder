import { Middleware } from '@reduxjs/toolkit';
import { addSnapshot } from '../slices/historySlice';

// Actions that should trigger history snapshots
const HISTORY_ACTIONS = [
  'resume/updateResumeTitle',
  'resume/updateStyleConfig',
  'resume/updateTemplate',
  'resume/addSection',
  'resume/updateSection',
  'resume/deleteSection',
  'resume/reorderSections',
  'resume/toggleSectionVisibility',
];

export const historyMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Call the next dispatch method in the middleware chain
    const result = next(action);

    // Check if this action should create a history snapshot
    if (HISTORY_ACTIONS.includes(action.type)) {
      const state = store.getState();
      
      // Create snapshot after the action
      store.dispatch(
        addSnapshot({
          resume: state.resume.currentResume,
          sections: state.resume.sections,
          action: getActionDescription(action),
        })
      );
    }

    return result;
  };

// Helper function to get human-readable action descriptions
function getActionDescription(action: any): string {
  switch (action.type) {
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
    default:
      return 'Made changes';
  }
}
