/**
 * Single Page Optimizer
 * Dynamically adjusts font sizes and spacing to fit resume on one A4 page
 */

// A4 dimensions at 96 DPI
export const A4_WIDTH = 794; // pixels (210mm)
export const A4_HEIGHT = 1123; // pixels (297mm)

export interface OptimizationSettings {
  baseFontSize: number; // in pixels
  headingScale: number; // multiplier for headings
  sectionSpacing: number; // in pixels
  paragraphSpacing: number; // in pixels
  lineHeight: number; // multiplier
}

/**
 * Calculate optimal settings based on content height
 */
export function calculateOptimizedSettings(
  contentHeight: number,
  targetHeight: number = A4_HEIGHT
): OptimizationSettings {
  const overflow = contentHeight - targetHeight;
  
  if (overflow <= 0) {
    // Content fits - use comfortable settings
    return {
      baseFontSize: 11,
      headingScale: 1.3,
      sectionSpacing: 20,
      paragraphSpacing: 12,
      lineHeight: 1.5,
    };
  }
  
  // Calculate compression ratio
  const compressionRatio = targetHeight / contentHeight;
  
  console.log(`[Optimizer] Height: ${contentHeight}px / ${targetHeight}px = ${compressionRatio.toFixed(2)} ratio`);
  
  // Adjust settings based on how much we need to compress
  if (compressionRatio >= 0.85) {
    // Slight compression (85-100%)
    console.log('[Optimizer] Applying SLIGHT compression');
    return {
      baseFontSize: 9.5,
      headingScale: 1.25,
      sectionSpacing: 14,
      paragraphSpacing: 9,
      lineHeight: 1.35,
    };
  } else if (compressionRatio >= 0.70) {
    // Moderate compression (70-85%)
    console.log('[Optimizer] Applying MODERATE compression');
    return {
      baseFontSize: 8.5,
      headingScale: 1.2,
      sectionSpacing: 10,
      paragraphSpacing: 7,
      lineHeight: 1.3,
    };
  } else {
    // Heavy compression (<70%)
    console.log('[Optimizer] Applying HEAVY compression');
    return {
      baseFontSize: 7.5,
      headingScale: 1.15,
      sectionSpacing: 7,
      paragraphSpacing: 5,
      lineHeight: 1.25,
    };
  }
}

/**
 * Apply optimization settings to an element
 */
export function applyOptimizationStyles(
  element: HTMLElement,
  settings: OptimizationSettings
): void {
  // Set CSS custom properties for easy access
  element.style.setProperty('--base-font-size', `${settings.baseFontSize}px`);
  element.style.setProperty('--heading-scale', settings.headingScale.toString());
  element.style.setProperty('--section-spacing', `${settings.sectionSpacing}px`);
  element.style.setProperty('--paragraph-spacing', `${settings.paragraphSpacing}px`);
  element.style.setProperty('--line-height', settings.lineHeight.toString());
  
  // Apply base font size
  element.style.fontSize = `${settings.baseFontSize}px`;
  element.style.lineHeight = settings.lineHeight.toString();
}

/**
 * Get CSS class for optimization level
 */
export function getOptimizationClass(contentHeight: number): string {
  const overflow = contentHeight - A4_HEIGHT;
  
  if (overflow <= 0) return 'fit-comfortable';
  if (overflow < 100) return 'fit-slight-compress';
  if (overflow < 200) return 'fit-moderate-compress';
  return 'fit-heavy-compress';
}

/**
 * Monitor and auto-optimize content
 */
export function setupAutoOptimization(
  canvasId: string = 'resume-canvas',
  callback?: (settings: OptimizationSettings) => void
): () => void {
  const element = document.getElementById(canvasId);
  if (!element) return () => {};

  const optimize = () => {
    const contentHeight = element.scrollHeight;
    const settings = calculateOptimizedSettings(contentHeight);
    applyOptimizationStyles(element, settings);
    callback?.(settings);
  };

  // Initial optimization
  optimize();

  // Observe changes
  const observer = new MutationObserver(optimize);
  observer.observe(element, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Cleanup function
  return () => {
    observer.disconnect();
  };
}
