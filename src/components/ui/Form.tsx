'use client';

import { forwardRef, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { InfoTooltip } from './Tooltip';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      tooltip,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            {label}
            {tooltip && <InfoTooltip content={tooltip} />}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            className={`
              w-full px-4 py-2.5 sm:py-2
              min-h-[44px] sm:min-h-[40px]
              border rounded-lg
              transition-all duration-200
              focus-ring
              disabled:bg-gray-50 disabled:cursor-not-allowed
              ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
              ${leftIcon ? 'pl-10' : ''}
              ${rightIcon ? 'pr-10' : ''}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
  fullWidth?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      helperText,
      tooltip,
      fullWidth = false,
      resize = 'vertical',
      className = '',
      ...props
    },
    ref
  ) => {
    const resizeClasses = {
      none: 'resize-none',
      vertical: 'resize-y',
      horizontal: 'resize-x',
      both: 'resize',
    };

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            {label}
            {tooltip && <InfoTooltip content={tooltip} />}
          </label>
        )}

        <textarea
          ref={ref}
          className={`
            w-full px-4 py-2.5 sm:py-2
            min-h-[100px]
            border rounded-lg
            transition-all duration-200
            focus-ring
            disabled:bg-gray-50 disabled:cursor-not-allowed
            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${resizeClasses[resize]}
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  tooltip?: string;
  fullWidth?: boolean;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      tooltip,
      fullWidth = false,
      options,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <label className="flex items-center gap-2 mb-2 text-sm font-medium text-gray-700">
            {label}
            {tooltip && <InfoTooltip content={tooltip} />}
          </label>
        )}

        <select
          ref={ref}
          className={`
            w-full px-4 py-2.5 sm:py-2
            min-h-[44px] sm:min-h-[40px]
            border rounded-lg
            transition-all duration-200
            focus-ring
            disabled:bg-gray-50 disabled:cursor-not-allowed
            bg-white
            ${error ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-blue-500'}
            ${className}
          `}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="mt-1.5 text-sm text-red-600">{error}</p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-sm text-gray-600">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, helperText, className = '', ...props }, ref) => {
    return (
      <div>
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            ref={ref}
            type="checkbox"
            className={`
              w-5 h-5 mt-0.5
              min-w-[20px] min-h-[20px]
              rounded border-gray-300
              text-blue-600
              focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              transition-all duration-200
              disabled:cursor-not-allowed disabled:opacity-50
              ${className}
            `}
            {...props}
          />
          <div className="flex-1">
            <span className="text-sm text-gray-700 group-hover:text-gray-900">
              {label}
            </span>
            {helperText && (
              <p className="mt-1 text-xs text-gray-600">{helperText}</p>
            )}
          </div>
        </label>

        {error && (
          <p className="mt-1.5 ml-8 text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';

export interface RadioGroupProps {
  label?: string;
  name: string;
  options: { value: string; label: string; description?: string }[];
  value?: string;
  onChange: (value: string) => void;
  error?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function RadioGroup({
  label,
  name,
  options,
  value,
  onChange,
  error,
  orientation = 'vertical',
}: RadioGroupProps) {
  return (
    <div>
      {label && (
        <label className="block mb-3 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}

      <div
        className={`
          flex gap-4
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap'}
        `}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className="flex items-start gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="w-5 h-5 mt-0.5 min-w-[20px] min-h-[20px] text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            />
            <div className="flex-1">
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                {option.label}
              </span>
              {option.description && (
                <p className="mt-1 text-xs text-gray-600">{option.description}</p>
              )}
            </div>
          </label>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
