import { Fragment, useEffect, useState } from 'react';
import { useAppDispatch } from '../../core/hooks';
import './Tags.css';
import { toggleLoader } from '../../core/slices/loaderSlice';
import { customAxios } from '../../api/axios';
import { TAGS } from '../../constants/routeConstants';
import { openSnackbar } from '../../core/slices/snackbarSlice';
import Button from '../../components/button/Button';
import { MdEdit, MdDelete } from 'react-icons/md';
import { ImPriceTags } from 'react-icons/im';

import EditTags from './EditTags';
import { TagswithNotes } from './tagTypes';
import { Tag } from '../../components/card/cardTypes';
import Input from '../../components/input/Input';
import { Modal } from '../../components/modal/Modal';
import DeleteTag from './DeleteTag';

function Tags() {
  const dispatch = useAppDispatch();

  const [tags, setTags] = useState<TagswithNotes[]>([]);
  const [selectedTag, setSelectedTag] = useState<TagswithNotes>({
    _id: '',
    label: '',
    notes: [],
  });
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isDeleteTagsModalOpen, setDeleteTagsModalOpen] = useState(false);

  const handleDeleteBtnOpen = (tag: TagswithNotes) => {
    setSelectedTag(tag);
    setDeleteModalOpen(true);
  };
  const handleDeleteTagsBtnOpen = () => {
    setDeleteTagsModalOpen(true);
  };
  const handleEditBtnOpen = (tag: TagswithNotes) => {
    setSelectedTag(tag);
    setEditModalOpen(true);
  };
  const handleDeleteBtnClose = () => setDeleteModalOpen(false);
  const handleDeleteTagsClose = () => setDeleteTagsModalOpen(false);
  const handleEditBtnClose = () => setEditModalOpen(false);
  const handleSubmitDeleteReq = () => {
    const bodyContent: any = {
      data: { ids: [selectedTag._id] },
    };
    deleteTags(bodyContent, handleDeleteBtnClose);
  };
  const handleDeleteTagsSubmit = () => {
    const bodyContent: any = {
      data: { ids: selectedTags },
    };
    deleteTags(bodyContent, handleDeleteTagsClose);
  };
  const handleSubmitEditReq = async (payload?: Tag) => {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.put(TAGS, payload);
      if (response.status === 201) {
        dispatch(
          openSnackbar({
            autoClose: true,
            severity: 'success',
            message: 'Tag updated Successfully',
          })
        );
        handleEditBtnClose();
        fetchTags();
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Tag found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  };
  async function fetchTags() {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.get(TAGS);
      setTags(response.data);
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
  async function deleteTags(bodyContent: any, cb: any) {
    try {
      dispatch(toggleLoader());
      const response = await customAxios.delete(TAGS, bodyContent);
      if (response.status === 204) {
        dispatch(
          openSnackbar({
            autoClose: true,
            severity: 'success',
            message: 'Tag/s deleted Successfully',
          })
        );
        cb();
        fetchTags();
      }
    } catch (error: any) {
      dispatch(
        openSnackbar({
          autoClose: true,
          severity: 'error',
          message: error?.message || 'No Tag found',
        })
      );
    } finally {
      dispatch(toggleLoader());
    }
  }
  useEffect(() => {
    fetchTags();
  }, []);
  const handleSelectedTag = (id: string) => {
    if (selectedTags.includes(id)) {
      setSelectedTags((prev) => prev.filter((tagId) => tagId !== id));
    } else {
      setSelectedTags((prev) => [...prev, id]);
    }
  };
  const toggleDeleteAll = () => {
    if (selectedTags.length !== tags.length) {
      setSelectedTags(tags.map((tag) => tag._id));
    } else {
      setSelectedTags([]);
    }
  };
  return (
    <Fragment>
      <Modal
        open={isDeleteTagsModalOpen}
        title={`Delete Tags`}
        onClose={handleDeleteTagsClose}
        onSubmit={handleDeleteTagsSubmit}
        divider
      >
        <p>Are you sure you want to delete the selected Tags ?</p>
        <br />
        <i>Note: </i>
        <strong>All the Associated Notes will also be deleted</strong>
      </Modal>
      <DeleteTag
        isModalOpen={isDeleteModalOpen}
        handleClose={handleDeleteBtnClose}
        handleSubmit={handleSubmitDeleteReq}
        selectedTag={selectedTag}
      />
      <EditTags
        isModalOpen={isEditModalOpen}
        handleClose={handleEditBtnClose}
        handleSubmit={handleSubmitEditReq}
        selectedTag={selectedTag}
      />
      {tags.length > 0 ? (
        <main className="tags-container-wrapper">
          <Button
            onClick={() => handleDeleteTagsBtnOpen()}
            color="error"
            disabled={selectedTags.length === 0}
          >
            Delete Tags
          </Button>
          <table className="tags-table">
            <thead>
              <tr>
                <th className="delete">
                  <Input
                    data-testid="deleteAll"
                    type="checkbox"
                    label="Delete All"
                    checked={selectedTags.length === tags.length}
                    onChange={toggleDeleteAll}
                  />
                </th>
                <th>Tags</th>
                <th>Associated Notes</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tags?.map((tag) => (
                <tr key={tag._id}>
                  <td className="delete">
                    <Input
                      data-testid={tag._id}
                      id={tag.label}
                      label={tag._id}
                      type="checkbox"
                      checked={selectedTags.includes(tag._id)}
                      onChange={() => handleSelectedTag(tag._id)}
                    />
                  </td>
                  <td>
                    <div className="tag-flex">
                      <ImPriceTags color="var(--clr-primary)" />
                      {tag.label}
                    </div>
                  </td>
                  <td>
                    <ul className="notes-list">
                      {tag.notes.length > 0 ? (
                        tag.notes.map((note: any) => (
                          <li key={`${tag._id}_${note.id}`}>
                            <strong>{note.title}</strong>
                          </li>
                        ))
                      ) : (
                        <span key={tag._id}>No Notes Associated</span>
                      )}
                    </ul>
                  </td>
                  <td>
                    <div className="tag-flex">
                      <Button
                        aria-label={`Edit Tag-${tag.label}`}
                        onClick={() => handleEditBtnOpen(tag)}
                        startIcon={<MdEdit />}
                      ></Button>
                      <Button
                        aria-label={`Delete Tag-${tag.label}`}
                        onClick={() => handleDeleteBtnOpen(tag)}
                        startIcon={<MdDelete />}
                      ></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </main>
      ) : (
        <div>No Tags Found</div>
      )}
    </Fragment>
  );
}
export default Tags;
