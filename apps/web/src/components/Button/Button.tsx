import styles from './Button.module.scss';

type ButtonProps = {
  className?: string;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
};

export const Button = ({
  className,
  disabled,
  label,
  onClick,
  type = 'button',
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${styles.button} ${className}`}
    >
      {label}
    </button>
  );
};
