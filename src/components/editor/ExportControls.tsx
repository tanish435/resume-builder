'use client';

import { useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import { Download, FileJson, FileText, Printer, Save, Share2 } from 'lucide-react';

/**
 * Export Controls Component
 * Export resume in various formats (PDF, JSON, print)
 */
export default function ExportControls() {
  const { currentResume, sections } = useAppSelector((state) => state.resume);
  const { currentStyle } = useAppSelector((state) => state.style);
  const [isExporting, setIsExporting] = useState(false);

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
    // Note: Actual PDF export would require a library like jsPDF or html2pdf
    // For now, we'll use the browser's print to PDF functionality
    alert(
      'To export as PDF:\n\n1. Click "Print Resume" below\n2. In the print dialog, select "Save as PDF"\n3. Click Save\n\nProfessional PDF export with full formatting will be added in a future update.'
    );
  };

  const handleSave = () => {
    // This would normally save to the backend
    // For now, we'll just save to localStorage
    if (!currentResume) return;

    const saveData = {
      resume: currentResume,
      sections,
      style: currentStyle,
      savedAt: new Date().toISOString(),
    };

    localStorage.setItem(`resume-${currentResume.id}`, JSON.stringify(saveData));
    alert('Resume saved locally!');
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
        {/* Print/PDF */}
        <button
          onClick={handlePrint}
          className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all group"
        >
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
            <Printer className="w-5 h-5 text-blue-600" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-800">Print Resume</h4>
            <p className="text-xs text-gray-600">Print or save as PDF</p>
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
            <p className="text-xs text-gray-600">Save to browser storage</p>
          </div>
        </button>

        {/* Export PDF (Coming Soon) */}
        <button
          onClick={handleExportPDF}
          className="w-full flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-60"
          disabled
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-700">Export PDF</h4>
            <p className="text-xs text-gray-500">Professional PDF (coming soon)</p>
          </div>
        </button>

        {/* Share (Coming Soon) */}
        <button
          className="w-full flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg cursor-not-allowed opacity-60"
          disabled
        >
          <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
            <Share2 className="w-5 h-5 text-gray-500" />
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-semibold text-gray-700">Share Online</h4>
            <p className="text-xs text-gray-500">Public link (coming soon)</p>
          </div>
        </button>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            <strong>Quick PDF Export:</strong> Use the "Print Resume" button and select "Save as
            PDF" in your browser's print dialog.
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-xs text-green-800">
            <strong>Backup Your Data:</strong> Use "Export JSON" to create a backup of your entire
            resume that can be imported later.
          </p>
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
