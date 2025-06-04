// apps/web/src/components/DogForm/DogForm.tsx
import { useState } from 'react';
import type { CreateDogRequest, Gender, Size } from '@fetch/shared';
import styles from './DogForm.module.scss';

interface DogFormProps {
  onSubmit: (dog: CreateDogRequest) => Promise<void>;
  loading?: boolean;
}

export const DogForm = ({ onSubmit, loading = false }: DogFormProps) => {
  const [formData, setFormData] = useState<CreateDogRequest>({
    name: '',
    breed: '',
    breedSecondary: '',
    breedMixed: false,
    breedUnknown: false,
    age: 1,
    weight: undefined,
    description: '',
    gender: 'UNKNOWN' as Gender,
    size: 'MEDIUM' as Size,
    coat: undefined,
    colorPrimary: '',
    colorSecondary: '',
    colorTertiary: '',
    spayedNeutered: false,
    houseTrained: false,
    specialNeeds: false,
    shotsCurrent: false,
    goodWithChildren: undefined,
    goodWithDogs: undefined,
    goodWithCats: undefined,
    photos: [],
    videos: [],
    tags: [],
    contactEmail: '',
    contactPhone: ''
  });

  const [tagInput, setTagInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form after successful submission
    setFormData({
      name: '',
      breed: '',
      breedSecondary: '',
      breedMixed: false,
      breedUnknown: false,
      age: 1,
      weight: undefined,
      description: '',
      gender: 'UNKNOWN' as Gender,
      size: 'MEDIUM' as Size,
      coat: undefined,
      colorPrimary: '',
      colorSecondary: '',
      colorTertiary: '',
      spayedNeutered: false,
      houseTrained: false,
      specialNeeds: false,
      shotsCurrent: false,
      goodWithChildren: undefined,
      goodWithDogs: undefined,
      goodWithCats: undefined,
      photos: [],
      videos: [],
      tags: [],
      contactEmail: '',
      contactPhone: ''
    });
    setTagInput('');
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value || undefined }));
    }
  };

  const handleTriStateChange = (fieldName: string, value: string) => {
    const boolValue = value === 'true' ? true : value === 'false' ? false : undefined;
    setFormData(prev => ({ ...prev, [fieldName]: boolValue }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add New Dog</h2>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Basic Information</legend>
          
          <div className={styles.field}>
            <label htmlFor="name" className={styles.label}>Name *</label>
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

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="age" className={styles.label}>Age (years) *</label>
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
              <label htmlFor="weight" className={styles.label}>Weight (lbs)</label>
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

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>Description</label>
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
        </fieldset>

        {/* Breed Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Breed Information</legend>
          
          <div className={styles.field}>
            <label htmlFor="breed" className={styles.label}>Primary Breed *</label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={formData.breed}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="e.g., Golden Retriever, Labrador"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="breedSecondary" className={styles.label}>Secondary Breed</label>
            <input
              type="text"
              id="breedSecondary"
              name="breedSecondary"
              value={formData.breedSecondary || ''}
              onChange={handleInputChange}
              className={styles.input}
              placeholder="For mixed breeds"
            />
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="breedMixed"
                checked={formData.breedMixed}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Mixed Breed
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="breedUnknown"
                checked={formData.breedUnknown}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Breed Unknown
            </label>
          </div>
        </fieldset>

        {/* Physical Characteristics */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Physical Characteristics</legend>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="gender" className={styles.label}>Gender *</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="UNKNOWN">Unknown</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="size" className={styles.label}>Size *</label>
              <select
                id="size"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value="SMALL">Small</option>
                <option value="MEDIUM">Medium</option>
                <option value="LARGE">Large</option>
                <option value="XLARGE">Extra Large</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor="coat" className={styles.label}>Coat</label>
              <select
                id="coat"
                name="coat"
                value={formData.coat || ''}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="">Select coat type</option>
                <option value="HAIRLESS">Hairless</option>
                <option value="SHORT">Short</option>
                <option value="MEDIUM">Medium</option>
                <option value="LONG">Long</option>
                <option value="WIRE">Wire</option>
                <option value="CURLY">Curly</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="colorPrimary" className={styles.label}>Primary Color</label>
              <input
                type="text"
                id="colorPrimary"
                name="colorPrimary"
                value={formData.colorPrimary || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="e.g., Black, Golden"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="colorSecondary" className={styles.label}>Secondary Color</label>
              <input
                type="text"
                id="colorSecondary"
                name="colorSecondary"
                value={formData.colorSecondary || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optional"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="colorTertiary" className={styles.label}>Tertiary Color</label>
              <input
                type="text"
                id="colorTertiary"
                name="colorTertiary"
                value={formData.colorTertiary || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optional"
              />
            </div>
          </div>
        </fieldset>

        {/* Health & Training */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Health & Training</legend>
          
          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="spayedNeutered"
                checked={formData.spayedNeutered}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Spayed/Neutered
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="houseTrained"
                checked={formData.houseTrained}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              House Trained
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="specialNeeds"
                checked={formData.specialNeeds}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Special Needs
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                name="shotsCurrent"
                checked={formData.shotsCurrent}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Shots Current
            </label>
          </div>
        </fieldset>

        {/* Environment Compatibility */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Good With</legend>
          
          <div className={styles.triStateGrid}>
            <div className={styles.triStateField}>
              <label className={styles.label}>Children</label>
              <div className={styles.triStateOptions}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithChildren"
                    checked={formData.goodWithChildren === true}
                    onChange={() => handleTriStateChange('goodWithChildren', 'true')}
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithChildren"
                    checked={formData.goodWithChildren === false}
                    onChange={() => handleTriStateChange('goodWithChildren', 'false')}
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithChildren"
                    checked={formData.goodWithChildren === undefined}
                    onChange={() => handleTriStateChange('goodWithChildren', 'unknown')}
                    className={styles.radio}
                  />
                  Unknown
                </label>
              </div>
            </div>

            <div className={styles.triStateField}>
              <label className={styles.label}>Dogs</label>
              <div className={styles.triStateOptions}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithDogs"
                    checked={formData.goodWithDogs === true}
                    onChange={() => handleTriStateChange('goodWithDogs', 'true')}
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithDogs"
                    checked={formData.goodWithDogs === false}
                    onChange={() => handleTriStateChange('goodWithDogs', 'false')}
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithDogs"
                    checked={formData.goodWithDogs === undefined}
                    onChange={() => handleTriStateChange('goodWithDogs', 'unknown')}
                    className={styles.radio}
                  />
                  Unknown
                </label>
              </div>
            </div>

            <div className={styles.triStateField}>
              <label className={styles.label}>Cats</label>
              <div className={styles.triStateOptions}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithCats"
                    checked={formData.goodWithCats === true}
                    onChange={() => handleTriStateChange('goodWithCats', 'true')}
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithCats"
                    checked={formData.goodWithCats === false}
                    onChange={() => handleTriStateChange('goodWithCats', 'false')}
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="goodWithCats"
                    checked={formData.goodWithCats === undefined}
                    onChange={() => handleTriStateChange('goodWithCats', 'unknown')}
                    className={styles.radio}
                  />
                  Unknown
                </label>
              </div>
            </div>
          </div>
        </fieldset>

        {/* Tags */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Tags</legend>
          
          <div className={styles.field}>
            <label htmlFor="tagInput" className={styles.label}>Add Tags</label>
            <div className={styles.tagInputContainer}>
              <input
                type="text"
                id="tagInput"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className={styles.input}
                placeholder="e.g., Friendly, Playful, House Trained"
              />
              <button
                type="button"
                onClick={addTag}
                className={styles.tagAddButton}
                disabled={!tagInput.trim()}
              >
                Add
              </button>
            </div>
          </div>

          {formData.tags && formData.tags.length > 0 && (
            <div className={styles.tagList}>
              {formData.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className={styles.tagRemove}
                    aria-label={`Remove ${tag} tag`}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </fieldset>

        {/* Contact Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Contact Information</legend>
          
          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor="contactEmail" className={styles.label}>Contact Email</label>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={formData.contactEmail || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optional override for this dog"
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="contactPhone" className={styles.label}>Contact Phone</label>
              <input
                type="tel"
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Optional override for this dog"
              />
            </div>
          </div>
        </fieldset>

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
};