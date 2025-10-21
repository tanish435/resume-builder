'use client';

import { ReactNode, forwardRef, ButtonHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  touchFriendly?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      touchFriendly = true,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const baseStyles = `
      inline-flex items-center justify-center gap-2
      font-medium rounded-lg
      transition-all duration-200
      focus-ring
      disabled:opacity-50 disabled:cursor-not-allowed
      ${fullWidth ? 'w-full' : ''}
      ${touchFriendly ? 'active:scale-95' : 'btn-hover-scale'}
      ${className}
    `;

    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800 shadow-sm',
      outline: 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100',
      ghost: 'text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm min-h-[36px]',
      md: 'px-4 py-2 text-base min-h-[40px]',
      lg: 'px-6 py-3 text-lg min-h-[48px]',
      xl: 'px-8 py-4 text-xl min-h-[56px]',
    };

    // Increase touch target size for mobile
    const touchStyles = touchFriendly ? 'min-h-[44px] sm:min-h-auto' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${touchStyles}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

// Icon button for compact spaces
export const IconButton = forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & { icon: ReactNode; label: string }
>(({ icon, label, size = 'md', touchFriendly = true, className = '', ...props }, ref) => {
  const sizes = {
    sm: 'w-8 h-8 min-w-[36px] min-h-[36px]',
    md: 'w-10 h-10 min-w-[40px] min-h-[40px]',
    lg: 'w-12 h-12 min-w-[48px] min-h-[48px]',
    xl: 'w-14 h-14 min-w-[56px] min-h-[56px]',
  };

  // Ensure minimum 44px touch target on mobile
  const touchStyles = touchFriendly ? 'min-w-[44px] min-h-[44px] sm:min-w-auto sm:min-h-auto' : '';

  return (
    <button
      ref={ref}
      aria-label={label}
      title={label}
      className={`
        inline-flex items-center justify-center
        rounded-lg
        transition-all duration-200
        focus-ring
        hover:bg-gray-100 active:bg-gray-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${touchStyles}
        ${touchFriendly ? 'active:scale-95' : ''}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
});

IconButton.displayName = 'IconButton';

// Button group for related actions
export function ButtonGroup({
  children,
  orientation = 'horizontal',
  fullWidth = false,
  className = '',
}: {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical';
  fullWidth?: boolean;
  className?: string;
}) {
  const orientationStyles = {
    horizontal: 'flex-row',
    vertical: 'flex-col',
  };

  return (
    <div
      className={`
        inline-flex gap-2
        ${orientationStyles[orientation]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      role="group"
    >
      {children}
    </div>
  );
}

// Floating Action Button (FAB) for mobile
export function FloatingActionButton({
  icon,
  label,
  onClick,
  position = 'bottom-right',
  className = '',
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  className?: string;
}) {
  const positions = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`
        fixed ${positions[position]} z-40
        w-14 h-14
        bg-blue-600 text-white
        rounded-full shadow-lg
        flex items-center justify-center
        hover:bg-blue-700 active:scale-95
        transition-all duration-200
        focus-ring
        lg:hidden
        ${className}
      `}
    >
      {icon}
    </button>
  );
}
