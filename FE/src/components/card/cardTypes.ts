export type Tag = {
  id?: string;
  label: string;
};
export type CardProps = {
  onClick?: () => void;
  indicator?: boolean;
  newNote?: boolean;
  title: string;
  body: string;
  tags: Tag[];
};
