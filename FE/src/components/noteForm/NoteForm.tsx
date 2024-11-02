import { FormEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Button from '../button/Button';
import Input from '../input/Input';
import { toggleLoader } from '../../core/slices/loaderSlice';
import { useAppDispatch } from '../../core/hooks';
import { customAxios } from '../../api/axios';
import { openSnackbar } from '../../core/slices/snackbarSlice';

import './NoteForm.css';
import { NOTES, TAGS } from '../../constants/routeConstants';
import { SimplifiedNote } from '../../pages/notes/notesTypes';
import SelectComponent, {
  SelectOption,
} from '../SelectComponent/SelectComponent';

type NoteFormProps = {
  selectedNote?: SimplifiedNote | null;
  eventKey?: string;
};
type payload = {
  id?: string;
  title: string;
  body: string;
  tags: SelectOption[];
  important: boolean;
};
type method = 'put' | 'post';
enum methodType {
  PUT = 'put',
  POST = 'post',
}
export default function NoteForm({ selectedNote, eventKey }: NoteFormProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [tags, setTags] = useState<SelectOption[]>([]);
  const [tag, setTag] = useState<SelectOption[]>([]);
  const [imp, setImp] = useState<boolean>(false);

  useEffect(() => {
    fetchTags();
  }, []);
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setBody(selectedNote.body);
      const formattedData = selectedNote.tags.map((item: any) => {
        return { id: item._id, label: item.label };
      });
      setTag(formattedData);
      setImp(selectedNote?.important);
    }
  }, [selectedNote]);
  const handleRedirection = () => {
    navigate(NOTES);
  };

  async function fetchTags() {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.get(TAGS);
      const formattedData = response?.data.map((item: any) => {
        return { id: item._id, label: item.label };
      });
      setTags(formattedData);
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Tags found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  }

  const createOrEditApiCall = async (method: method, payload: payload) => {
    try {
      dispatch(toggleLoader());

      let response = await customAxios[method](NOTES, payload);
      if (response.status === 201) {
        handleRedirection();
        dispatch(
          openSnackbar({
            autoClose: true,
            severity: 'success',
            message: 'Notes Create Successfully',
          })
        );
      }
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
  };

  const onSubmitEditNote = (e: FormEvent) => {
    const bodyContent: payload = {
      id: selectedNote?._id,
      title,
      body,
      tags: tag,
      important: imp,
    };

    createOrEditApiCall(methodType.PUT, bodyContent);
  };
  const onSubmitCreateNote = (e: FormEvent) => {
    const bodyContent: payload = {
      title,
      body,
      tags: tag,
      important: imp,
    };

    createOrEditApiCall(methodType.POST, bodyContent);
  };

  const onFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    eventKey && fns[eventKey](event);
  };
  const fns: any = {
    onSubmitCreateNote: onSubmitCreateNote,
    onSubmitEditNote: onSubmitEditNote,
  };
  const handleCancel = () => {
    navigate(-1);
  };
  return (
    <form className="form_container" onSubmit={onFormSubmit}>
      <Input
        label="Title"
        value={title || ''}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <div className="add_tag">
        {tags && (
          <SelectComponent
            multiple
            options={tags}
            value={tag}
            onChange={(o) => setTag(o)}
          />
        )}
      </div>
      <Input
        label="Body"
        isTextarea={true}
        rows={6}
        value={body || ''}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <Input
        type="checkbox"
        label="Mark As Important"
        checked={imp}
        onChange={(e) => setImp(e.target.checked)}
      />
      <div className="form_btn_container">
        <Button type="button" onClick={handleCancel} color="error">
          Cancel
        </Button>
        <Button color="secondary">Save</Button>
      </div>
    </form>
  );
}
