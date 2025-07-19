import { AdoptionForm } from './components/AdoptionForm/AdoptionForm';

import styles from './App.module.scss';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Fetch</h1>
        </header>
        <AdoptionForm />
      </div>
    </div>
  );
}

export default App;
