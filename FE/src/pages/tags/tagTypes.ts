import { Tag } from '../../components/card/cardTypes';

export type TagswithNotes = {
  _id: string;
  label: string;
  notes: AssociatedNotes[];
};
type AssociatedNotes = {
  _id: string;
  title: String;
};

export type DeleteorEditTagsProps = {
  isModalOpen: boolean;
  selectedTag: TagswithNotes;
  handleClose: () => void;
  handleSubmit: (payload?: Tag) => void;
};
