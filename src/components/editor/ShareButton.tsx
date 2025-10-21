/**
 * ShareButton Component
 * Button and dialog for sharing resume with generated link
 */

'use client';

import { useState } from 'react';
import { Share2, Copy, Check, X, ExternalLink, Clock, Eye } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  createShareLink,
  setShowShareDialog,
  setCopiedToClipboard,
  clearCurrentShareLink,
} from '@/store/slices/shareSlice';

/**
 * ShareButton Component
 */
export default function ShareButton() {
  const dispatch = useAppDispatch();
  const { currentResume } = useAppSelector((state) => state.resume);
  const { 
    currentShareLink, 
    isCreating, 
    error, 
    showShareDialog, 
    copiedToClipboard 
  } = useAppSelector((state) => state.share);

  const [expiresInDays, setExpiresInDays] = useState<number | null>(null);

  /**
   * Handle share button click
   */
  const handleShare = async () => {
    // Debug: Log current resume
    console.log('Share button clicked. Current resume:', currentResume);
    
    if (!currentResume) {
      alert('No resume loaded. Please create or load a resume first.');
      return;
    }

    if (!currentResume.id) {
      alert('Resume ID is missing. Please save your resume first.');
      console.error('Resume exists but has no ID:', currentResume);
      return;
    }

    // Create share link
    try {
      await dispatch(createShareLink({
        resumeId: currentResume.id,
        expiresInDays,
      }));
    } catch (error) {
      console.error('Failed to create share link:', error);
    }
  };

  /**
   * Copy share URL to clipboard
   */
  const handleCopyLink = async () => {
    if (!currentShareLink?.shareUrl) return;

    try {
      await navigator.clipboard.writeText(currentShareLink.shareUrl);
      dispatch(setCopiedToClipboard(true));
      
      // Reset copied status after 3 seconds
      setTimeout(() => {
        dispatch(setCopiedToClipboard(false));
      }, 3000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  /**
   * Close share dialog
   */
  const handleClose = () => {
    dispatch(setShowShareDialog(false));
    dispatch(clearCurrentShareLink());
  };

  /**
   * Open share link in new tab
   */
  const handleOpenLink = () => {
    if (currentShareLink?.shareUrl) {
      window.open(currentShareLink.shareUrl, '_blank');
    }
  };

  return (
    <>
      {/* Share Button - Card Style */}
      <button
        onClick={(e) => {
          e.preventDefault();
          console.log('Share button clicked!', { currentResume, isCreating });
          handleShare();
        }}
        disabled={isCreating || !currentResume}
        className="w-full flex items-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-white"
        title={!currentResume ? 'Please load or create a resume first' : 'Generate shareable link'}
      >
        <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition-colors">
          <Share2 className="w-5 h-5 text-purple-600" />
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-gray-800">
            {isCreating ? 'Generating Link...' : 'Share Online'}
          </h4>
          <p className="text-xs text-gray-600">
            {isCreating ? 'Creating shareable link' : 'Generate public link'}
          </p>
        </div>
      </button>

      {/* Share Dialog */}
      {showShareDialog && currentShareLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-600" />
                Share Your Resume
              </h2>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Message */}
            <p className="text-sm text-gray-600">
              Your resume is now shareable! Anyone with this link can view it.
            </p>

            {/* Share Link Display */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Shareable Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={currentShareLink.shareUrl}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleCopyLink}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    copiedToClipboard
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={copiedToClipboard ? 'Copied!' : 'Copy to clipboard'}
                >
                  {copiedToClipboard ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={handleOpenLink}
                  className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Link Info */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Eye className="w-4 h-4" />
                <span>{currentShareLink.viewCount} views</span>
              </div>
              {currentShareLink.expiresAt ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Expires{' '}
                    {new Date(currentShareLink.expiresAt).toLocaleDateString()}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Clock className="w-4 h-4" />
                  <span>Never expires</span>
                </div>
              )}
            </div>

            {/* Short URL Display */}
            <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <p className="text-xs font-medium text-purple-900 mb-1">
                Short Link
              </p>
              <code className="text-sm text-purple-700 break-all">
                {currentShareLink.slug}
              </code>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleCopyLink}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copiedToClipboard ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && !showShareDialog && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg shadow-lg max-w-md">
          <p className="text-sm font-medium">Failed to generate share link</p>
          <p className="text-xs mt-1">{error}</p>
        </div>
      )}
    </>
  );
}
