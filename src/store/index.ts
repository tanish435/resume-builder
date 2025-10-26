import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import editorReducer from './slices/editorSlice';
import styleReducer from './slices/styleSlice';
import templateReducer from './slices/templateSlice';
import shareReducer from './slices/shareSlice';
import { autoSaveMiddleware } from './middleware/autoSaveMiddleware';
import { apiSyncMiddleware } from './middleware/apiSyncMiddleware';
import { styleSyncMiddleware } from './middleware/styleSyncMiddleware';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    editor: editorReducer,
    style: styleReducer,
    template: templateReducer,
    share: shareReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.data'],
      },
    })
      .concat(styleSyncMiddleware)  // Must come before apiSyncMiddleware
      .concat(autoSaveMiddleware)
      .concat(apiSyncMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
