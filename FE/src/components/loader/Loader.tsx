import { useAppSelector } from '../../core/hooks';
import { loader } from '../../core/slices/loaderSlice';
import styles from './loader.module.css';
const Loader = () => {
  const isLoading = useAppSelector(loader);

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-busy={isLoading}
      aria-label="Loading"
      data-testid="loader"
      className={`${styles.loader} ${isLoading ? styles.visible : ''}`}
    >
      <div className={styles.spinner}></div>
      {/* You can add additional elements or messages here */}
    </div>
  );
};

export default Loader;
