import { useState, useEffect } from 'react';
import { dogApi, isApiError } from '../../services/api';
import type { Dog } from '@fetch/shared';

import styles from './DogGrid.module.scss';
import { Card } from '../Card/Card';

export const DogGrid = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        setLoading(true);
        const response = await dogApi.getAll();
        setDogs(response.data);
      } catch (err) {
        console.error('Failed to fetch dogs:', err);
        const errorMessage = isApiError(err)
          ? err.message
          : 'Something went wrong. Please try again.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  return (
    <div className={styles.dogGrid}>
      <h2 className={styles.title}>Dog List</h2>
      {loading && <p>Loading...</p>}
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.grid}>
        {dogs.map((dog, i) => (
          <Card key={`${dog.id}-${i}`} onClick={onDogClick} dog={dog} />
        ))}
      </div>
    </div>
  );
};
