import styles from './TextInput.module.scss';

type TextInputProps = {
  className?: string;
  disabled?: boolean;
  max?: number;
  min?: number;
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  type: 'text' | 'tel' | 'number' | 'email' | 'password';
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
  return (
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
  );
};
