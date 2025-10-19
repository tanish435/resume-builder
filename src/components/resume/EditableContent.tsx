'use client';

import { useState, useEffect, useRef, KeyboardEvent, CSSProperties } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateSection } from '@/store/slices/resumeSlice';

interface EditableContentProps {
  sectionId: string;
  fieldPath: string; // e.g., "data.fullName" or "data.entries[0].company"
  value: string;
  placeholder?: string;
  multiline?: boolean;
  className?: string;
  as?: 'span' | 'div' | 'h1' | 'h2' | 'h3' | 'p';
  style?: CSSProperties;
}

/**
 * Editable Content Component
 * Provides inline editing for section content with auto-save
 */
export default function EditableContent({
  sectionId,
  fieldPath,
  value,
  placeholder = 'Click to edit...',
  multiline = false,
  className = '',
  as: Component = 'div',
  style,
}: EditableContentProps) {
  const dispatch = useAppDispatch();
  const contentRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Redux state
  const { activeSectionId } = useAppSelector((state) => state.editor);
  const sections = useAppSelector((state) => state.resume.sections);
  const isActive = activeSectionId === sectionId;

  // Update content only when not editing (to preserve cursor position)
  useEffect(() => {
    if (!isEditing && contentRef.current) {
      contentRef.current.textContent = value;
    }
  }, [value, isEditing]);

  // Focus when section becomes active
  useEffect(() => {
    if (isActive && isEditing && contentRef.current) {
      contentRef.current.focus();
      // Place cursor at end
      const range = document.createRange();
      const selection = window.getSelection();
      if (contentRef.current.childNodes.length > 0) {
        range.selectNodeContents(contentRef.current);
        range.collapse(false);
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
    }
  }, [isActive, isEditing]);

  const handleClick = (e: React.MouseEvent) => {
    if (!isActive) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    saveChanges();
  };

  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    // Don't update state here to preserve cursor position
    // The content is managed by contentEditable itself
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    // Save on Enter (if single-line)
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      contentRef.current?.blur();
    }

    // Cancel on Escape
    if (e.key === 'Escape') {
      e.preventDefault();
      if (contentRef.current) {
        contentRef.current.textContent = value; // Revert to original
      }
      contentRef.current?.blur();
    }
  };

  const saveChanges = () => {
    const newValue = contentRef.current?.textContent || '';
    if (newValue !== value) {
      console.log(`Saving ${fieldPath} for section ${sectionId}:`, newValue);
      
      // Parse the field path to update the correct nested property
      const pathParts = fieldPath.split('.');
      
      if (pathParts[0] === 'data' && pathParts.length === 2) {
        // Simple field like "data.fullName"
        const fieldName = pathParts[1];
        
        // Get the current section
        const currentSection = sections.find((s) => s.id === sectionId);
        
        if (currentSection) {
          // Update the section with new data
          dispatch(updateSection({
            id: sectionId,
            data: {
              ...currentSection,
              data: {
                ...currentSection.data,
                [fieldName]: newValue
              }
            }
          }));
          
          console.log('✅ Successfully saved to Redux!');
        }
      } else {
        // For complex paths, we'll implement this in Phase 4.2
        console.log('Complex path update - will be implemented in Phase 4.2');
      }
    }
  };

  const displayValue = value || placeholder;
  const isEmpty = !value;

  return (
    <Component
      ref={contentRef}
      style={style}
      className={`
        editable-content transition-all duration-150
        ${className}
        ${isActive && !isEditing ? 'hover:bg-blue-50 hover:outline-1 hover:outline-blue-300' : ''}
        ${isEditing ? 'bg-blue-50 outline-2 outline-blue-500' : ''}
        ${isEmpty ? 'text-gray-400 italic' : ''}
        ${isActive ? 'cursor-text' : 'cursor-default'}
      `}
      contentEditable={isActive && isEditing}
      suppressContentEditableWarning
      onClick={handleClick}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      data-field-path={fieldPath}
      role="textbox"
      aria-label={`Edit ${fieldPath}`}
      aria-placeholder={placeholder}
    />
  );
}
