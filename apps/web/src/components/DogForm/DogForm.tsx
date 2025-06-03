// apps/web/src/components/DogForm/DogForm.tsx
import { useState } from 'react';
import type { CreateDogRequest } from '@fetch/shared';
import styles from './DogForm.module.scss';

interface DogFormProps {
  onSubmit: (dog: CreateDogRequest) => Promise<void>;
  loading?: boolean;
}

export function DogForm({ onSubmit, loading = false }: DogFormProps) {
  const [formData, setFormData] = useState<CreateDogRequest>({
    name: '',
    breed: '',
    age: 1,
    weight: undefined,
    description: '',
    photos: []
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      name: '',
      breed: '',
      age: 1,
      weight: undefined,
      description: '',
      photos: []
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? Number(value) : undefined) : value
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Dog</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Name */}
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="Dog's name"
          />
        </div>

        {/* Breed */}
        <div className={styles.field}>
          <label htmlFor="breed" className={styles.label}>
            Breed *
          </label>
          <input
            type="text"
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleInputChange}
            required
            className={styles.input}
            placeholder="e.g., Golden Retriever, Mixed Breed"
          />
        </div>

        {/* Age and Weight */}
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="age" className={styles.label}>
              Age (years) *
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              required
              min="0"
              max="25"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="weight" className={styles.label}>
              Weight (lbs)
            </label>
            <input
              type="number"
              id="weight"
              name="weight"
              value={formData.weight || ''}
              onChange={handleInputChange}
              min="0"
              step="0.1"
              className={styles.input}
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Description */}
        <div className={styles.field}>
          <label htmlFor="description" className={styles.label}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`${styles.input} ${styles.textarea}`}
            placeholder="Tell us about this dog's personality, needs, etc."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`${styles.button} ${loading ? styles.loading : ''}`}
        >
          {loading ? 'Adding Dog...' : 'Add Dog'}
        </button>
      </form>
    </div>
  );
}