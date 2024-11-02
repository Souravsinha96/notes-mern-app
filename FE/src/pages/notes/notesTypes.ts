import { Tag } from '../../components/card/cardTypes';

export type SimplifiedNote = {
  tags: Tag[];
  title: string;
  _id: string;
  body: string;
  important: boolean;
  createdAt: string;
  updatedAt: string;
};
