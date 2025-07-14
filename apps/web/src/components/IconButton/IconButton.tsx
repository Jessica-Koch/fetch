import styles from './IconButton.module.scss';
import { IconType } from 'react-icons';

type IconButtonProps = {
  iconClassName?: string;
  className?: string;
  disabled?: boolean;
  label: string;
  onClick?: () => void;
  icon: IconType;
};

export const IconButton = ({
  className,
  iconClassName,
  disabled,
  icon: Icon,
  onClick,
  label,
}: IconButtonProps) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${styles.iconButton} ${className}`}
      aria-label={label}
    >
      <Icon className={iconClassName} />
    </button>
  );
};
