/**
 * API Client Service
 * Centralized API calls for the resume builder application
 */

import { Resume, Section } from '@/types/schema';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Resume API
export const resumeApi = {
  /**
   * Create a new resume
   */
  create: async (data: {
    title: string;
    templateId?: string;
  }): Promise<ApiResponse<Resume>> => {
    const response = await fetch('/api/resumes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Get all resumes for the current user
   */
  list: async (): Promise<ApiResponse<Resume[]>> => {
    const response = await fetch('/api/resumes');
    return response.json();
  },

  /**
   * Get a single resume by ID
   */
  get: async (id: string): Promise<ApiResponse<Resume & { sections: Section[] }>> => {
    const response = await fetch(`/api/resumes/${id}`);
    return response.json();
  },

  /**
   * Update a resume
   */
  update: async (
    id: string,
    data: {
      title?: string;
      templateId?: string;
      styleConfig?: any;
      sections?: Section[];
      isPublic?: boolean;
    }
  ): Promise<ApiResponse<Resume>> => {
    const response = await fetch(`/api/resumes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Delete a resume
   */
  delete: async (id: string): Promise<ApiResponse> => {
    const response = await fetch(`/api/resumes/${id}`, {
      method: 'DELETE',
    });
    return response.json();
  },
};

// Share API
export const shareApi = {
  /**
   * Create a share link for a resume
   */
  create: async (
    resumeId: string,
    data: {
      expiresInDays?: number;
      password?: string;
    }
  ): Promise<ApiResponse<{ slug: string; url: string; expiresAt?: string }>> => {
    const response = await fetch(`/api/share/${resumeId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  /**
   * Get share links for a resume
   */
  list: async (resumeId: string): Promise<ApiResponse> => {
    const response = await fetch(`/api/share/${resumeId}`);
    return response.json();
  },

  /**
   * Delete a share link
   */
  delete: async (resumeId: string, shareId: string): Promise<ApiResponse> => {
    const response = await fetch(`/api/share/${resumeId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shareId }),
    });
    return response.json();
  },
};

// Template API
export const templateApi = {
  /**
   * Get all available templates
   */
  list: async (): Promise<ApiResponse> => {
    const response = await fetch('/api/templates');
    return response.json();
  },
};

// Auth API
export const authApi = {
  /**
   * Sign up a new user
   */
  signup: async (data: {
    name: string;
    email: string;
    username: string;
    password: string;
  }): Promise<ApiResponse> => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// Helper function for error handling
export const handleApiError = (error: any): string => {
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unexpected error occurred';
};
