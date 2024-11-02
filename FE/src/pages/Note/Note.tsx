import { useEffect, useState } from 'react';
import Button from '../../components/button/Button';
import './Note.css';
import { toggleLoader } from '../../core/slices/loaderSlice';
import { openSnackbar } from '../../core/slices/snackbarSlice';
import { customAxios } from '../../api/axios';
import { EDITNOTE, NOTES } from '../../constants/routeConstants';
import { useAppDispatch } from '../../core/hooks';
import { SimplifiedNote } from '../notes/notesTypes';
import { useNavigate, useParams } from 'react-router-dom';
import { CustomTag } from '../../components/tag/CustomTag';
import { setSelectedNote } from '../../core/slices/noteSlice';
import { Modal } from '../../components/modal/Modal';
function Note() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const params = useParams();
  const [note, setNote] = useState<SimplifiedNote | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);
  async function fetchNote() {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.get(`${NOTES}/${params.id}`);
      if (response.status === 200) {
        setNote(response.data);
        dispatch(setSelectedNote(response.data));
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Note found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  }
  useEffect(() => {
    fetchNote();
  }, []);
  const handleEdit = () => {
    navigate(EDITNOTE);
  };

  const handleDelete = async () => {
    const bodyContent: any = {
      data: { id: params.id },
    };
    try {
      dispatch(toggleLoader());
      const response = await customAxios.delete(NOTES, bodyContent);
      if (response.status === 204) {
        dispatch(
          openSnackbar({
            autoClose: true,
            severity: 'success',
            message: 'Notes deleted Successfully',
          })
        );
        handleClose();
        navigate(NOTES);
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Note found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  };
  return (
    <div className="note_container">
      <Modal
        open={isModalOpen}
        title={`Delete ${note?.title}`}
        onClose={handleClose}
        onSubmit={handleDelete}
        divider
      >
        <p>Are you sure you want to delete this note ?</p>
      </Modal>
      <div className="userBtn">
        <h1>
          {note?.title}
          {note?.important && <span className="importantNote">Important</span>}
        </h1>

        <div className="btnGroup">
          <Button onClick={handleEdit}>Edit Note</Button>
          <Button onClick={handleOpen} color="error">
            Delete Note
          </Button>
        </div>
      </div>

      <div className="tagsUsed">
        {note?.tags?.map((tag, key) => (
          <CustomTag key={`${tag.label}_${key}`} tag={tag} />
        ))}
      </div>
      <div className="noteBody">
        <div>{note?.body}</div>
      </div>
    </div>
  );
}
export default Note;
