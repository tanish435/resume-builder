/**
 * Public Resume View Page
 * /share/[slug] - View shared resume without authentication
 */

'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Eye, Clock, Share2, Download, ExternalLink, AlertCircle, XCircle, Ban } from 'lucide-react';
import TemplateLoader from '@/components/templates/TemplateLoader';
import { Resume, Section, StyleConfig } from '@/types/schema';

interface ShareLinkData {
  id: string;
  slug: string;
  resumeId: string;
  isActive: boolean;
  expiresAt: string | null;
  viewCount: number;
  lastViewedAt: string;
  createdAt: string;
}

interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  styleConfig: StyleConfig;
  sections: Section[];
}

interface ApiResponse {
  shareLink: ShareLinkData;
  resume: ResumeData;
  message?: string;
}

interface ErrorResponse {
  error: string;
  status?: 'expired' | 'inactive';
  expiresAt?: string;
}

export default function PublicResumePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [shareLink, setShareLink] = useState<ShareLinkData | null>(null);
  const [devMode, setDevMode] = useState(false);

  useEffect(() => {
    if (!slug) return;

    fetchSharedResume();
  }, [slug]);

  const fetchSharedResume = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`/api/share/${slug}`);
      
      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        setError(errorData);
        setLoading(false);
        return;
      }

      const data: ApiResponse = await response.json();
      
      // Check if we're in development mode
      if (data.message) {
        setDevMode(true);
      }

      setShareLink(data.shareLink);
      setResumeData(data.resume);
    } catch (err) {
      console.error('Failed to fetch shared resume:', err);
      setError({ error: 'Failed to load resume. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-gray-600 text-lg">Loading resume...</p>
        </div>
      </div>
    );
  }

  // Error states
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          {/* Icon based on error type */}
          {error.status === 'expired' ? (
            <Clock className="w-16 h-16 text-orange-500 mx-auto" />
          ) : error.status === 'inactive' ? (
            <Ban className="w-16 h-16 text-red-500 mx-auto" />
          ) : (
            <XCircle className="w-16 h-16 text-gray-500 mx-auto" />
          )}

          {/* Error title */}
          <h1 className="text-2xl font-bold text-gray-900">
            {error.status === 'expired' && 'Link Expired'}
            {error.status === 'inactive' && 'Link Deactivated'}
            {!error.status && 'Resume Not Found'}
          </h1>

          {/* Error message */}
          <p className="text-gray-600">
            {error.error}
          </p>

          {/* Additional info */}
          {error.expiresAt && (
            <p className="text-sm text-gray-500">
              This link expired on {new Date(error.expiresAt).toLocaleDateString()}
            </p>
          )}

          {/* Action button */}
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Your Own Resume
          </button>
        </div>
      </div>
    );
  }

  // No data
  if (!resumeData || !shareLink) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto" />
          <h1 className="text-2xl font-bold text-gray-900">No Resume Data</h1>
          <p className="text-gray-600">Unable to load resume information.</p>
          <button
            onClick={() => router.push('/')}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    );
  }

  // Success - Display resume
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Development Mode Banner */}
      {devMode && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <p className="text-sm text-yellow-800 text-center">
            <strong>Development Mode:</strong> Using sample data. Connect database for full functionality.
          </p>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Share2 className="w-6 h-6 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{resumeData.title}</h1>
                <p className="text-sm text-gray-500 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  {shareLink.viewCount} {shareLink.viewCount === 1 ? 'view' : 'views'}
                  {shareLink.expiresAt && (
                    <>
                      <span className="mx-1">•</span>
                      <Clock className="w-4 h-4" />
                      Expires {new Date(shareLink.expiresAt).toLocaleDateString()}
                    </>
                  )}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Print</span>
              </button>
              <button
                onClick={() => router.push('/')}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">Create Your Own</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="py-8">
        <div className="max-w-5xl mx-auto px-4">
          <div 
            id="shared-resume"
            className="bg-white shadow-2xl mx-auto"
            style={{
              width: '794px',
              minHeight: '1123px',
            }}
          >
            <TemplateLoader
              resume={resumeData as Resume}
              sections={resumeData.sections}
              style={resumeData.styleConfig}
              templateId={resumeData.templateId}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              Powered by Resume Builder
            </p>
            <button
              onClick={() => router.push('/')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your own professional resume →
            </button>
          </div>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide header, footer, and actions */
          .sticky,
          button,
          .bg-white.border-t {
            display: none !important;
          }

          /* Full page for resume */
          body {
            margin: 0;
            padding: 0;
          }

          #shared-resume {
            width: 210mm !important;
            min-height: 297mm !important;
            box-shadow: none !important;
            margin: 0 !important;
          }

          /* Remove page margins */
          @page {
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
}
