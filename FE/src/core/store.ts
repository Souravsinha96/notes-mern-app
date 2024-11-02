import { combineReducers, configureStore } from '@reduxjs/toolkit';
import snackbarReducer from './slices/snackbarSlice';
import loaderReducer from './slices/loaderSlice';
import noteReducer from './slices/noteSlice';
const rootReducer = combineReducers({
  snackbar: snackbarReducer,
  loader: loaderReducer,
  note: noteReducer,
});
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  });
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof rootReducer>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = AppStore['dispatch'];
