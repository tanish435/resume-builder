import { configureStore } from '@reduxjs/toolkit';
import resumeReducer from './slices/resumeSlice';
import editorReducer from './slices/editorSlice';
import historyReducer from './slices/historySlice';
import styleReducer from './slices/styleSlice';
import templateReducer from './slices/templateSlice';
import { historyMiddleware } from './middleware/historyMiddleware';
import { autoSaveMiddleware } from './middleware/autoSaveMiddleware';
import { apiSyncMiddleware } from './middleware/apiSyncMiddleware';

export const store = configureStore({
  reducer: {
    resume: resumeReducer,
    editor: editorReducer,
    history: historyReducer,
    style: styleReducer,
    template: templateReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['history/addSnapshot'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp', 'payload.data'],
        // Ignore these paths in the state
        ignoredPaths: ['history.past', 'history.future'],
      },
    })
      .concat(historyMiddleware),
      // Temporarily disabled until API is built
      // .concat(autoSaveMiddleware)
      // .concat(apiSyncMiddleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
