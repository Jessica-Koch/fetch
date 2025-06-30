import styles from './TextInput.module.scss';

type TextInputProps = {
  className?: string;
  disabled?: boolean;
  max?: number;
  min?: number;
  name: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  type: 'text' | 'tel' | 'number' | 'email' | 'password' | 'textarea';
  value: string | number;
};

export const TextInput = ({
  className,
  disabled,
  max,
  min,
  name,
  onChange,
  required,
  type,
  value,
}: TextInputProps) => {
  return type === 'textarea' ? (
    <>
      <textarea
        className={`${styles.textInput} ${className}`}
        required={required}
        value={value}
        name={name}
        onChange={onChange}
        disabled={disabled}
      />
      <span className='focus-border'></span>
    </>
  ) : (
    <>
      <input
        className={`${styles.textInput} ${className}`}
        disabled={disabled}
        max={max}
        min={min}
        name={name}
        onChange={onChange}
        required={required}
        type={type}
        value={value}
      />
      <span className='focus-border'></span>
    </>
  );
};
