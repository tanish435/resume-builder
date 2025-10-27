'use client';

import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addSection, deleteSection, reorderSections, toggleSectionVisibility } from '@/store/slices/resumeSlice';
import { SectionType, Section } from '@/types/schema';
import { GripVertical, Plus, Eye, EyeOff, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

/**
 * Section Manager Component
 * Add, remove, reorder, and toggle visibility of resume sections with drag-and-drop
 */
export default function SectionManager() {
  const dispatch = useAppDispatch();
  const { sections, currentResume } = useAppSelector((state) => state.resume);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Sort sections by order
  const sortedSections = [...sections].sort((a, b) => a.order - b.order);

  // Configure drag sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = sortedSections.findIndex((s) => s.id === active.id);
      const newIndex = sortedSections.findIndex((s) => s.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        dispatch(reorderSections({ fromIndex: oldIndex, toIndex: newIndex }));
      }
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
  };

  // Available section types to add
  const availableSectionTypes = [
    { type: SectionType.EXPERIENCE, label: 'Work Experience', icon: '💼' },
    { type: SectionType.EDUCATION, label: 'Education', icon: '🎓' },
    { type: SectionType.SKILLS, label: 'Skills', icon: '🔧' },
    { type: SectionType.PROJECTS, label: 'Projects', icon: '📁' },
    { type: SectionType.CERTIFICATIONS, label: 'Certifications', icon: '🏆' },
    { type: SectionType.LANGUAGES, label: 'Languages', icon: '🌐' },
    { type: SectionType.INTERESTS, label: 'Interests', icon: '❤️' },
    { type: SectionType.CUSTOM, label: 'Custom Section', icon: '📝' },
  ];

  const handleAddSection = (type: SectionType) => {
    if (!currentResume) return;

    const newSection: Section = {
      id: `section-${Date.now()}`,
      resumeId: currentResume.id,
      type,
      data: getDefaultDataForType(type),
      order: sections.length,
      isVisible: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addSection(newSection));
    setShowAddMenu(false);
  };

  const handleRemoveSection = (sectionId: string) => {
    if (confirm('Are you sure you want to remove this section?')) {
      dispatch(deleteSection(sectionId));
    }
  };

  const handleToggleVisibility = (sectionId: string) => {
    dispatch(toggleSectionVisibility(sectionId));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    dispatch(reorderSections({ fromIndex: index, toIndex: index - 1 }));
  };

  const handleMoveDown = (index: number) => {
    if (index === sortedSections.length - 1) return;
    dispatch(reorderSections({ fromIndex: index, toIndex: index + 1 }));
  };

  const activeSectionData = activeId
    ? sortedSections.find((s) => s.id === activeId)
    : null;

  return (
    <div className="section-manager space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Sections</h3>
        <button
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Section
        </button>
      </div>

      {/* Add Section Menu */}
      {showAddMenu && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-2">
          <p className="text-xs text-gray-600 font-medium mb-2">Choose a section type:</p>
          <div className="grid grid-cols-1 gap-2">
            {availableSectionTypes.map((sectionType) => (
              <button
                key={sectionType.type}
                onClick={() => handleAddSection(sectionType.type)}
                className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
              >
                <span className="text-xl">{sectionType.icon}</span>
                <span className="text-sm text-gray-700">{sectionType.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Section List with Drag & Drop */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={handleDragCancel}
      >
        <SortableContext
          items={sortedSections.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {sortedSections.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <p className="text-sm">No sections yet</p>
                <p className="text-xs mt-1">Click "Add Section" to get started</p>
              </div>
            ) : (
              sortedSections.map((section, index) => (
                <SortableSection
                  key={section.id}
                  section={section}
                  index={index}
                  totalSections={sortedSections.length}
                  onToggleVisibility={handleToggleVisibility}
                  onRemove={handleRemoveSection}
                  onMoveUp={handleMoveUp}
                  onMoveDown={handleMoveDown}
                />
              ))
            )}
          </div>
        </SortableContext>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeId && activeSectionData ? (
            <div className="bg-white border-2 border-blue-500 rounded-lg shadow-lg opacity-95">
              <SectionCard
                section={activeSectionData}
                index={sortedSections.findIndex((s) => s.id === activeId)}
                totalSections={sortedSections.length}
                onToggleVisibility={() => {}}
                onRemove={() => {}}
                onMoveUp={() => {}}
                onMoveDown={() => {}}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <p className="text-xs text-blue-800">
          <strong>Tip:</strong> Drag sections to reorder them, or use the arrow buttons. Personal
          Info section cannot be removed.
        </p>
      </div>
    </div>
  );
}

/**
 * Sortable Section Component
 */
interface SortableSectionProps {
  section: Section;
  index: number;
  totalSections: number;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
}

function SortableSection({
  section,
  index,
  totalSections,
  onToggleVisibility,
  onRemove,
  onMoveUp,
  onMoveDown,
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <SectionCard
        section={section}
        index={index}
        totalSections={totalSections}
        onToggleVisibility={onToggleVisibility}
        onRemove={onRemove}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        dragListeners={listeners}
        dragAttributes={attributes}
      />
    </div>
  );
}

/**
 * Section Card Component
 */
interface SectionCardProps {
  section: Section;
  index: number;
  totalSections: number;
  onToggleVisibility: (id: string) => void;
  onRemove: (id: string) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  dragListeners?: any;
  dragAttributes?: any;
  isDragging?: boolean;
}

function SectionCard({
  section,
  index,
  totalSections,
  onToggleVisibility,
  onRemove,
  onMoveUp,
  onMoveDown,
  dragListeners,
  dragAttributes,
  isDragging = false,
}: SectionCardProps) {
  const isProtected = section.type === SectionType.PERSONAL_INFO;

  return (
    <div
      className={`group flex items-center gap-2 p-3 bg-white border rounded-lg transition-all ${
        isDragging
          ? 'border-blue-500 shadow-lg'
          : section.isVisible
          ? 'border-gray-200 hover:border-blue-300'
          : 'border-gray-100 bg-gray-50 opacity-60'
      }`}
    >
      {/* Drag Handle */}
      {!isProtected && (
        <button
          {...dragListeners}
          {...dragAttributes}
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 touch-none"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      )}

      {isProtected && (
        <div className="w-4 h-4"></div>
      )}

      {/* Section Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">
          {formatSectionType(section.type)}
        </p>
        <p className="text-xs text-gray-500">Order: {index + 1}</p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        {/* Move Up */}
        {!isProtected && (
          <button
            onClick={() => onMoveUp(index)}
            disabled={index === 0}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move up"
          >
            <ChevronUp className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Move Down */}
        {!isProtected && (
          <button
            onClick={() => onMoveDown(index)}
            disabled={index === totalSections - 1}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-30 disabled:cursor-not-allowed"
            title="Move down"
          >
            <ChevronDown className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Toggle Visibility */}
        <button
          onClick={() => onToggleVisibility(section.id)}
          className="p-1 hover:bg-gray-100 rounded"
          title={section.isVisible ? 'Hide section' : 'Show section'}
        >
          {section.isVisible ? (
            <Eye className="w-4 h-4 text-gray-600" />
          ) : (
            <EyeOff className="w-4 h-4 text-gray-400" />
          )}
        </button>

        {/* Delete */}
        {!isProtected && (
          <button
            onClick={() => onRemove(section.id)}
            className="p-1 hover:bg-red-100 rounded"
            title="Remove section"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Get default data structure for a section type
 */
function getDefaultDataForType(type: SectionType): any {
  switch (type) {
    case SectionType.EXPERIENCE:
      return { entries: [] };
    case SectionType.EDUCATION:
      return { entries: [] };
    case SectionType.SKILLS:
      return { categories: [], skills: [] };
    case SectionType.PROJECTS:
      return { entries: [] };
    case SectionType.CERTIFICATIONS:
      return { entries: [] };
    case SectionType.LANGUAGES:
      return { entries: [] };
    case SectionType.INTERESTS:
      return { items: [] };
    case SectionType.SUMMARY:
      return { content: '' };
    case SectionType.CUSTOM:
      return { title: 'Custom Section', content: '' };
    default:
      return {};
  }
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
