import Button from '../../components/button/Button';
import Card from '../../components/card/Card';
import CreateNoteIcon from '../../assests/undraw_add_notes_re_ln36.svg';
import viewNotesIcon from '../../assests/undraw_notes_re_pxhw.svg';
import './Home.css';
import { useNavigate } from 'react-router-dom';
import { CREATENOTE, NOTES } from '../../constants/routeConstants';
import { SimplifiedNote } from '../notes/notesTypes';
import { useEffect, useState } from 'react';
import { toggleLoader } from '../../core/slices/loaderSlice';
import { customAxios } from '../../api/axios';
import { openSnackbar } from '../../core/slices/snackbarSlice';
import { useAppDispatch } from '../../core/hooks';
import { handleNewNotes } from '../../utils/checkNewNote';
function Home() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function handleNotes() {
    navigate(NOTES);
  }
  function createNote() {
    navigate(CREATENOTE);
  }

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
    navigate(`${NOTES}/${id}`);
  };
  useEffect(() => {
    fetchNotes();
  }, []);
  return (
    <section className="home_container">
      <div className="cta_container">
        <div className="cta">
          <img src={CreateNoteIcon} alt="add note" />
          <p>Compose standout markdown notes for your content.</p>
          <Button size="lg" onClick={createNote}>
            Create Note
          </Button>
        </div>
        <div className="cta">
          <img src={viewNotesIcon} alt="add note" />
          <p>Explore your curated notes collection.</p>
          <Button size="lg" onClick={handleNotes}>
            View Notes
          </Button>
        </div>
      </div>
      <hr />
      <h2>Latest Notes</h2>
      <div className="home_note_container">
        {notes?.slice(0, 4).map((note) => (
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
    </section>
  );
}
export default Home;
