import styles from './Menu.module.css';
type Props = {};
function Menu({}: Props) {
  return (
    <div className={styles.menu_container}>
      <p>Good Morning !</p>
    </div>
  );
}
export default Menu;
