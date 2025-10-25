'use client';

import { useState, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { Download, FileJson, FileText, Printer, Save, Share2, Loader2, Upload } from 'lucide-react';
import {
  exportResumeSafe,
  PDF_EXPORT_PRESETS,
  checkBrowserSupport,
  type ExportProgress,
} from '@/lib/pdfExportSimple';
import ShareButton from './ShareButton';
import { setResume } from '@/store/slices/resumeSlice';
import { setStyle } from '@/store/slices/styleSlice';
import { initializeHistory } from '@/store/slices/historySlice';

/**
 * Export Controls Component
 * Export resume in various formats (PDF, JSON, print)
 */
export default function ExportControls() {
  const dispatch = useAppDispatch();
  const { currentResume, sections } = useAppSelector((state) => state.resume);
  const { currentStyle } = useAppSelector((state) => state.style);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState<ExportProgress | null>(null);
  const [exportQuality, setExportQuality] = useState<'high' | 'standard' | 'fast'>('standard');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleExportJSON = () => {
    if (!currentResume) return;

    const exportData = {
      resume: currentResume,
      sections,
      style: currentStyle,
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentResume.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportPDF = async () => {
    if (!currentResume || isExporting) return;

    // Check browser support
    const support = checkBrowserSupport();
    if (!support.supported) {
      alert(
        `Your browser doesn't support PDF export:\n\n${support.issues.join('\n')}\n\nPlease use a modern browser like Chrome, Firefox, or Edge.`
      );
      return;
    }

    setIsExporting(true);
    setExportProgress({
      stage: 'preparing',
      progress: 0,
      message: 'Starting export...',
    });

    try {
      // Export using browser's native print dialog
      await exportResumeSafe(
        currentResume.title,
        PDF_EXPORT_PRESETS[exportQuality],
        (progress) => {
          setExportProgress(progress);
        }
      );

      // Reset progress after a delay
      setTimeout(() => {
        setExportProgress(null);
      }, 3000);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to open print dialog. Please try again.');
      setExportProgress(null);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    // Save to localStorage and download as JSON backup
    if (!currentResume) return;

    try {
      const saveData = {
        resume: currentResume,
        sections,
        style: currentStyle,
        savedAt: new Date().toISOString(),
      };

      // Save to localStorage
      localStorage.setItem(`resume-${currentResume.id}`, JSON.stringify(saveData));

      // Also download as JSON file for backup
      const blob = new Blob([JSON.stringify(saveData, null, 2)], {
        type: 'application/json',
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      a.download = `${currentResume.title.replace(/\s+/g, '-').toLowerCase()}-${timestamp}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('✅ Resume saved successfully!\n\n• Saved to browser storage\n• Downloaded as JSON backup file');
    } catch (error) {
      console.error('Save failed:', error);
      alert('❌ Failed to save resume. Please try again.');
    }
  };

  const handleLoadJSON = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        // Validate the data structure
        if (!data.resume || !data.sections) {
          throw new Error('Invalid resume file format');
        }

        // Load the resume into Redux store
        dispatch(setResume({ ...data.resume, sections: data.sections }));
        
        // Load style if available
        if (data.style) {
          dispatch(setStyle(data.style));
        }

        // Initialize history with loaded data
        dispatch(initializeHistory({
          resume: data.resume,
          sections: data.sections,
          style: data.style || currentStyle,
          template: data.resume.templateId,
        }));

        alert('✅ Resume loaded successfully!');
      } catch (error) {
        console.error('Load failed:', error);
        alert('❌ Failed to load resume file. Please make sure it\'s a valid JSON file exported from this application.');
      }
    };

    reader.readAsText(file);
    
    // Reset input value so same file can be selected again
    if (event.target) {
      event.target.value = '';
    }
  };

  return (
    <div className="export-controls space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Download className="w-5 h-5" />
          Export & Save
        </h3>
        <p className="text-xs text-gray-500 mt-1">Download or share your resume</p>
      </div>

      {/* Export Options */}
      <div className="space-y-3">
        {/* Export PDF - NOW ENABLED */}
        <div className="space-y-2">
          <button
            onClick={handleExportPDF}
            disabled={isExporting || !currentResume}
            className="w-full flex items-center gap-3 p-4 bg-white border-2 border-blue-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
              {isExporting ? (
                <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
              ) : (
                <FileText className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-gray-800">Export PDF</h4>
              <p className="text-xs text-gray-600">
                {isExporting ? exportProgress?.message : 'Open print dialog to save as PDF'}
              </p>
            </div>
          </button>

          {/* Quality Selector */}
          {!isExporting && (
            <div className="ml-14 flex gap-2">
              <button
                onClick={() => setExportQuality('fast')}
                className={`flex-1 px-3 py-1.5 text-xs rounded ${
                  exportQuality === 'fast'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Fast
              </button>
              <button
                onClick={() => setExportQuality('standard')}
                className={`flex-1 px-3 py-1.5 text-xs rounded ${
                  exportQuality === 'standard'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Standard
              </button>
              <button
                onClick={() => setExportQuality('high')}
                className={`flex-1 px-3 py-1.5 text-xs rounded ${
                  exportQuality === 'high'
                    ? 'bg-blue-100 text-blue-700 font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                High
              </button>
            </div>
          )}

          {/* Progress Bar */}
          {isExporting && exportProgress && (
            <div className="ml-14 space-y-1">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${exportProgress.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600">{exportProgress.progress}% complete</p>
            </div>
          )}
        </div>

        {/* Print/PDF (Browser) */}
        <button
          onClick={handlePrint}
          className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <Printer className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-800">Print Resume</h4>
            <p className="text-xs text-gray-600">Browser print (Ctrl+P)</p>
          </div>
        </button>

        {/* Export JSON */}
        <button
          onClick={handleExportJSON}
          className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
            <FileJson className="w-5 h-5 text-green-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-800">Export JSON</h4>
            <p className="text-xs text-gray-600">Download as JSON file</p>
          </div>
        </button>

        {/* Save Locally */}
        <button
          onClick={handleSave}
          className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Save className="w-5 h-5 text-purple-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-800">Save Locally</h4>
            <p className="text-xs text-gray-600">Save to browser & download backup</p>
          </div>
        </button>

        {/* Load from File */}
        <button
          onClick={handleLoadJSON}
          className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-200 transition-colors">
            <Upload className="w-5 h-5 text-orange-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-800">Load Resume</h4>
            <p className="text-xs text-gray-600">Import from JSON file</p>
          </div>
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Share Online */}
        <div className="w-full">
          <ShareButton />
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>💡 PDF Export:</strong> Click "Export PDF" to open your browser's print dialog. 
            Then select <strong>"Save as PDF"</strong> as the destination to download your resume.
          </p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-xs text-purple-800">
            <strong>Save & Load:</strong> "Save Locally" stores your resume in browser storage AND downloads a JSON backup file. Use "Load Resume" to import a previously saved JSON file.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            <strong>📄 Print Tips:</strong>
          </p>
          <ul className="text-xs text-green-700 mt-1 space-y-0.5 ml-4 list-disc">
            <li>In the print dialog, choose "Save as PDF" as destination</li>
            <li>Make sure "Background graphics" is enabled</li>
            <li>Use "Portrait" orientation for best results</li>
          </ul>
        </div>
      </div>

      {/* Resume Info */}
      {currentResume && (
        <div className="pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Resume Info</h4>
          <div className="text-xs text-gray-600 space-y-1">
            <p>
              <strong>Title:</strong> {currentResume.title}
            </p>
            <p>
              <strong>Sections:</strong> {sections.length}
            </p>
            <p>
              <strong>Last Updated:</strong>{' '}
              {new Date(currentResume.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
