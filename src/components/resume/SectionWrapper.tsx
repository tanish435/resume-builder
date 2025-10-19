'use client';

import { ReactNode, useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveSection, setMode } from '@/store/slices/editorSlice';
import { Edit2, Eye, EyeOff } from 'lucide-react';
import { SectionType } from '@/types/schema';

interface SectionWrapperProps {
  sectionId: string;
  sectionType: SectionType;
  children: ReactNode;
  isVisible?: boolean;
}

/**
 * Section Wrapper Component
 * Wraps each resume section with click-to-edit functionality
 */
export default function SectionWrapper({
  sectionId,
  sectionType,
  children,
  isVisible = true,
}: SectionWrapperProps) {
  const dispatch = useAppDispatch();
  const [isHovered, setIsHovered] = useState(false);

  // Redux state
  const { activeSectionId, mode } = useAppSelector((state) => state.editor);
  const isActive = activeSectionId === sectionId;

  const handleClick = () => {
    if (mode === 'preview') return; // Don't allow editing in preview mode
    
    if (isActive) {
      // If already active, deactivate
      dispatch(setActiveSection(null));
    } else {
      // Activate this section
      dispatch(setActiveSection(sectionId));
      dispatch(setMode('edit'));
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`
        relative section-wrapper transition-all duration-200
        ${isActive ? 'ring-2 ring-blue-500 ring-opacity-100' : ''}
        ${isHovered && !isActive && mode !== 'preview' ? 'ring-1 ring-blue-300 ring-opacity-50' : ''}
        ${mode !== 'preview' ? 'cursor-pointer' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-section-id={sectionId}
      data-section-type={sectionType}
    >
      {/* Edit Indicator Overlay */}
      {(isHovered || isActive) && mode !== 'preview' && (
        <div className="absolute -top-8 left-0 z-10 flex items-center gap-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-t-md shadow-md no-print">
          <Edit2 className="w-3 h-3" />
          <span className="font-medium">
            {isActive ? 'Editing' : 'Click to edit'} {formatSectionType(sectionType)}
          </span>
        </div>
      )}

      {/* Visibility Toggle (shown when hovered) */}
      {isHovered && mode !== 'preview' && (
        <div className="absolute -top-8 right-0 z-10 no-print">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement visibility toggle in Phase 4.2
              console.log('Toggle visibility for section:', sectionId);
            }}
            className="bg-gray-700 text-white p-1 rounded-t-md hover:bg-gray-800 transition-colors"
            title={isVisible ? 'Hide section' : 'Show section'}
          >
            {isVisible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          </button>
        </div>
      )}

      {/* Section Content */}
      <div className="pointer-events-auto">
        {children}
      </div>

      {/* Active Section Indicator (Corner Badge) */}
      {isActive && (
        <div className="absolute -top-2 -left-2 w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-md no-print" />
      )}
    </div>
  );
}

/**
 * Format section type for display
 */
function formatSectionType(type: SectionType): string {
  return type
    .split('_')
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(' ');
}
