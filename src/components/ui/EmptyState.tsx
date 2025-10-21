'use client';

import { FileText, Users, Image, File, Inbox, Search, AlertCircle } from 'lucide-react';
import { ReactNode } from 'react';

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        {icon || <Inbox className="w-8 h-8 text-gray-400" />}
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 max-w-md mb-6">{description}</p>

      {(action || secondaryAction) && (
        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <button
              onClick={action.onClick}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button
              onClick={secondaryAction.onClick}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {secondaryAction.label}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// Preset empty states
export function NoResumesFound({ onCreateNew }: { onCreateNew?: () => void }) {
  return (
    <EmptyState
      icon={<FileText className="w-8 h-8 text-gray-400" />}
      title="No resumes yet"
      description="Get started by creating your first resume. Choose from professional templates and customize it to match your style."
      action={onCreateNew ? {
        label: 'Create Your First Resume',
        onClick: onCreateNew,
      } : undefined}
    />
  );
}

export function NoSearchResults({ 
  query, 
  onClearSearch 
}: { 
  query: string; 
  onClearSearch?: () => void;
}) {
  return (
    <EmptyState
      icon={<Search className="w-8 h-8 text-gray-400" />}
      title="No results found"
      description={`We couldn't find any resumes matching "${query}". Try adjusting your search or create a new resume.`}
      action={onClearSearch ? {
        label: 'Clear Search',
        onClick: onClearSearch,
      } : undefined}
    />
  );
}

export function NoTemplates() {
  return (
    <EmptyState
      icon={<File className="w-8 h-8 text-gray-400" />}
      title="No templates available"
      description="Templates are being loaded. Please check back in a moment."
    />
  );
}

export function ErrorState({ 
  error, 
  onRetry 
}: { 
  error: string; 
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      icon={<AlertCircle className="w-8 h-8 text-red-500" />}
      title="Something went wrong"
      description={error || "An unexpected error occurred. Please try again."}
      action={onRetry ? {
        label: 'Try Again',
        onClick: onRetry,
      } : undefined}
    />
  );
}

export function EmptySection({ 
  title, 
  description, 
  onAdd 
}: { 
  title: string; 
  description: string;
  onAdd?: () => void;
}) {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
        <Inbox className="w-6 h-6 text-gray-400" />
      </div>
      <h4 className="text-sm font-semibold text-gray-900 mb-1">{title}</h4>
      <p className="text-xs text-gray-600 mb-4">{description}</p>
      {onAdd && (
        <button
          onClick={onAdd}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          + Add Item
        </button>
      )}
    </div>
  );
}
