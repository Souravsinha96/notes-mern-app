import { useEffect, useState } from 'react';
import Card from '../../components/card/Card';

import './Notes.css';
import { customAxios } from '../../api/axios';
import { handleNewNotes } from '../../utils/checkNewNote';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../core/hooks';
import { toggleLoader } from '../../core/slices/loaderSlice';
import { openSnackbar } from '../../core/slices/snackbarSlice';
import { NOTES } from '../../constants/routeConstants';
import { SimplifiedNote } from './notesTypes';

function Notes() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [notes, setNotes] = useState<SimplifiedNote[]>([]);

  async function fetchNotes() {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.get(NOTES);
      setNotes(response.data);
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Notes found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  }

  const handleCardNavigation = (id: string): void => {
    navigate(id);
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  // TODO :make it such that new note should come at the top
  // from BE side
  return (
    <div className="notes_container">
      {notes?.map((note) => (
        <Card
          onClick={() => handleCardNavigation(note._id)}
          key={note._id}
          newNote={handleNewNotes(note.updatedAt)}
          title={note.title}
          body={note.body}
          tags={note?.tags}
          indicator={note?.important}
        />
      ))}
    </div>
  );
}
export default Notes;
