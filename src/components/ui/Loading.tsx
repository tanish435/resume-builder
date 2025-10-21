'use client';

import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  label?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12',
};

export function LoadingSpinner({ size = 'md', className = '', label }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 
        className={`${sizeClasses[size]} animate-spin text-blue-600 ${className}`}
        aria-hidden="true"
      />
      {label && (
        <p className="text-sm text-gray-600">{label}</p>
      )}
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function LoadingButton({
  isLoading,
  children,
  className = '',
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { isLoading?: boolean }) {
  return (
    <button
      className={`relative ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-4 h-4 animate-spin" />
        </span>
      )}
      <span className={isLoading ? 'invisible' : ''}>{children}</span>
    </button>
  );
}

export function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <LoadingSpinner size="lg" label={message} />
    </div>
  );
}

export function LoadingSkeleton({ 
  className = '',
  variant = 'default' 
}: { 
  className?: string;
  variant?: 'default' | 'text' | 'circle' | 'rect';
}) {
  const variants = {
    default: 'h-4 w-full rounded',
    text: 'h-4 w-3/4 rounded',
    circle: 'w-12 h-12 rounded-full',
    rect: 'w-full h-32 rounded-lg',
  };

  return (
    <div 
      className={`animate-pulse bg-gray-200 ${variants[variant]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-6 space-y-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-6 w-2/3" />
          <LoadingSkeleton variant="text" />
        </div>
        <LoadingSkeleton variant="circle" className="w-10 h-10" />
      </div>
      <LoadingSkeleton variant="rect" className="h-24" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-20" />
      </div>
    </div>
  );
}
