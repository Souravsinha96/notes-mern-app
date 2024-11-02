import { truncateString } from '../../utils/truncateString';
import styles from './Card.module.css';
import { CardProps } from './cardTypes';
import { CustomTag } from '../tag/CustomTag';

function Badge() {
  return <small className={styles.badge}>New Note</small>;
}

function Card({ onClick, indicator, newNote, title, body, tags }: CardProps) {
  function handleKeyDown(event: any) {
    switch (event.code) {
      case 'Enter':
        onClick && onClick();
        break;

      default:
        break;
    }
  }
  return (
    <article
      data-testid={`${title}`}
      onClick={onClick && onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      className={styles.container}
    >
      {indicator && <small className={styles.indicator}>Important</small>}
      {newNote && <Badge />}
      <h3 className={styles.title}>{truncateString(title, 30)}</h3>
      <p className={styles.body}>{truncateString(body, 50)}</p>
      <div className={styles.tagsContainer}>
        {tags.slice(0, 3)?.map((tag, key) => (
          <CustomTag key={`${tag.label}_${key}`} tag={tag} />
        ))}
        {tags.length > 3 && <span>...</span>}
      </div>
    </article>
  );
}
export default Card;
