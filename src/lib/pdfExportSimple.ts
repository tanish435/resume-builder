/**
 * Simple PDF Export Utility
 * Uses browser's native print functionality - most reliable method
 */

export interface PDFExportOptions {
  filename?: string;
  quality?: 'high' | 'standard' | 'fast';
}

export interface ExportProgress {
  stage: 'preparing' | 'capturing' | 'generating' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
}

/**
 * Export resume to PDF using browser's print dialog
 * This is the most reliable method as it uses the browser's native PDF rendering
 */
export async function exportResumeToPDF(
  resumeTitle: string,
  options: PDFExportOptions = {},
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  try {
    onProgress?.({
      stage: 'preparing',
      progress: 50,
      message: 'Preparing resume for export...',
    });

    // Small delay to show progress
    await new Promise(resolve => setTimeout(resolve, 100));

    onProgress?.({
      stage: 'generating',
      progress: 80,
      message: 'Opening print dialog...',
    });

    // Trigger browser's print dialog
    window.print();

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'Print dialog opened! Select "Save as PDF" as the destination.',
    });
  } catch (error) {
    console.error('PDF Export Error:', error);
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: 'Failed to open print dialog',
    });
    throw error;
  }
}

/**
 * Alias for compatibility with existing code
 */
export async function exportResumeWithTitle(
  resumeTitle: string,
  options?: PDFExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  return exportResumeToPDF(resumeTitle, options, onProgress);
}

/**
 * Alias for compatibility with existing code
 */
export async function exportResumeSafe(
  resumeTitle: string,
  options?: PDFExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  return exportResumeToPDF(resumeTitle, options, onProgress);
}

/**
 * Validate browser support (always supported since we use native print)
 */
export function checkBrowserSupport(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  if (typeof window === 'undefined') {
    issues.push('Not running in browser environment');
  }

  if (typeof window !== 'undefined' && !window.print) {
    issues.push('Browser print not supported');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

/**
 * Export options presets for common use cases
 */
export const PDF_EXPORT_PRESETS = {
  highQuality: {
    quality: 'high' as const,
  },

  standard: {
    quality: 'standard' as const,
  },

  fast: {
    quality: 'fast' as const,
  },

  print: {
    quality: 'high' as const,
  },
};
