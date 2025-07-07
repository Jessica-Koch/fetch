import { useState } from 'react';
import type {
  CreateDogWithPetfinderRequest,
  GenderType,
  SizeType,
} from '@fetch/shared';
import { DOG_BREEDS, DOG_COLORS, AGE_CATEGORIES } from '@fetch/shared';
import styles from './Intake.module.scss';
import { Button } from '../Button/Button';

interface IntakeProps {
  readonly onSubmit: (dog: CreateDogWithPetfinderRequest) => Promise<void>;
  readonly loading?: boolean;
}

export const Intake = ({ onSubmit, loading = false }: IntakeProps) => {
  const [formData, setFormData] = useState<CreateDogWithPetfinderRequest>({
    name: 'test',
    breed: 'Siberian Husky',
    breedSecondary: '',
    breedMixed: false,
    breedUnknown: false,
    age: 2, // Will be overridden by age category
    weight: 20,
    description: 'hi',
    gender: 'MALE' as GenderType,
    size: 'MEDIUM' as SizeType,
    coat: 'MEDIUM',
    colorPrimary: 'Black',
    colorSecondary: '',
    colorTertiary: '',
    spayedNeutered: false,
    houseTrained: false,
    specialNeeds: false,
    shotsCurrent: false,
    goodWithChildren: true,
    goodWithDogs: undefined,
    goodWithCats: undefined,
    photos: [],
    videos: [],
    tags: [],
    contactEmail: 'adoptions@loveslegacyrescue.com',
    contactPhone: '',
    // Petfinder options
    autoUploadToPetfinder: false,
    petfinderMethod: 'auto',
    useFallback: true,
  });

  const [tagInput, setTagInput] = useState('');
  const [ageCategory, setAgeCategory] = useState('Young');

  // Convert age category to numeric age for backend
  const getNumericAge = (category: string): number => {
    switch (category) {
      case 'Baby':
        return 0.5;
      case 'Young':
        return 2;
      case 'Adult':
        return 5;
      case 'Senior':
        return 10;
      default:
        return 2;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Convert age category to numeric age before submission
    const submissionData = {
      ...formData,
      age: getNumericAge(ageCategory),
    };
    await onSubmit(submissionData);
    // Reset form after successful submission
    setFormData({
      name: 'test',
      breed: 'Siberian Husky',
      breedSecondary: '',
      breedMixed: false,
      breedUnknown: false,
      age: 2, // Will be overridden by age category
      weight: 20,
      description: '',
      gender: 'MALE' as GenderType,
      size: 'MEDIUM' as SizeType,
      coat: 'MEDIUM',
      colorPrimary: 'Black',
      colorSecondary: '',
      colorTertiary: '',
      spayedNeutered: false,
      houseTrained: false,
      specialNeeds: false,
      shotsCurrent: false,
      goodWithChildren: true,
      goodWithDogs: undefined,
      goodWithCats: undefined,
      photos: [],
      videos: [],
      tags: [],
      contactEmail: 'adoptions@loveslegacyrescue.com',
      contactPhone: '',
      // Petfinder options
      autoUploadToPetfinder: false,
      petfinderMethod: 'auto',
      useFallback: true,
    });
    setTagInput('');
    setAgeCategory('Young');
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData((prev) => ({
        ...prev,
        [name]: value ? Number(value) : undefined,
      }));
    } else {
      setFormData((prev) => {
        const newData = { ...prev, [name]: value || undefined };

        // If changing primary breed to match secondary breed, clear secondary
        if (name === 'breed' && value && value === prev.breedSecondary) {
          newData.breedSecondary = '';
        }

        // Handle color conflicts
        if (name === 'colorPrimary' && value) {
          // Clear secondary color if it matches new primary
          if (value === prev.colorSecondary) {
            newData.colorSecondary = '';
          }
          // Clear tertiary color if it matches new primary
          if (value === prev.colorTertiary) {
            newData.colorTertiary = '';
          }
        }

        if (name === 'colorSecondary' && value) {
          // Clear tertiary color if it matches new secondary
          if (value === prev.colorTertiary) {
            newData.colorTertiary = '';
          }
        }

        return newData;
      });
    }
  };

  const handleTriStateChange = (fieldName: string, value: string) => {
    const boolValue =
      value === 'true' ? true : value === 'false' ? false : undefined;
    setFormData((prev) => ({ ...prev, [fieldName]: boolValue }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '2rem',
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        className={styles.title}
        style={{
          fontSize: '1.75rem',
          fontWeight: '700',
          color: '#1f2937',
          marginBottom: '1.5rem',
          textAlign: 'center',
        }}
      >
        Add New Dog
      </h2>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Basic Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Basic Information</legend>

          <div className={styles.field}>
            <label htmlFor='name' className={styles.label}>
              Name *
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleInputChange}
              required
              className={styles.input}
              placeholder="Dog's name"
            />
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='ageCategory' className={styles.label}>
                Age Category *
              </label>
              <select
                id='ageCategory'
                name='ageCategory'
                value={ageCategory}
                onChange={(e) => setAgeCategory(e.target.value)}
                required
                className={styles.select}
              >
                {AGE_CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='weight' className={styles.label}>
                Weight (lbs)
              </label>
              <input
                type='number'
                id='weight'
                name='weight'
                value={formData.weight || ''}
                onChange={handleInputChange}
                min='0'
                step='0.1'
                className={styles.input}
                placeholder='Optional'
              />
            </div>
          </div>

          <div className={styles.field}>
            <label htmlFor='description' className={styles.label}>
              Description
            </label>
            <textarea
              id='description'
              name='description'
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
            <label htmlFor='breed' className={styles.label}>
              Primary Breed *
            </label>
            <select
              id='breed'
              name='breed'
              value={formData.breed}
              onChange={handleInputChange}
              required
              className={styles.select}
            >
              <option value=''>Select a breed</option>
              {DOG_BREEDS.map((breed) => (
                <option key={breed} value={breed}>
                  {breed}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor='breedSecondary' className={styles.label}>
              Secondary Breed
            </label>
            <select
              id='breedSecondary'
              name='breedSecondary'
              value={formData.breedSecondary || ''}
              onChange={handleInputChange}
              className={styles.select}
            >
              <option value=''>None (select for mixed breeds)</option>
              {DOG_BREEDS.filter((breed) => breed !== formData.breed).map(
                (breed) => (
                  <option key={breed} value={breed}>
                    {breed}
                  </option>
                )
              )}
            </select>
          </div>

          <div className={styles.checkboxRow}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='breedMixed'
                checked={formData.breedMixed}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Mixed Breed
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='breedUnknown'
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
              <label htmlFor='gender' className={styles.label}>
                Gender *
              </label>
              <select
                id='gender'
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value='UNKNOWN'>Unknown</option>
                <option value='MALE'>Male</option>
                <option value='FEMALE'>Female</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='size' className={styles.label}>
                Size *
              </label>
              <select
                id='size'
                name='size'
                value={formData.size}
                onChange={handleInputChange}
                required
                className={styles.select}
              >
                <option value='SMALL'>Small</option>
                <option value='MEDIUM'>Medium</option>
                <option value='LARGE'>Large</option>
                <option value='XLARGE'>Extra Large</option>
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='coat' className={styles.label}>
                Coat Length
              </label>
              <select
                id='coat'
                name='coat'
                value={formData.coat || ''}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value=''>Select coat length</option>
                <option value='HAIRLESS'>Hairless</option>
                <option value='SHORT'>Short</option>
                <option value='MEDIUM'>Medium</option>
                <option value='LONG'>Long</option>
                <option value='WIRE'>Wire</option>
                <option value='CURLY'>Curly</option>
              </select>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='colorPrimary' className={styles.label}>
                Primary Color
              </label>
              <select
                id='colorPrimary'
                name='colorPrimary'
                value={formData.colorPrimary || ''}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value=''>Select primary color</option>
                {DOG_COLORS.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='colorSecondary' className={styles.label}>
                Secondary Color
              </label>
              <select
                id='colorSecondary'
                name='colorSecondary'
                value={formData.colorSecondary || ''}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value=''>None (optional)</option>
                {DOG_COLORS.filter(
                  (color) => color !== formData.colorPrimary
                ).map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label htmlFor='colorTertiary' className={styles.label}>
                Tertiary Color
              </label>
              <select
                id='colorTertiary'
                name='colorTertiary'
                value={formData.colorTertiary || ''}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value=''>None (optional)</option>
                {DOG_COLORS.filter(
                  (color) =>
                    color !== formData.colorPrimary &&
                    color !== formData.colorSecondary
                ).map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Health & Training */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Health & Training</legend>

          <div className={styles.checkboxGrid}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='spayedNeutered'
                checked={formData.spayedNeutered}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Spayed/Neutered
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='houseTrained'
                checked={formData.houseTrained}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              House Trained
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='specialNeeds'
                checked={formData.specialNeeds}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Special Needs
            </label>

            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='shotsCurrent'
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
                    type='radio'
                    name='goodWithChildren'
                    checked={formData.goodWithChildren === true}
                    onChange={() =>
                      handleTriStateChange('goodWithChildren', 'true')
                    }
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithChildren'
                    checked={formData.goodWithChildren === false}
                    onChange={() =>
                      handleTriStateChange('goodWithChildren', 'false')
                    }
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithChildren'
                    checked={formData.goodWithChildren === undefined}
                    onChange={() =>
                      handleTriStateChange('goodWithChildren', 'unknown')
                    }
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
                    type='radio'
                    name='goodWithDogs'
                    checked={formData.goodWithDogs === true}
                    onChange={() =>
                      handleTriStateChange('goodWithDogs', 'true')
                    }
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithDogs'
                    checked={formData.goodWithDogs === false}
                    onChange={() =>
                      handleTriStateChange('goodWithDogs', 'false')
                    }
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithDogs'
                    checked={formData.goodWithDogs === undefined}
                    onChange={() =>
                      handleTriStateChange('goodWithDogs', 'unknown')
                    }
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
                    type='radio'
                    name='goodWithCats'
                    checked={formData.goodWithCats === true}
                    onChange={() =>
                      handleTriStateChange('goodWithCats', 'true')
                    }
                    className={styles.radio}
                  />
                  Yes
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithCats'
                    checked={formData.goodWithCats === false}
                    onChange={() =>
                      handleTriStateChange('goodWithCats', 'false')
                    }
                    className={styles.radio}
                  />
                  No
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type='radio'
                    name='goodWithCats'
                    checked={formData.goodWithCats === undefined}
                    onChange={() =>
                      handleTriStateChange('goodWithCats', 'unknown')
                    }
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
            <label htmlFor='tagInput' className={styles.label}>
              Add Tags
            </label>
            <div className={styles.tagInputContainer}>
              <input
                type='text'
                id='tagInput'
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className={styles.input}
                placeholder='e.g., Friendly, Playful, House Trained'
              />
              <Button
                onClick={addTag}
                className={styles.tagAddButton}
                disabled={!tagInput.trim()}
                label='Add'
              />
            </div>
          </div>

          {formData.tags && formData.tags.length > 0 && (
            <div className={styles.tagList}>
              {formData.tags.map((tag, index) => (
                <span key={index} className={styles.tag}>
                  <Button
                    onClick={() => removeTag(tag)}
                    className={styles.tagRemove}
                    aria-label={`Remove ${tag} tag`}
                    label='x'
                  />
                </span>
              ))}
            </div>
          )}
        </fieldset>

        {/* Contact Information */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>
            Contact Information (Optional)
          </legend>
          <p className={styles.sectionNote}>
            Override organization default contact info for this specific dog
          </p>

          <div className={styles.row}>
            <div className={styles.field}>
              <label htmlFor='contactEmail' className={styles.label}>
                Contact Email
              </label>
              <input
                type='email'
                id='contactEmail'
                name='contactEmail'
                value={formData.contactEmail || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder='dog-specific-email@rescue.org'
              />
            </div>

            <div className={styles.field}>
              <label htmlFor='contactPhone' className={styles.label}>
                Contact Phone
              </label>
              <input
                type='tel'
                id='contactPhone'
                name='contactPhone'
                value={formData.contactPhone || ''}
                onChange={handleInputChange}
                className={styles.input}
                placeholder='(555) 123-4567'
              />
            </div>
          </div>
        </fieldset>

        {/* Petfinder Upload Options */}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>Petfinder Upload</legend>

          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type='checkbox'
                name='autoUploadToPetfinder'
                checked={formData.autoUploadToPetfinder || false}
                onChange={handleInputChange}
                className={styles.checkbox}
              />
              Automatically upload to Petfinder after creating dog
            </label>
          </div>

          {formData.autoUploadToPetfinder && (
            <>
              <div className={styles.field}>
                <label htmlFor='petfinderMethod' className={styles.label}>
                  Upload Method
                </label>
                <select
                  id='petfinderMethod'
                  name='petfinderMethod'
                  value={formData.petfinderMethod || 'auto'}
                  onChange={handleInputChange}
                  className={styles.select}
                >
                  <option value='auto'>Auto (Recommended)</option>
                  <option value='ftp'>FTP Upload</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.checkboxLabel}>
                  <input
                    type='checkbox'
                    name='useFallback'
                    checked={formData.useFallback !== false}
                    onChange={handleInputChange}
                    className={styles.checkbox}
                  />
                  Use fallback method if primary fails
                </label>
              </div>

              <div className={styles.petfinderNote}>
                <p>
                  <strong>FTP:</strong> Bulk upload, processed within hours
                </p>
                <p>
                  <strong>Auto:</strong> Tries the best available method
                </p>
              </div>
            </>
          )}
        </fieldset>

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className={`${styles.button} ${loading ? styles.loading : ''}`}
          label={loading ? 'Adding Dog...' : 'Add Dog'}
        />
      </form>
    </div>
  );
};
