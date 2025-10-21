'use client';

import { useState, useCallback } from 'react';
import { ToastProps, ToastType } from '@/components/ui/Toast';

export interface ToastOptions {
  message: string;
  description?: string;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const addToast = useCallback(
    (type: ToastType, options: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      
      const newToast: ToastProps = {
        id,
        type,
        message: options.message,
        description: options.description,
        duration: options.duration,
        onClose: removeToast,
      };

      setToasts((prev) => [...prev, newToast]);
      return id;
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (options: ToastOptions) => addToast('success', options),
    [addToast]
  );

  const error = useCallback(
    (options: ToastOptions) => addToast('error', options),
    [addToast]
  );

  const info = useCallback(
    (options: ToastOptions) => addToast('info', options),
    [addToast]
  );

  const warning = useCallback(
    (options: ToastOptions) => addToast('warning', options),
    [addToast]
  );

  return {
    toasts,
    success,
    error,
    info,
    warning,
    removeToast,
  };
}
