import { IconType } from 'react-icons';
import styles from './Checkbox.module.scss';

type CheckboxProps = {
  checkedIcon: IconType;
  uncheckedIcon: IconType;
  className?: string;
  checked: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Checkbox = ({
  checkedIcon: CheckedIcon,
  uncheckedIcon: UncheckedIcon,
  ...props
}: CheckboxProps) => {
  return (
    <label className={styles.checkboxLabel}>
      <input type='checkbox' className={styles.checkboxInput} {...props} />
      {props.checked ? <CheckedIcon /> : <UncheckedIcon />}
    </label>
  );
};
