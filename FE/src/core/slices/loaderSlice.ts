import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type loaderState = boolean;
const initialState: loaderState = false;
export const loaderSlice = createSlice({
  name: 'loader',
  initialState,
  reducers: {
    toggleLoader: (state) => (state = !state),
  },
});

export const { toggleLoader } = loaderSlice.actions;
export const loader = (state: RootState) => state.loader;
export default loaderSlice.reducer;
