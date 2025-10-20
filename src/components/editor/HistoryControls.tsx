import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';
import { useHistory } from '@/hooks/useHistory';

/**
 * HistoryControls Component
 * 
 * Provides undo/redo buttons with:
 * - Visual feedback (disabled state)
 * - Tooltips showing keyboard shortcuts
 * - Last action display
 * - History count indicator
 * 
 * Keyboard Shortcuts:
 * - Ctrl+Z / Cmd+Z: Undo
 * - Ctrl+Y / Cmd+Y / Ctrl+Shift+Z: Redo
 */
export default function HistoryControls() {
  const { canUndo, canRedo, undo, redo, lastAction, historyCount } = useHistory();

  // Detect OS for keyboard shortcut display
  const isMac = typeof window !== 'undefined' && navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const modKey = isMac ? '⌘' : 'Ctrl';

  return (
    <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200">
      {/* Undo Button */}
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
          transition-all duration-200
          ${
            canUndo
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }
        `}
        title={`Undo (${modKey}+Z)`}
        aria-label="Undo last action"
      >
        <Undo2 className="w-4 h-4" />
        <span>Undo</span>
        {historyCount.past > 0 && (
          <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
            {historyCount.past}
          </span>
        )}
      </button>

      {/* Redo Button */}
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`
          flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm
          transition-all duration-200
          ${
            canRedo
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-700 active:scale-95'
              : 'bg-gray-50 text-gray-300 cursor-not-allowed'
          }
        `}
        title={`Redo (${modKey}+Y)`}
        aria-label="Redo last action"
      >
        <Redo2 className="w-4 h-4" />
        <span>Redo</span>
        {historyCount.future > 0 && (
          <span className="text-xs bg-gray-200 px-1.5 py-0.5 rounded">
            {historyCount.future}
          </span>
        )}
      </button>

      {/* Divider */}
      {lastAction && (
        <>
          <div className="h-8 w-px bg-gray-300" />
          
          {/* Last Action Display */}
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="font-medium">Last action:</span>
            <span className="text-gray-700 bg-gray-50 px-2 py-1 rounded">
              {lastAction}
            </span>
          </div>
        </>
      )}

      {/* Help Text */}
      <div className="ml-auto text-xs text-gray-400">
        {modKey}+Z to undo • {modKey}+Y to redo
      </div>
    </div>
  );
}

// Compact version for smaller spaces
export function HistoryControlsCompact() {
  const { canUndo, canRedo, undo, redo } = useHistory();

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={undo}
        disabled={!canUndo}
        className={`
          p-2 rounded-md transition-colors
          ${
            canUndo
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title="Undo (Ctrl+Z)"
        aria-label="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      
      <button
        onClick={redo}
        disabled={!canRedo}
        className={`
          p-2 rounded-md transition-colors
          ${
            canRedo
              ? 'hover:bg-gray-100 text-gray-700'
              : 'text-gray-300 cursor-not-allowed'
          }
        `}
        title="Redo (Ctrl+Y)"
        aria-label="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
}
