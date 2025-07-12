import { useEffect, useState } from 'react';
import styles from './AdoptionForm.module.scss';
import {
  AdoptionFieldConfig,
  adoptionFields,
  AdoptionFormState,
  FieldState,
  FieldValue,
  PetFields,
} from './AdoptionForm.types';
import { TextInput } from '../TextInput/TextInput';
import { Button } from '../Button/Button';
import { PhotoVideoDropzone } from '../PhotoVideoDropzone/PhotoVideoDropzone';

const getInitialState = (
  fields: AdoptionFieldConfig<AdoptionFormState>[]
): AdoptionFormState => {
  const state: FieldState = {};
  fields.forEach((field) => {
    if (field.repeat) return;
    switch (field.type) {
      case 'checkbox':
        state[field.name] = false;
        break;
      case 'number':
        state[field.name] = 0;
        break;
      case 'checkboxGroup':
        state[field.name] = [];
        break;
      case 'file':
        state[field.name] = [];
        break;
      case 'radio':
      case 'select':
        state[field.name] = field.options?.[0]?.value ?? '';
        break;
      default:
        state[field.name] = '';
    }
  });
  return state;
};

// flatten all fields for initial state
const allFields = adoptionFields.flatMap((section) => section.fields);

export const AdoptionForm = () => {
  const [form, setForm] = useState<FieldState>(getInitialState(allFields));
  const [pets, setPets] = useState<PetFields[]>([]);
  const [currentSectionIndex, setCurrentSectionIndex] = useState<number>(0);
  const totalSections = adoptionFields.length;
  const currentSection = adoptionFields[currentSectionIndex];
  const [errors, setErrors] = useState<Record<string, string>>({});

  // For file uploads
  const [photos, setPhotos] = useState<File[]>([]);

  const handleFieldChange = (field: string, value: FieldValue) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => {
      const { [field]: removed, ...rest } = prev;
      return rest; // remove error for this field if it exists
    });
  };

  // Handle repeated pets fields
  useEffect(() => {
    const numberOfPets = Math.max(
      0,
      Math.min(Number(form.numberOfPets) || 0, 10)
    );
    setPets((curr) => {
      const arr = curr.slice(0, numberOfPets);
      while (arr.length < numberOfPets) {
        arr.push({
          name: '',
          species: '',
          age: '',
          sex: '',
          spayedOrNeutered: false,
          breed: '',
        });
      }
      return arr;
    });
  }, [form.numberOfPets]);

  const safeTextInputValue = (val: FieldValue): string | number => {
    if (typeof val === 'string' || typeof val === 'number') return val;
    return '';
  };

  const validateSection = () => {
    const activeSection = adoptionFields[currentSectionIndex];
    const newErrors: Record<string, string> = {};

    activeSection.fields.forEach((field) => {
      if (field.required) {
        // check if the field is conditionally hidden
        if (typeof field.condition === 'function' && !field.condition(form)) {
          return; // skip conditionally hidden fields
        }

        const val = form[field.name];
        if (
          val === undefined ||
          val === null ||
          (typeof val === 'string' && val.trim() === '') ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newErrors[field.name] = `${field.label} is required.`;
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onNextButtonClick = () => {
    if (validateSection()) {
      setErrors({}); // clear errors on valid section change
      setCurrentSectionIndex((i) => i + 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // validation example for photos:
    if (photos.length < 5) {
      alert('Please upload at least 5 photos/videos.');
      return;
    }
    // handle submit as you like
    console.log('Form submitted:', { ...form, pets, photos });
  };

  const renderField = (field: AdoptionFieldConfig, idx?: number) => {
    if (typeof field.condition === 'function' && !field.condition(form))
      return null;

    const label =
      typeof field.label === 'function' && typeof idx === 'number'
        ? field.label(idx)
        : (field.label as string);
    const name = typeof idx === 'number' ? `${field.name}${idx}` : field.name;

    // skip per-pet fields here (handled elsewhere)
    if (field.repeat && typeof idx === 'number') return null;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'password':
        return (
          <div className={styles.formField} key={name}>
            <label className={styles.label}>
              {label}
              <TextInput
                type={field.type}
                hasError={!!errors[field.name]}
                name={name}
                required={field.required}
                min={field.min}
                max={field.max}
                value={safeTextInputValue(form[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
              />
              {errors[field.name] && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {errors[field.name]}
                </div>
              )}
            </label>
          </div>
        );
      case 'number':
        return (
          <div className={styles.formField} key={name}>
            <label>
              {label}
              <TextInput
                type='number'
                hasError={!!errors[field.name]}
                name={name}
                required={field.required}
                min={field.min}
                max={field.max}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                value={safeTextInputValue(form[field.name])}
              />
              {errors[field.name] && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {errors[field.name]}
                </div>
              )}
            </label>
          </div>
        );
      case 'checkbox':
        return (
          <div className={styles.formField} key={name}>
            <label>
              <input
                type='checkbox'
                name={name}
                checked={!!form[field.name]}
                onChange={(e) =>
                  handleFieldChange(field.name, e.target.checked)
                }
              />
              {label}
            </label>
          </div>
        );
      case 'checkboxGroup':
        return (
          <div className={styles.formField} key={name}>
            <span>{label}</span>
            {field.options?.map((opt) => (
              <label key={opt.value}>
                <input
                  type='checkbox'
                  name={`${field.name}_${opt.value}`}
                  checked={
                    Array.isArray(form[field.name]) &&
                    (form[field.name] as string[]).includes(opt.value)
                  }
                  onChange={(e) => {
                    const curr = Array.isArray(form[field.name])
                      ? [...(form[field.name] as string[])]
                      : [];
                    if (e.target.checked) {
                      curr.push(opt.value);
                    } else {
                      const idx = curr.indexOf(opt.value);
                      if (idx > -1) curr.splice(idx, 1);
                    }
                    handleFieldChange(field.name, curr);
                  }}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      case 'textarea':
        return (
          <div className={styles.formField} key={name}>
            <label>
              {label}
              <TextInput
                name={name}
                required={field.required}
                value={safeTextInputValue(form[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                hasError={!!errors[field.name]}
                type='textarea'
              />
              {errors[field.name] && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {errors[field.name]}
                </div>
              )}
            </label>
          </div>
        );
      case 'radio':
        return (
          <div className={styles.formField} key={name}>
            <span>{label}</span>
            {field.options?.map((opt) => (
              <label key={opt.value}>
                <input
                  type='radio'
                  name={field.name}
                  value={opt.value}
                  checked={form[field.name] === opt.value}
                  onChange={() => handleFieldChange(field.name, opt.value)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        );
      case 'select':
        return (
          <div className={styles.formField} key={name}>
            <label>
              {label}
              <select
                name={field.name}
                value={safeTextInputValue(form[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );
      case 'file':
        return (
          <div className={styles.formField} key={name}>
            <PhotoVideoDropzone
              value={photos}
              onChange={setPhotos}
              minFiles={5}
              maxFiles={12}
              required
              error={
                photos.length < 5
                  ? 'At least 5 photos/videos are required.'
                  : undefined
              }
            />
          </div>
        );
      case 'date':
        return (
          <div className={styles.formField} key={name}>
            <label>
              {label}
              <input
                type='date'
                name={name}
                value={safeTextInputValue(form[field.name])}
                onChange={(e) => handleFieldChange(field.name, e.target.value)}
                required={field.required}
              />
            </label>
          </div>
        );
      default:
        return null;
    }
  };

  // Render all fields in all sections
  return (
    <form className={styles.adoptionForm} onSubmit={handleSubmit}>
      <h2 className={styles.adoptionAppHeader}>Adoption Application</h2>
      <div className={styles.formContainer}>
        <h3 className={styles.sectionHeading}>{currentSection.title}</h3>
        <div className={styles.formSection}>
          {currentSection.fields.map((field) => renderField(field))}
        </div>
        {currentSectionIndex > 0 && (
          <Button
            type='button'
            label='Back'
            onClick={() => setCurrentSectionIndex((i) => i - 1)}
          />
        )}
        {currentSectionIndex < totalSections - 1 ? (
          <Button type='button' label='Next' onClick={onNextButtonClick} />
        ) : (
          <Button type='submit' label='Submit' />
        )}
      </div>
      <pre style={{ background: '#eee', marginTop: 20, padding: 12 }}>
        {JSON.stringify({ ...form, pets, photos }, null, 2)}
      </pre>
    </form>
  );
};
