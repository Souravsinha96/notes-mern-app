import { useRef } from 'react';
import { Tag } from '../card/cardTypes';
import styles from './CustomTag.module.css';
import { TiDelete } from 'react-icons/ti';

type customTagProps = {
  tag: Tag;
  onDelete?: () => void;
};
export const CustomTag = ({ tag, onDelete }: customTagProps) => {
  const tagRef = useRef<HTMLButtonElement | null>(null);
  function handleKeyDown(event: any) {
    switch (event.code) {
      case 'Enter':
        handleDelete();
        break;
      case 'Space':
        handleDelete();
        break;

      default:
        break;
    }
  }
  function handleDelete() {
    onDelete && onDelete();
  }

  return (
    <div className={styles.container}>
      <small>{tag.label}</small>
      {onDelete ? (
        <button
          className={styles.tagBtn}
          ref={tagRef}
          onKeyDown={handleKeyDown}
          onClick={handleDelete}
          data-testid={tag.id}
          aria-label={`delete ${tag.label} tag`}
        >
          <TiDelete />
        </button>
      ) : (
        ''
      )}
    </div>
  );
};
