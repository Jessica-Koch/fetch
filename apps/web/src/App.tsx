import { AdoptionForm } from './components/AdoptionForm/AdoptionForm';

import styles from './App.module.scss';
import { DogGrid } from './components/DogGrid/DogGrid';

function App() {
  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Fetch</h1>
        </header>

        <DogGrid />
        <AdoptionForm />
      </div>
    </div>
  );
}

export default App;
