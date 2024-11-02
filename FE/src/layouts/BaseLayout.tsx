import { Outlet } from 'react-router-dom';
import Header from '../components/header/Header';
import styles from './BaseLayout.module.css';
const BaseLayout = () => {
  return (
    <div className={styles.base_container}>
      <Header />
      <div className={styles.body_container} id="main-navigation">
        <Outlet />
      </div>
    </div>
  );
};
export default BaseLayout;
