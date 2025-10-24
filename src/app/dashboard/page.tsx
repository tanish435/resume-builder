'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { resumeApi } from '@/lib/api';
import { Resume } from '@/types/schema';
import { useAppDispatch } from '@/store/hooks';
import { setResume } from '@/store/slices/resumeSlice';
import { setActiveTemplate } from '@/store/slices/templateSlice';
import { setStyle } from '@/store/slices/styleSlice';
import { LoadingSpinner } from '@/components/ui/Loading';
import { EmptyState } from '@/components/ui/EmptyState';

interface ResumeWithSections extends Resume {
  sections: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const dispatch = useAppDispatch();
  
  const [resumes, setResumes] = useState<ResumeWithSections[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  // Fetch user's resumes
  useEffect(() => {
    if (session?.user?.id) {
      fetchResumes();
    }
  }, [session]);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError('');
      const result = await resumeApi.list();
      
      if (result.success && result.data) {
        // Handle nested resumes structure from API
        const resumesData = Array.isArray(result.data) 
          ? result.data 
          : (result.data as any).resumes || [];
        setResumes(resumesData as ResumeWithSections[]);
      } else {
        setError(result.error || 'Failed to load resumes');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateResume = async () => {
    try {
      setIsCreating(true);
      setError('');

      const newResume = {
        title: `Resume ${resumes.length + 1}`,
        templateId: 'modern',
        styleConfig: {
          primaryColor: '#2563eb',
          textColor: '#1f2937',
          backgroundColor: '#ffffff',
          fontFamily: 'Inter, sans-serif',
          fontSize: 14,
          lineHeight: 1.6,
          spacing: 'normal',
        },
        sections: [
          {
            type: 'PERSONAL_INFO',
            data: {
              fullName: 'Your Name',
              title: 'Your Title',
              email: 'your.email@example.com',
              phone: '+1 (555) 000-0000',
              location: 'Your Location',
            },
            order: 0,
            isVisible: true,
          },
          {
            type: 'SUMMARY',
            data: {
              content: 'Write a compelling summary about yourself...',
            },
            order: 1,
            isVisible: true,
          },
        ],
        isPublic: false,
      };

      const result = await resumeApi.create(newResume);
      
      if (result.success && result.data) {
        // Load the new resume into the editor
        const resume = result.data as ResumeWithSections;
        dispatch(setResume(resume));
        dispatch(setActiveTemplate(resume.templateId));
        dispatch(setStyle(resume.styleConfig));
        
        // Navigate to editor
        router.push(`/?resumeId=${resume.id}`);
      } else {
        setError(result.error || 'Failed to create resume');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating resume');
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenResume = async (resume: ResumeWithSections) => {
    try {
      // Load resume data into Redux
      dispatch(setResume(resume));
      dispatch(setActiveTemplate(resume.templateId));
      dispatch(setStyle(resume.styleConfig));
      
      // Navigate to editor
      router.push(`/?resumeId=${resume.id}`);
    } catch (err) {
      console.error('Error opening resume:', err);
    }
  };

  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume? This action cannot be undone.')) {
      return;
    }

    try {
      setDeletingId(resumeId);
      setError('');
      
      const result = await resumeApi.delete(resumeId);
      
      if (result.success) {
        // Remove from local state
        setResumes(resumes.filter(r => r.id !== resumeId));
      } else {
        setError(result.error || 'Failed to delete resume');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while deleting resume');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="xl" label="Loading your resumes..." />
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Resumes</h1>
              <p className="text-sm text-gray-600 mt-1">
                Welcome back, {session?.user?.name}
              </p>
            </div>
            <button
              onClick={handleCreateResume}
              disabled={isCreating}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Resume
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
              <button
                onClick={() => setError('')}
                className="ml-auto -mx-1.5 -my-1.5 bg-red-50 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-100 inline-flex h-8 w-8"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Resume Grid */}
        {resumes.length === 0 ? (
          <EmptyState
            title="No resumes yet"
            description="Create your first resume to get started"
            action={{
              label: "Create Resume",
              onClick: handleCreateResume
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {resumes.map((resume) => (
              <div
                key={resume.id}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900 truncate">
                      {resume.title}
                    </h3>
                    <span
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {resume.templateId}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Last edited: {formatDate(resume.lastEditedAt || resume.updatedAt)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {resume.sections?.length || 0} sections
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleOpenResume(resume)}
                      className="flex-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteResume(resume.id)}
                      disabled={deletingId === resume.id}
                      className="inline-flex justify-center items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deletingId === resume.id ? (
                        <svg className="animate-spin h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
