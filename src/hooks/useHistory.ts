import { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useStore } from 'react-redux';
import { undo, redo, selectCanUndo, selectCanRedo } from '@/store/slices/historySlice';
import { setSections } from '@/store/slices/resumeSlice';
import { setStyle } from '@/store/slices/styleSlice';
import { setActiveTemplate } from '@/store/slices/templateSlice';

/**
 * Custom hook for undo/redo functionality with keyboard shortcuts
 * Handles:
 * - Ctrl+Z / Cmd+Z for undo
 * - Ctrl+Y / Cmd+Y / Ctrl+Shift+Z for redo
 * - State restoration across resume, style, and template slices
 */
export function useHistory() {
  const dispatch = useAppDispatch();
  const store = useStore();
  const canUndo = useAppSelector(selectCanUndo);
  const canRedo = useAppSelector(selectCanRedo);
  const historyState = useAppSelector((state) => state.history);

  // Undo handler with immediate restoration
  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    
    // Dispatch undo
    dispatch(undo());
    
    // Get updated state immediately
    const state: any = store.getState();
    const present = state.history.present;
    
    if (present) {
      // Restore the state with meta flag to prevent history tracking
      if (present.sections) {
        dispatch({
          type: 'resume/setSections',
          payload: present.sections,
          meta: { _isRestoration: true },
        } as any);
      }
      if (present.style) {
        dispatch({
          type: 'style/setStyle',
          payload: present.style,
          meta: { _isRestoration: true },
        } as any);
      }
      if (present.template) {
        dispatch({
          type: 'template/setActiveTemplate',
          payload: present.template,
          meta: { _isRestoration: true },
        } as any);
      }
    }
  }, [canUndo, dispatch, store]);

  // Redo handler with immediate restoration
  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    
    // Dispatch redo
    dispatch(redo());
    
    // Get updated state immediately
    const state: any = store.getState();
    const present = state.history.present;
    
    if (present) {
      // Restore the state with meta flag to prevent history tracking
      if (present.sections) {
        dispatch({
          type: 'resume/setSections',
          payload: present.sections,
          meta: { _isRestoration: true },
        } as any);
      }
      if (present.style) {
        dispatch({
          type: 'style/setStyle',
          payload: present.style,
          meta: { _isRestoration: true },
        } as any);
      }
      if (present.template) {
        dispatch({
          type: 'template/setActiveTemplate',
          payload: present.template,
          meta: { _isRestoration: true },
        } as any);
      }
    }
  }, [canRedo, dispatch, store]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl/Cmd key
      const isCtrlOrCmd = event.ctrlKey || event.metaKey;

      if (!isCtrlOrCmd) return;

      // Undo: Ctrl+Z or Cmd+Z
      if (event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl+Y or Cmd+Y or Ctrl+Shift+Z
      if (
        event.key === 'y' ||
        (event.key === 'z' && event.shiftKey)
      ) {
        event.preventDefault();
        handleRedo();
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleUndo, handleRedo]);

  return {
    canUndo,
    canRedo,
    undo: handleUndo,
    redo: handleRedo,
    lastAction: historyState.lastAction,
    historyCount: {
      past: historyState.past.length,
      future: historyState.future.length,
    },
  };
}
