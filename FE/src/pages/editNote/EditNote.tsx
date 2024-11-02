import NoteForm from '../../components/noteForm/NoteForm';
import { useAppSelector } from '../../core/hooks';
import { selectNote } from '../../core/slices/noteSlice';

function EditNote() {
  const selectedNote = useAppSelector(selectNote);

  return (
    <>
      <h2>Edit Note</h2>
      <NoteForm selectedNote={selectedNote} eventKey="onSubmitEditNote" />
    </>
  );
}
export default EditNote;
