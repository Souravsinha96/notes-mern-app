import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { snackbarState } from '../../components/snackbar/snackbarTypes';

const initialState: snackbarState = {
  snackbarOpen: false,
  severity: 'success',
  message: '',
  autoClose: false,
  position: {
    vertical: 'top',
    horizontal: 'right',
  },
};
export const snackbarSlice = createSlice({
  name: 'snackbar',
  initialState,
  reducers: {
    openSnackbar: (state, action: PayloadAction<snackbarState>) => {
      return { ...state, ...action.payload, snackbarOpen: true };
    },
    closeSnackbar: (state) => {
      return { ...state, snackbarOpen: false, message: '' };
    },
  },
});

export const { openSnackbar, closeSnackbar } = snackbarSlice.actions;
export const selectSnackbar = (state: RootState) => state.snackbar;
export default snackbarSlice.reducer;
