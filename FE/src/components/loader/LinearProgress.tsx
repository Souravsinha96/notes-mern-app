import styles from './LinearProgress.module.css';
const LinearProgress = () => {
  return (
    <div className={styles.loader_container} data-testid="linear-progress">
      <div className={styles.loader} />
    </div>
  );
};

export default LinearProgress;
