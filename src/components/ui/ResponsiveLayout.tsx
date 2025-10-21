'use client';

import { ReactNode, useState } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface ResponsiveLayoutProps {
  sidebar: ReactNode;
  main: ReactNode;
  header?: ReactNode;
  sidebarWidth?: string;
  collapsible?: boolean;
  defaultCollapsed?: boolean;
}

export function ResponsiveLayout({
  sidebar,
  main,
  header,
  sidebarWidth = '320px',
  collapsible = true,
  defaultCollapsed = false,
}: ResponsiveLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(!defaultCollapsed);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      {header && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>

              {/* Desktop Sidebar Toggle */}
              {collapsible && (
                <button
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {isSidebarOpen ? (
                    <ChevronLeft className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              )}

              <div className="flex-1">{header}</div>
            </div>
          </div>
        </header>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed lg:relative inset-y-0 left-0 z-40
            bg-white border-r border-gray-200
            transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:translate-x-0
            ${!isSidebarOpen && 'lg:hidden'}
            w-full sm:w-80 lg:w-[${sidebarWidth}]
            overflow-y-auto custom-scrollbar
          `}
          style={{ width: isMobileMenuOpen ? '100%' : undefined }}
        >
          <div className="h-full">
            {/* Mobile Close Button */}
            <div className="lg:hidden flex justify-end p-4 border-b">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {sidebar}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar bg-gray-50">
          <div className="h-full">{main}</div>
        </main>
      </div>
    </div>
  );
}

// Mobile-friendly panel component
export function MobilePanel({
  title,
  children,
  isOpen,
  onClose,
}: {
  title: string;
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-x-0 bottom-0 bg-white rounded-t-2xl shadow-xl animate-slide-in-bottom max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
}

// Responsive grid container
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 4,
  className = '',
}: {
  children: ReactNode;
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  className?: string;
}) {
  const gridClasses = `
    grid
    grid-cols-${cols.sm || 1}
    md:grid-cols-${cols.md || 2}
    lg:grid-cols-${cols.lg || 3}
    xl:grid-cols-${cols.xl || 4}
    gap-${gap}
    ${className}
  `;

  return <div className={gridClasses}>{children}</div>;
}

// Container with responsive padding
export function Container({
  children,
  size = 'default',
  className = '',
}: {
  children: ReactNode;
  size?: 'sm' | 'default' | 'lg' | 'full';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'max-w-3xl',
    default: 'max-w-5xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
