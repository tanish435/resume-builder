/**
 * Share Slice
 * Redux state management for resume sharing functionality
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ShareLinkResponse } from '@/lib/shareUtils';

/**
 * Share state interface
 */
export interface ShareState {
  // Current share link
  currentShareLink: ShareLinkResponse | null;
  
  // All share links for current resume
  shareLinks: ShareLinkResponse[];
  
  // Loading states
  isCreating: boolean;
  isLoading: boolean;
  isDeactivating: boolean;
  
  // Error handling
  error: string | null;
  
  // UI state
  showShareDialog: boolean;
  copiedToClipboard: boolean;
}

/**
 * Initial state
 */
const initialState: ShareState = {
  currentShareLink: null,
  shareLinks: [],
  isCreating: false,
  isLoading: false,
  isDeactivating: false,
  error: null,
  showShareDialog: false,
  copiedToClipboard: false,
};

/**
 * Async thunk: Create share link
 */
export const createShareLink = createAsyncThunk(
  'share/createShareLink',
  async (
    { resumeId, expiresInDays }: { resumeId: string; expiresInDays?: number | null },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch(`/api/share/${resumeId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expiresInDays: expiresInDays ?? null,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to create share link');
      }

      const result = await response.json();
      
      // Transform API response to ShareLinkResponse format
      if (result.success && result.data) {
        return {
          id: result.data.slug, // Use slug as ID temporarily
          resumeId,
          slug: result.data.slug,
          shareUrl: result.data.url,
          isActive: true,
          expiresAt: result.data.expiresAt ? new Date(result.data.expiresAt) : null,
          viewCount: 0,
          createdAt: new Date(),
        } as ShareLinkResponse;
      }
      
      throw new Error('Invalid response format');
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Async thunk: Fetch share links for a resume
 */
export const fetchShareLinks = createAsyncThunk(
  'share/fetchShareLinks',
  async (resumeId: string, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/share?resumeId=${resumeId}`);

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch share links');
      }

      const data: ShareLinkResponse[] = await response.json();
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Async thunk: Deactivate share link
 */
export const deactivateShareLink = createAsyncThunk(
  'share/deactivateShareLink',
  async (shareId: string, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/share', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareId }),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to deactivate share link');
      }

      return shareId;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

/**
 * Share slice
 */
const shareSlice = createSlice({
  name: 'share',
  initialState,
  reducers: {
    // Show/hide share dialog
    setShowShareDialog: (state, action: PayloadAction<boolean>) => {
      state.showShareDialog = action.payload;
      if (!action.payload) {
        state.error = null;
        state.copiedToClipboard = false;
      }
    },

    // Set copied to clipboard status
    setCopiedToClipboard: (state, action: PayloadAction<boolean>) => {
      state.copiedToClipboard = action.payload;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear current share link
    clearCurrentShareLink: (state) => {
      state.currentShareLink = null;
      state.copiedToClipboard = false;
    },

    // Reset share state
    resetShareState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // Create share link
    builder
      .addCase(createShareLink.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(createShareLink.fulfilled, (state, action) => {
        state.isCreating = false;
        state.currentShareLink = action.payload;
        state.shareLinks.unshift(action.payload); // Add to beginning of list
        state.showShareDialog = true;
      })
      .addCase(createShareLink.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Fetch share links
    builder
      .addCase(fetchShareLinks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchShareLinks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.shareLinks = action.payload;
      })
      .addCase(fetchShareLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Deactivate share link
    builder
      .addCase(deactivateShareLink.pending, (state) => {
        state.isDeactivating = true;
        state.error = null;
      })
      .addCase(deactivateShareLink.fulfilled, (state, action) => {
        state.isDeactivating = false;
        // Update the share link in the list
        const shareId = action.payload;
        state.shareLinks = state.shareLinks.map((link) =>
          link.id === shareId ? { ...link, isActive: false } : link
        );
        // Clear current share link if it was deactivated
        if (state.currentShareLink?.id === shareId) {
          state.currentShareLink = null;
        }
      })
      .addCase(deactivateShareLink.rejected, (state, action) => {
        state.isDeactivating = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const {
  setShowShareDialog,
  setCopiedToClipboard,
  clearError,
  clearCurrentShareLink,
  resetShareState,
} = shareSlice.actions;

// Export reducer
export default shareSlice.reducer;
