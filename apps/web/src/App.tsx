// apps/web/src/App.tsx
import { useState } from 'react';
import { DogForm } from './components/DogForm';
import { AdoptionForm } from './components/AdoptionForm/AdoptionForm';
import { dogApi, isApiError } from './services/api';
import type { CreateDogRequest } from '@fetch/shared';
import styles from './App.module.scss';

function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleAddDog = async (dogData: CreateDogRequest) => {
    setLoading(true);
    setMessage(null);

    try {
      const response = await dogApi.create(dogData);
      setMessage({
        type: 'success',
        text: `${dogData.name} has been added successfully!`,
      });
      console.log('Dog created:', response.data);
    } catch (error) {
      console.error('Failed to create dog:', error);

      const errorMessage = isApiError(error)
        ? error.message
        : 'Something went wrong. Please try again.';

      setMessage({
        type: 'error',
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.logo}>Fetch</h1>
        </header>

        {message && (
          <div className={`${styles.message} ${styles[message.type]}`}>
            {message.text}
          </div>
        )}
        <AdoptionForm />

        <DogForm onSubmit={handleAddDog} loading={loading} />
      </div>
    </div>
  );
}

export default App;
