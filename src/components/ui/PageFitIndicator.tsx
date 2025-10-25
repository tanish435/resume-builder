'use client';

import React from 'react';
import { A4_HEIGHT } from '@/lib/singlePageOptimizer';

interface PageFitIndicatorProps {
  contentHeight: number;
  compressionLevel?: 'comfortable' | 'slight' | 'moderate' | 'heavy';
}

export function PageFitIndicator({ contentHeight, compressionLevel = 'comfortable' }: PageFitIndicatorProps) {
  const overflow = contentHeight - A4_HEIGHT;
  const fits = overflow <= 0;
  const compressionRatio = A4_HEIGHT / contentHeight;

  const getStatusColor = () => {
    if (fits) return 'bg-green-500';
    if (compressionLevel === 'slight') return 'bg-yellow-400';
    if (compressionLevel === 'moderate') return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusText = () => {
    if (fits) return 'Fits on 1 page';
    if (compressionLevel === 'slight') return 'Slight compression applied';
    if (compressionLevel === 'moderate') return 'Moderate compression applied';
    return 'Heavy compression needed';
  };

  const getRecommendation = () => {
    if (fits) return null;
    if (compressionLevel === 'heavy') {
      return 'Consider removing content for better readability';
    }
    return null;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 no-print">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 min-w-[250px]">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="font-semibold text-sm text-gray-900">
            {getStatusText()}
          </span>
        </div>
        
        <div className="text-xs text-gray-600 space-y-1">
          <div className="flex justify-between">
            <span>Content height:</span>
            <span className="font-mono">{Math.round(contentHeight)}px</span>
          </div>
          <div className="flex justify-between">
            <span>A4 target:</span>
            <span className="font-mono">{A4_HEIGHT}px</span>
          </div>
          {!fits && (
            <div className="flex justify-between text-orange-600">
              <span>Overflow:</span>
              <span className="font-mono">+{Math.round(overflow)}px</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Compression:</span>
            <span className="font-mono">{(compressionRatio * 100).toFixed(0)}%</span>
          </div>
        </div>

        {getRecommendation() && (
          <div className="mt-2 pt-2 border-t border-gray-200">
            <p className="text-xs text-orange-600">
              ⚠️ {getRecommendation()}
            </p>
          </div>
        )}

        {/* Visual progress bar */}
        <div className="mt-2">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStatusColor()} transition-all duration-300`}
              style={{ width: `${Math.min(100, (A4_HEIGHT / contentHeight) * 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
