import { Middleware } from '@reduxjs/toolkit';
import { setResume, setSections } from '../slices/resumeSlice';
import { setAvailableTemplates } from '../slices/templateSlice';
import { setAvailablePresets } from '../slices/styleSlice';

/**
 * API Sync Middleware
 * 
 * Handles bidirectional synchronization between Redux store and backend API:
 * - Fetches initial data on app load
 * - Syncs local changes to server
 * - Handles optimistic updates
 * - Manages offline queue
 * - Resolves conflicts
 */

// Queue for offline actions
let offlineQueue: Array<{ action: any; timestamp: number }> = [];
let isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
let syncInProgress = false;

// Track last sync timestamp to avoid duplicate syncs
let lastSyncTimestamp = 0;
const SYNC_THROTTLE = 1000; // 1 second minimum between syncs

// Actions that should trigger API sync
const SYNC_ACTIONS = [
  'resume/setResume',
  'resume/updateResumeTitle',
  'resume/updateStyleConfig',
  'resume/updateTemplate',
  'resume/addSection',
  'resume/updateSection',
  'resume/deleteSection',
  'resume/reorderSections',
  'resume/toggleSectionVisibility',
];

export const apiSyncMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    // Handle online/offline status changes
    if (action.type === 'app/setOnlineStatus') {
      isOnline = action.payload;
      
      // Process offline queue when coming back online
      if (isOnline && offlineQueue.length > 0) {
        processOfflineQueue(store);
      }
    }

    const result = next(action);

    // Check if this action should trigger API sync
    if (SYNC_ACTIONS.includes(action.type)) {
      const now = Date.now();
      
      console.log(`[API Sync] Action detected: ${action.type}`);
      
      // Throttle syncs to avoid overwhelming the server
      if (now - lastSyncTimestamp < SYNC_THROTTLE) {
        console.log('[API Sync] Throttled - too soon after last sync');
        return result;
      }
      
      lastSyncTimestamp = now;

      if (isOnline) {
        // Sync immediately if online
        console.log('[API Sync] Initiating sync...');
        syncToAPI(store, action).catch((error) => {
          console.error('API sync failed:', error);
          // Add to offline queue on failure
          offlineQueue.push({ action, timestamp: now });
        });
      } else {
        // Add to offline queue if offline
        console.log('[API Sync] Offline - adding to queue');
        offlineQueue.push({ action, timestamp: now });
      }
    }

    return result;
  };

/**
 * Sync action to API
 */
async function syncToAPI(store: any, action: any): Promise<void> {
  if (syncInProgress) {
    return; // Prevent concurrent syncs
  }

  syncInProgress = true;

  try {
    const state = store.getState();
    const { currentResume, sections } = state.resume;

    if (!currentResume) {
      syncInProgress = false;
      return;
    }

    // Different sync strategies based on action type
    switch (action.type) {
      case 'resume/setResume':
        await syncFullResume(currentResume, sections);
        break;

      case 'resume/updateResumeTitle':
      case 'resume/updateStyleConfig':
      case 'resume/updateTemplate':
        await syncResumeMetadata(currentResume);
        break;

      case 'resume/addSection':
      case 'resume/updateSection':
      case 'resume/deleteSection':
      case 'resume/reorderSections':
      case 'resume/toggleSectionVisibility':
        await syncSections(currentResume.id, sections);
        break;

      default:
        break;
    }
  } catch (error) {
    console.error('Sync to API failed:', error);
    throw error;
  } finally {
    syncInProgress = false;
  }
}

/**
 * Sync full resume (used on initial load or major changes)
 */
async function syncFullResume(resume: any, sections: any[]): Promise<void> {
  const response = await fetch(`/api/resumes/${resume.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...resume,
      sections,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync full resume');
  }
}

/**
 * Sync resume metadata only (title, template, style)
 */
async function syncResumeMetadata(resume: any): Promise<void> {
  const response = await fetch(`/api/resumes/${resume.id}/metadata`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: resume.title,
      templateId: resume.templateId,
      styleConfig: resume.styleConfig,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to sync resume metadata');
  }
}

/**
 * Sync sections only (more efficient for section changes)
 */
async function syncSections(resumeId: string, sections: any[]): Promise<void> {
  console.log('[API Sync] Syncing sections for resume:', resumeId);
  console.log('[API Sync] Sections data:', JSON.stringify(sections, null, 2));
  
  const response = await fetch(`/api/resumes/${resumeId}/sections`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sections }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('[API Sync] Failed to sync sections. Status:', response.status);
    console.error('[API Sync] Error response:', errorText);
    throw new Error(`Failed to sync sections: ${response.status} - ${errorText}`);
  }
  
  console.log('[API Sync] ✅ Sections synced successfully!');
}

/**
 * Process offline queue when coming back online
 */
async function processOfflineQueue(store: any): Promise<void> {
  if (offlineQueue.length === 0 || syncInProgress) {
    return;
  }

  console.log(`Processing ${offlineQueue.length} offline actions...`);

  const queue = [...offlineQueue];
  offlineQueue = []; // Clear queue

  for (const { action } of queue) {
    try {
      await syncToAPI(store, action);
    } catch (error) {
      console.error('Failed to process offline action:', error);
      // Re-add to queue if still failing
      offlineQueue.push({ action, timestamp: Date.now() });
    }
  }

  if (offlineQueue.length > 0) {
    console.warn(`${offlineQueue.length} actions still in offline queue`);
  } else {
    console.log('All offline actions processed successfully');
  }
}

/**
 * Fetch initial data from API
 */
export async function fetchInitialData(dispatch: any, resumeId?: string): Promise<void> {
  try {
    // Fetch templates
    const templatesResponse = await fetch('/api/templates');
    if (templatesResponse.ok) {
      const templates = await templatesResponse.json();
      dispatch(setAvailableTemplates(templates));
    }

    // Fetch style presets
    const presetsResponse = await fetch('/api/style-presets');
    if (presetsResponse.ok) {
      const presets = await presetsResponse.json();
      dispatch(setAvailablePresets(presets));
    }

    // Fetch specific resume if resumeId provided
    if (resumeId) {
      const resumeResponse = await fetch(`/api/resumes/${resumeId}`);
      if (resumeResponse.ok) {
        const resumeData = await resumeResponse.json();
        dispatch(setResume(resumeData));
        dispatch(setSections(resumeData.sections || []));
      }
    }
  } catch (error) {
    console.error('Failed to fetch initial data:', error);
  }
}

/**
 * Manual sync trigger (for "Save Now" button)
 */
export async function triggerManualSync(dispatch: any, getState: any): Promise<void> {
  const state = getState();
  const { currentResume, sections } = state.resume;

  if (!currentResume) {
    throw new Error('No resume to sync');
  }

  await syncFullResume(currentResume, sections);
}

/**
 * Get offline queue status
 */
export function getOfflineQueueStatus() {
  return {
    isOnline,
    queueLength: offlineQueue.length,
    syncInProgress,
  };
}

/**
 * Clear offline queue (use with caution)
 */
export function clearOfflineQueue() {
  offlineQueue = [];
}

/**
 * Setup online/offline listeners (call in app initialization)
 */
export function setupOnlineListeners(dispatch: any) {
  if (typeof window === 'undefined') {
    return; // Skip in SSR
  }

  window.addEventListener('online', () => {
    console.log('Network: Online');
    dispatch({ type: 'app/setOnlineStatus', payload: true });
  });

  window.addEventListener('offline', () => {
    console.log('Network: Offline');
    dispatch({ type: 'app/setOnlineStatus', payload: false });
  });
}

