/**
 * useTemplateTransition Hook
 * Manages smooth transitions between templates
 */

import { useEffect, useState, useCallback } from 'react';

interface TransitionState {
  isTransitioning: boolean;
  previousTemplateId: string | null;
  currentTemplateId: string;
}

export function useTemplateTransition(templateId: string) {
  const [state, setState] = useState<TransitionState>({
    isTransitioning: false,
    previousTemplateId: null,
    currentTemplateId: templateId,
  });

  useEffect(() => {
    if (state.currentTemplateId !== templateId) {
      // Start transition
      setState((prev) => ({
        ...prev,
        isTransitioning: true,
        previousTemplateId: prev.currentTemplateId,
        currentTemplateId: templateId,
      }));

      // End transition after animation duration
      const timer = setTimeout(() => {
        setState((prev) => ({
          ...prev,
          isTransitioning: false,
        }));
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [templateId, state.currentTemplateId]);

  return state;
}

/**
 * useTemplatePreservation Hook
 * Ensures data is preserved when switching templates
 */
export function useTemplatePreservation() {
  const [preservedData, setPreservedData] = useState<any>(null);

  const preserveData = useCallback((data: any) => {
    setPreservedData(data);
  }, []);

  const restoreData = useCallback(() => {
    return preservedData;
  }, [preservedData]);

  const clearData = useCallback(() => {
    setPreservedData(null);
  }, []);

  return {
    preservedData,
    preserveData,
    restoreData,
    clearData,
  };
}

/**
 * useTemplateHistory Hook
 * Track template switching history
 */
export function useTemplateHistory() {
  const [history, setHistory] = useState<string[]>([]);

  const addToHistory = useCallback((templateId: string) => {
    setHistory((prev) => [...prev, templateId].slice(-10)); // Keep last 10
  }, []);

  const canGoBack = history.length > 1;

  const goBack = useCallback(() => {
    if (canGoBack) {
      const newHistory = [...history];
      newHistory.pop(); // Remove current
      const previous = newHistory[newHistory.length - 1];
      setHistory(newHistory);
      return previous;
    }
    return null;
  }, [history, canGoBack]);

  return {
    history,
    addToHistory,
    canGoBack,
    goBack,
  };
}
