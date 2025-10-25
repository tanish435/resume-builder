/**
 * PDF Export Utility
 * Handles PDF generation with proper styling, multi-page support, and print optimization
 * Phase 8.1 Implementation
 */

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Simple PDF export using browser's print functionality
 * More reliable than html2canvas for complex layouts
 */
export async function exportResumeToPDFSimple(
  filename: string = 'resume.pdf'
): Promise<void> {
  // Use the browser's print-to-PDF feature
  // This is more reliable and handles all CSS correctly
  return new Promise((resolve, reject) => {
    try {
      // Trigger browser print dialog
      window.print();
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

export interface PDFExportOptions {
  filename?: string;
  quality?: number; // 0.1 to 1.0
  scale?: number; // DPI multiplier
  multiPage?: boolean;
  format?: 'a4' | 'letter';
  orientation?: 'portrait' | 'landscape';
  compress?: boolean;
}

export interface ExportProgress {
  stage: 'preparing' | 'capturing' | 'generating' | 'complete' | 'error';
  progress: number; // 0-100
  message: string;
}

/**
 * Export resume canvas to PDF with high quality rendering
 */
export async function exportResumeToPDF(
  elementId: string = 'resume-canvas',
  options: PDFExportOptions = {},
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  const {
    filename = 'resume.pdf',
    quality = 0.95,
    scale = 2, // 2x for high quality
    multiPage = true,
    format = 'a4',
    orientation = 'portrait',
    compress = true,
  } = options;

  try {
    // Stage 1: Preparation
    onProgress?.({
      stage: 'preparing',
      progress: 10,
      message: 'Preparing resume for export...',
    });

    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with id "${elementId}" not found`);
    }

    // Get computed dimensions
    const elementHeight = element.scrollHeight;
    const elementWidth = element.scrollWidth;

    // A4 dimensions in mm
    const pageWidth = format === 'a4' ? 210 : 215.9; // A4 or Letter
    const pageHeight = format === 'a4' ? 297 : 279.4;

    // Stage 2: Canvas Capture
    onProgress?.({
      stage: 'capturing',
      progress: 30,
      message: 'Capturing resume layout...',
    });

    // Create high-quality canvas with better error handling
    let canvas;
    try {
      canvas = await html2canvas(element, {
        scale: scale,
        useCORS: true,
        allowTaint: true, // Changed to true to allow cross-origin images
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000, // Increased timeout
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
        ignoreElements: (element) => {
          // Ignore elements with no-print class
          return element.classList?.contains('no-print') || false;
        },
        onclone: (clonedDoc) => {
          // Ensure styles are properly cloned
          const clonedElement = clonedDoc.getElementById(elementId);
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.boxShadow = 'none';
            
            // Remove any problematic elements
            const noPrintElements = clonedElement.querySelectorAll('.no-print');
            noPrintElements.forEach((el) => {
              el.remove();
            });
            
            // Convert modern CSS colors to hex to avoid "lab" color function errors
            const allElements = clonedElement.querySelectorAll('*');
            allElements.forEach((el) => {
              const htmlEl = el as HTMLElement;
              const computedStyle = window.getComputedStyle(htmlEl);
              
              // Convert background colors
              if (computedStyle.backgroundColor && computedStyle.backgroundColor !== 'transparent') {
                htmlEl.style.backgroundColor = computedStyle.backgroundColor;
              }
              
              // Convert text colors
              if (computedStyle.color) {
                htmlEl.style.color = computedStyle.color;
              }
              
              // Convert border colors
              if (computedStyle.borderColor && computedStyle.borderColor !== 'transparent') {
                htmlEl.style.borderColor = computedStyle.borderColor;
              }
            });
          }
        },
      });
    } catch (canvasError) {
      console.error('html2canvas error:', canvasError);
      throw new Error(`Failed to capture resume layout: ${canvasError instanceof Error ? canvasError.message : 'Unknown error'}`);
    }

    onProgress?.({
      stage: 'capturing',
      progress: 60,
      message: 'Processing image data...',
    });

    // Convert canvas to image data
    let imgData;
    try {
      imgData = canvas.toDataURL('image/jpeg', quality);
    } catch (dataUrlError) {
      console.error('toDataURL error:', dataUrlError);
      // Try PNG format as fallback
      try {
        imgData = canvas.toDataURL('image/png');
      } catch (pngError) {
        throw new Error('Failed to convert canvas to image data');
      }
    }

    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    // Stage 3: PDF Generation
    onProgress?.({
      stage: 'generating',
      progress: 70,
      message: 'Generating PDF document...',
    });

    // Initialize PDF
    let pdf;
    try {
      pdf = new jsPDF({
        orientation: orientation,
        unit: 'mm',
        format: format,
        compress: compress,
      });
    } catch (pdfError) {
      console.error('jsPDF initialization error:', pdfError);
      throw new Error('Failed to initialize PDF document');
    }

    if (multiPage && imgHeight > pageHeight) {
      // Multi-page handling
      let heightLeft = imgHeight;
      let position = 0;
      let pageCount = 0;

      while (heightLeft > 0) {
        if (pageCount > 0) {
          pdf.addPage();
        }

        pdf.addImage(
          imgData,
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight,
          undefined,
          'FAST'
        );

        heightLeft -= pageHeight;
        position -= pageHeight;
        pageCount++;

        onProgress?.({
          stage: 'generating',
          progress: 70 + (pageCount * 15),
          message: `Generating page ${pageCount}...`,
        });
      }
    } else {
      // Single page - fit to page
      const finalHeight = Math.min(imgHeight, pageHeight);
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, finalHeight, undefined, 'FAST');
    }

    // Stage 4: Save PDF
    onProgress?.({
      stage: 'generating',
      progress: 95,
      message: 'Finalizing PDF...',
    });

    pdf.save(filename);

    onProgress?.({
      stage: 'complete',
      progress: 100,
      message: 'PDF exported successfully!',
    });
  } catch (error) {
    console.error('PDF Export Error:', error);
    onProgress?.({
      stage: 'error',
      progress: 0,
      message: error instanceof Error ? error.message : 'Failed to export PDF',
    });
    throw error;
  }
}

/**
 * Export with automatic filename based on resume title
 */
export async function exportResumeWithTitle(
  resumeTitle: string,
  options?: PDFExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  const sanitizedTitle = resumeTitle
    .replace(/[^a-z0-9]/gi, '-')
    .replace(/-+/g, '-')
    .toLowerCase();

  const filename = `${sanitizedTitle}-resume.pdf`;

  // Use simple browser print instead
  onProgress?.({
    stage: 'preparing',
    progress: 50,
    message: 'Opening print dialog...',
  });
  
  await exportResumeToPDFSimple(filename);
  
  onProgress?.({
    stage: 'complete',
    progress: 100,
    message: 'Print dialog opened. Select "Save as PDF" to download.',
  });
}

/**
 * Optimize element for PDF export (hide non-printable elements, adjust styles)
 */
export function prepareElementForExport(elementId: string): () => void {
  const element = document.getElementById(elementId);
  if (!element) return () => {};

  // Store original styles
  const originalTransform = element.style.transform;
  const originalBoxShadow = element.style.boxShadow;
  const originalOverflow = element.style.overflow;

  // Optimize for export
  element.style.transform = 'none';
  element.style.boxShadow = 'none';
  element.style.overflow = 'visible';

  // Hide non-printable elements
  const noPrintElements = document.querySelectorAll('.no-print');
  const originalDisplays: string[] = [];

  noPrintElements.forEach((el, index) => {
    const htmlEl = el as HTMLElement;
    originalDisplays[index] = htmlEl.style.display;
    htmlEl.style.display = 'none';
  });

  // Cleanup function to restore original state
  return () => {
    element.style.transform = originalTransform;
    element.style.boxShadow = originalBoxShadow;
    element.style.overflow = originalOverflow;

    noPrintElements.forEach((el, index) => {
      const htmlEl = el as HTMLElement;
      htmlEl.style.display = originalDisplays[index];
    });
  };
}

/**
 * Advanced export with preparation and cleanup
 */
export async function exportResumeSafe(
  resumeTitle: string,
  options?: PDFExportOptions,
  onProgress?: (progress: ExportProgress) => void
): Promise<void> {
  const cleanup = prepareElementForExport('resume-canvas');

  try {
    await exportResumeWithTitle(resumeTitle, options, onProgress);
  } finally {
    // Always cleanup, even if export fails
    cleanup();
  }
}

/**
 * Validate browser support for PDF export
 */
export function checkBrowserSupport(): {
  supported: boolean;
  issues: string[];
} {
  const issues: string[] = [];

  // Check for required APIs
  if (!document.getElementById) {
    issues.push('document.getElementById not supported');
  }

  if (!HTMLCanvasElement.prototype.toDataURL) {
    issues.push('Canvas toDataURL not supported');
  }

  // Check for FileReader (for image loading)
  if (typeof FileReader === 'undefined') {
    issues.push('FileReader not supported');
  }

  return {
    supported: issues.length === 0,
    issues,
  };
}

/**
 * Get estimated PDF size based on canvas dimensions
 */
export function estimatePDFSize(
  elementId: string = 'resume-canvas',
  quality: number = 0.95
): { pages: number; estimatedSizeKB: number } {
  const element = document.getElementById(elementId);
  if (!element) {
    return { pages: 0, estimatedSizeKB: 0 };
  }

  const height = element.scrollHeight;
  const width = element.scrollWidth;

  // A4 height at 96 DPI
  const pageHeightPx = 1123;
  const pages = Math.ceil(height / pageHeightPx);

  // Rough estimation: JPEG quality affects size
  // Typical A4 page at high quality: 200-500 KB
  const avgPageSizeKB = 300 * quality;
  const estimatedSizeKB = pages * avgPageSizeKB;

  return { pages, estimatedSizeKB };
}

/**
 * Export options presets for common use cases
 */
export const PDF_EXPORT_PRESETS = {
  highQuality: {
    quality: 0.95,
    scale: 3,
    multiPage: true,
    compress: false,
  } as PDFExportOptions,

  standard: {
    quality: 0.85,
    scale: 2,
    multiPage: true,
    compress: true,
  } as PDFExportOptions,

  fast: {
    quality: 0.7,
    scale: 1.5,
    multiPage: true,
    compress: true,
  } as PDFExportOptions,

  print: {
    quality: 0.95,
    scale: 3,
    multiPage: true,
    compress: false,
    format: 'a4' as const,
    orientation: 'portrait' as const,
  } as PDFExportOptions,
};
