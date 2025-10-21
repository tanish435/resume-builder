'use client';

import { useEffect } from 'react';
import { X, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const toastStyles = {
  success: {
    bg: 'bg-green-50 border-green-200',
    icon: 'text-green-600',
    text: 'text-green-800',
    IconComponent: CheckCircle,
  },
  error: {
    bg: 'bg-red-50 border-red-200',
    icon: 'text-red-600',
    text: 'text-red-800',
    IconComponent: XCircle,
  },
  info: {
    bg: 'bg-blue-50 border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-800',
    IconComponent: Info,
  },
  warning: {
    bg: 'bg-yellow-50 border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-800',
    IconComponent: AlertTriangle,
  },
};

export function Toast({
  id,
  type,
  message,
  description,
  duration = 5000,
  onClose,
}: ToastProps) {
  const style = toastStyles[type];
  const Icon = style.IconComponent;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  return (
    <div
      className={`${style.bg} border rounded-lg shadow-lg p-4 max-w-md w-full animate-slide-in-right`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`${style.icon} flex-shrink-0 w-5 h-5 mt-0.5`} />
        
        <div className="flex-1 min-w-0">
          <p className={`${style.text} font-semibold text-sm`}>{message}</p>
          {description && (
            <p className={`${style.text} text-sm mt-1 opacity-90`}>
              {description}
            </p>
          )}
        </div>

        <button
          onClick={() => onClose(id)}
          className={`${style.icon} flex-shrink-0 hover:opacity-70 transition-opacity`}
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
