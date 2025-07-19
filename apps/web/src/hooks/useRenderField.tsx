// apps/web/src/components/AdoptionForm/AdoptionForm.tsx
import { ReactElement } from 'react';
import { TextInput } from '../components/TextInput/TextInput';
import { PhotoVideoDropzone } from '../components/PhotoVideoDropzone/PhotoVideoDropzone';
import {
  AdoptionFieldConfig,
  FieldState,
  FieldValue,
} from '../components/AdoptionForm/AdoptionForm.types';
import styles from '../components/AdoptionForm/AdoptionForm.module.scss';

interface UseRenderFieldProps {
  form: FieldState;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: FieldValue) => void;
  photos?: File[];
  onPhotosChange?: (files: File[]) => void;
}

export const useRenderField = ({
  form,
  errors,
  onFieldChange,
  photos = [],
  onPhotosChange,
}: UseRenderFieldProps) => {
  const safeTextInputValue = (val: FieldValue): string | number => {
    if (typeof val === 'string' || typeof val === 'number') return val;
    return '';
  };

  const renderField = (
    field: AdoptionFieldConfig,
    idx?: number
  ): ReactElement | null => {
    if (typeof field.condition === 'function' && !field.condition(form)) {
      return null;
    }

    const label =
      typeof field.label === 'function' && typeof idx === 'number'
        ? field.label(idx)
        : (field.label as string);

    const name = typeof idx === 'number' ? `${field.name}${idx}` : field.name;

    // Skip repeated fields if idx is provided
    if (field.repeat && typeof idx === 'number') return null;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
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
                onChange={(e) => onFieldChange(field.name, e.target.value)}
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
                onChange={(e) => onFieldChange(field.name, e.target.value)}
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
                onChange={(e) => onFieldChange(field.name, e.target.checked)}
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
                    onFieldChange(field.name, curr);
                  }}
                />
                {opt.label}
              </label>
            ))}
            {errors[field.name] && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {errors[field.name]}
              </div>
            )}
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
                onChange={(e) => onFieldChange(field.name, e.target.value)}
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
                  onChange={() => onFieldChange(field.name, opt.value)}
                />
                {opt.label}
              </label>
            ))}
            {errors[field.name] && (
              <div style={{ color: 'red', fontSize: 12 }}>
                {errors[field.name]}
              </div>
            )}
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
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                required={field.required}
              >
                {field.options?.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              {errors[field.name] && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {errors[field.name]}
                </div>
              )}
            </label>
          </div>
        );

      case 'file':
        if (!onPhotosChange) {
          console.warn('File field requires onPhotosChange callback');
          return null;
        }
        return (
          <div className={styles.formField} key={name}>
            <PhotoVideoDropzone
              value={photos}
              onChange={onPhotosChange}
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
                onChange={(e) => onFieldChange(field.name, e.target.value)}
                required={field.required}
              />
              {errors[field.name] && (
                <div style={{ color: 'red', fontSize: 12 }}>
                  {errors[field.name]}
                </div>
              )}
            </label>
          </div>
        );

      default:
        return null;
    }
  };

  return { renderField };
};
