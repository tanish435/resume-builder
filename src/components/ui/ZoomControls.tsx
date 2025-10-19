'use client';

import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setZoom, zoomIn, zoomOut, resetZoom } from '@/store/slices/editorSlice';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

/**
 * Zoom Controls Component
 * Provides buttons to control canvas zoom level
 */
export default function ZoomControls() {
  const dispatch = useAppDispatch();
  const zoom = useAppSelector((state) => state.editor.zoom);

  // Predefined zoom levels
  const zoomLevels = [0.5, 0.75, 1.0, 1.25, 1.5];

  const handleZoomChange = (level: number) => {
    dispatch(setZoom(level));
  };

  return (
    <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-2 no-print">
      {/* Zoom Out Button */}
      <button
        onClick={() => dispatch(zoomOut())}
        disabled={zoom <= 0.5}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Zoom Out"
        aria-label="Zoom Out"
      >
        <ZoomOut className="w-4 h-4 text-gray-700" />
      </button>

      {/* Zoom Level Dropdown */}
      <select
        value={zoom}
        onChange={(e) => handleZoomChange(Number(e.target.value))}
        className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        aria-label="Zoom Level"
      >
        {zoomLevels.map((level) => (
          <option key={level} value={level}>
            {Math.round(level * 100)}%
          </option>
        ))}
      </select>

      {/* Zoom In Button */}
      <button
        onClick={() => dispatch(zoomIn())}
        disabled={zoom >= 2.0}
        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        title="Zoom In"
        aria-label="Zoom In"
      >
        <ZoomIn className="w-4 h-4 text-gray-700" />
      </button>

      {/* Divider */}
      <div className="w-px h-6 bg-gray-300" />

      {/* Reset Zoom Button */}
      <button
        onClick={() => dispatch(resetZoom())}
        className="p-2 rounded hover:bg-gray-100 transition-colors"
        title="Reset Zoom (100%)"
        aria-label="Reset Zoom"
      >
        <Maximize2 className="w-4 h-4 text-gray-700" />
      </button>

      {/* Current Zoom Display */}
      <div className="text-xs text-gray-500 ml-1 min-w-[3rem] text-right">
        {Math.round(zoom * 100)}%
      </div>
    </div>
  );
}
