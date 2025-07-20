// apps/web/src/hooks/useRenderField.tsx
import { ReactElement } from 'react';
import { TextInput } from '../components/TextInput/TextInput';
import { PhotoVideoDropzone } from '../components/PhotoVideoDropzone/PhotoVideoDropzone';
import { DogSelector } from '../components/DogSelector/DogSelector';
import {
  AdoptionFieldConfig,
  FieldState,
  FieldValue,
} from '../components/AdoptionForm/AdoptionForm.types';
import { Dog } from '@fetch/shared';

interface UseRenderFieldProps {
  form: FieldState;
  errors: Record<string, string>;
  onFieldChange: (field: string, value: FieldValue) => void;
  photos?: File[];
  onPhotosChange?: (files: File[]) => void;
  selectedDogs?: Dog[];
  onSelectedDogsChange?: (dogs: Dog[]) => void;
  otherDogName?: string;
  onOtherDogNameChange?: (name: string) => void;
}

export const useRenderField = ({
  form,
  errors,
  onFieldChange,
  photos = [],
  onPhotosChange,
  selectedDogs = [],
  onSelectedDogsChange,
  otherDogName = '',
  onOtherDogNameChange,
}: UseRenderFieldProps) => {
  const safeTextInputValue = (val: FieldValue): string | number => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val;
    return '';
  };

  const safeSelectValue = (val: FieldValue): string => {
    if (typeof val === 'string') return val;
    if (typeof val === 'number') return val.toString();
    return '';
  };

  const safeArrayValue = (val: FieldValue): string[] => {
    if (Array.isArray(val)) {
      // Handle File[] by converting to string[] (using file names)
      if (val.length > 0 && val[0] instanceof File) {
        return (val as File[]).map((file) => file.name);
      }
      // Handle string[] directly
      return val as string[];
    }
    return [];
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
      case 'dogSelector':
        if (!onSelectedDogsChange || !onOtherDogNameChange) {
          console.warn(
            'DogSelector requires onSelectedDogsChange and onOtherDogNameChange callbacks'
          );
          return null;
        }
        return (
          <div key={name}>
            <fieldset>
              <legend>{label}</legend>
              <DogSelector
                selectedDogs={selectedDogs}
                onSelectionChange={onSelectedDogsChange}
                otherDogName={otherDogName}
                onOtherDogNameChange={onOtherDogNameChange}
                required={field.required}
                error={errors[field.name]}
              />
              {field.helperText && <p>{field.helperText}</p>}
            </fieldset>
          </div>
        );

      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={name}>
            <label>
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
          <div key={name}>
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
          <div key={name}>
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
          <fieldset key={name}>
            <legend>{label}</legend>
            {field.options?.map((opt) => (
              <label key={opt.value}>
                <input
                  type='checkbox'
                  name={`${field.name}_${opt.value}`}
                  checked={safeArrayValue(form[field.name]).includes(opt.value)}
                  onChange={(e) => {
                    const curr = [...safeArrayValue(form[field.name])];
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
          </fieldset>
        );

      case 'textarea':
        return (
          <div key={name}>
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
          <fieldset key={name}>
            <legend>{label}</legend>
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
          </fieldset>
        );

      case 'select':
        return (
          <div key={name}>
            <label>
              {label}
              <select
                name={field.name}
                value={safeSelectValue(form[field.name])}
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
          <div key={name}>
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
          <div key={name}>
            <label>
              {label}
              <input
                type='date'
                name={name}
                value={safeSelectValue(form[field.name])}
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
