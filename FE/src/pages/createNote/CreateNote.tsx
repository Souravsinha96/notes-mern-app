import NoteForm from '../../components/noteForm/NoteForm';

function CreateNote() {
  return (
    <>
      <h2>Create Note</h2>
      <NoteForm eventKey="onSubmitCreateNote" />
    </>
  );
}
export default CreateNote;
