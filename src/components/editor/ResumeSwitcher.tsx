'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setResume } from '@/store/slices/resumeSlice';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { setStyle } from '@/store/slices/styleSlice';
import { resumeApi } from '@/lib/api';
import { Resume } from '@/types/schema';

interface ResumeWithSections extends Resume {
  sections: any[];
}

export default function ResumeSwitcher() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  
  const currentResume = useAppSelector((state) => state.resume.currentResume);
  const [resumes, setResumes] = useState<ResumeWithSections[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user's resumes
  useEffect(() => {
    if (session?.user?.id && isOpen) {
      fetchResumes();
    }
  }, [session, isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      const result = await resumeApi.list();
      
      if (result.success && result.data) {
        setResumes(result.data as ResumeWithSections[]);
      }
    } catch (err) {
      console.error('Error fetching resumes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSwitchResume = async (resume: ResumeWithSections) => {
    try {
      // Load resume data into Redux
      dispatch(setResume(resume));
      dispatch(setActiveTemplate(resume.templateId));
      dispatch(setStyle(resume.styleConfig));
      
      // Update URL with resumeId
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set('resumeId', resume.id);
      router.push(`/?${currentParams.toString()}`);
      
      setIsOpen(false);
    } catch (err) {
      console.error('Error switching resume:', err);
    }
  };

  const handleViewAllResumes = () => {
    router.push('/dashboard');
  };

  if (!session) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        title="Switch Resume"
      >
        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <span className="max-w-[150px] truncate">
          {currentResume?.title || 'Select Resume'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1 max-h-96 overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-2 border-b border-gray-200">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                My Resumes
              </p>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="px-4 py-8 text-center">
                <svg
                  className="animate-spin h-6 w-6 mx-auto text-blue-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="mt-2 text-sm text-gray-500">Loading resumes...</p>
              </div>
            )}

            {/* Resume List */}
            {!isLoading && resumes.length > 0 && (
              <div className="divide-y divide-gray-100">
                {resumes.map((resume) => (
                  <button
                    key={resume.id}
                    onClick={() => handleSwitchResume(resume)}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                      currentResume?.id === resume.id ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {resume.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(resume.lastEditedAt || resume.updatedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                      {currentResume?.id === resume.id && (
                        <svg
                          className="w-5 h-5 text-blue-600 flex-shrink-0 ml-2"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex items-center mt-2 space-x-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        {resume.templateId}
                      </span>
                      <span className="text-xs text-gray-500">
                        {resume.sections?.length || 0} sections
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && resumes.length === 0 && (
              <div className="px-4 py-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="mt-2 text-sm text-gray-500">No resumes yet</p>
              </div>
            )}

            {/* Footer */}
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                onClick={handleViewAllResumes}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                View All Resumes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
