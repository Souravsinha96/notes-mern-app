import { FormEvent, useEffect, useState } from 'react';
import Input from '../../components/input/Input';
import { Modal as ModalEdit } from '../../components/modal/Modal';
import { DeleteorEditTagsProps } from './tagTypes';
import { Tag } from '../../components/card/cardTypes';

function EditTags({
  isModalOpen,
  selectedTag,
  handleClose,
  handleSubmit,
}: DeleteorEditTagsProps) {
  const [label, setLabel] = useState<string>('');

  useEffect(() => {
    setLabel(selectedTag.label);
  }, [selectedTag.label]);

  const onFormSubmit = () => {
    const payload: Tag = {
      label: label,
      id: selectedTag._id,
    };
    handleSubmit(payload);
  };

  return (
    <ModalEdit
      open={isModalOpen}
      title={`Edit ${selectedTag.label} Tag`}
      onClose={handleClose}
      onSubmit={onFormSubmit}
      divider
    >
      <Input
        autoFocus
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        required
      />
    </ModalEdit>
  );
}
export default EditTags;
