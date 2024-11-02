import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { SimplifiedNote } from '../../pages/notes/notesTypes';
const initialState: SimplifiedNote = {
  tags: [],
  title: '',
  _id: '',
  body: '',
  important: false,
  createdAt: '',
  updatedAt: '',
};
const selectedNoteSlice = createSlice({
  name: 'selectedNote',
  initialState,
  reducers: {
    setSelectedNote: (_, action: PayloadAction<SimplifiedNote>) => {
      return action.payload;
    },
  },
});

export const { setSelectedNote } = selectedNoteSlice.actions;
export const selectNote = (state: RootState) => state.note;
export default selectedNoteSlice.reducer;
