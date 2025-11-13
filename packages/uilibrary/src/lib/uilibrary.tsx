import styles from './Uilibrary.module.css';

export function Uilibrary() {
  return (
    <div className={styles['container']}>
      <h1>Welcome to Uilibrary!</h1>
      <button>Button from UI Library</button>
    </div>
  );
}

export default Uilibrary;
