'use client';

import { ReactNode, HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'elevated';
}

export function Card({
  children,
  hover = false,
  padding = 'md',
  variant = 'default',
  className = '',
  ...props
}: CardProps) {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const variantClasses = {
    default: 'bg-white border border-gray-200',
    outline: 'bg-transparent border-2 border-gray-300',
    elevated: 'bg-white shadow-md',
  };

  return (
    <div
      className={`
        rounded-lg
        transition-all duration-200
        ${variantClasses[variant]}
        ${paddingClasses[padding]}
        ${hover ? 'card-hover cursor-pointer' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function CardHeader({
  title,
  description,
  action,
  className = '',
}: CardHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 mb-4 ${className}`}>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {description}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

export function CardContent({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`text-sm text-gray-700 ${className}`}>{children}</div>;
}

export function CardFooter({
  children,
  className = '',
  align = 'right',
}: {
  children: ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right' | 'between';
}) {
  const alignClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      className={`
        flex items-center gap-3 mt-4 pt-4 border-t border-gray-200
        ${alignClasses[align]}
        ${className}
      `}
    >
      {children}
    </div>
  );
}

// Specialized card variants
export function ResumeCard({
  title,
  lastModified,
  template,
  thumbnail,
  onClick,
  onEdit,
  onDelete,
  onShare,
}: {
  title: string;
  lastModified: string;
  template: string;
  thumbnail?: string;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onShare?: () => void;
}) {
  return (
    <Card hover onClick={onClick} padding="none" className="overflow-hidden group">
      {/* Thumbnail */}
      <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg
              className="w-16 h-16 text-gray-300"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        )}

        {/* Hover overlay with actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Edit"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          {onShare && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onShare();
              }}
              className="p-2 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Share"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="p-2 bg-white rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              aria-label="Delete"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 truncate mb-1">{title}</h4>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>{template}</span>
          <span>{lastModified}</span>
        </div>
      </div>
    </Card>
  );
}

export function TemplateCard({
  name,
  description,
  preview,
  isSelected,
  onClick,
}: {
  name: string;
  description: string;
  preview?: string;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <Card
      hover
      onClick={onClick}
      padding="none"
      className={`
        overflow-hidden cursor-pointer
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      `}
    >
      {/* Preview */}
      <div className="aspect-[3/4] bg-gray-100 relative">
        {preview ? (
          <img
            src={preview}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-300">{name[0]}</span>
          </div>
        )}
        {isSelected && (
          <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{name}</h4>
        <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
      </div>
    </Card>
  );
}
