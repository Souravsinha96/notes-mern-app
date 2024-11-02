import { Modal as ModalDelete } from '../../components/modal/Modal';
import { DeleteorEditTagsProps } from './tagTypes';

function DeleteTag({
  isModalOpen,
  selectedTag,
  handleClose,
  handleSubmit,
}: DeleteorEditTagsProps) {
  return (
    <ModalDelete
      open={isModalOpen}
      title={`Delete ${selectedTag.label}`}
      onClose={handleClose}
      onSubmit={handleSubmit}
      divider
    >
      <p>Are you sure you want to delete this Tag ?</p>
      <br />
      <i>Note: </i>
      <strong>All the Associated Notes will also be deleted</strong>
    </ModalDelete>
  );
}
export default DeleteTag;
