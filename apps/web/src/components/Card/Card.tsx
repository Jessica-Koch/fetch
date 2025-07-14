import { Dog } from '@fetch/shared';
import styles from './Card.module.scss';
import huskyImage from '../../assets/husky.png';
import { IconButton } from '../IconButton';
import { PiHeartBold, PiHeartFill } from 'react-icons/pi';

type CardProps = {
  onClick: (dog: Dog) => void;
  dog: Dog;
  isDogSelected?: boolean;
};

export const Card = ({ onClick, dog, isDogSelected }: CardProps) => {
  const imageUrl = dog.photos?.[0] || huskyImage;
  const age = dog.age < 1 ? 'Less than a year old' : `${dog.age} years old`;

  const onDogClick = () => {
    onClick(dog);
  };

  return (
    <div className={styles.dogCard}>
      {isDogSelected ? (
        <IconButton
          label='add to application'
          onClick={onDogClick}
          icon={PiHeartFill}
          className={styles.selectDogButton}
          iconClassName={styles.icon}
        />
      ) : (
        <IconButton
          label='add to application'
          onClick={onDogClick}
          icon={PiHeartBold}
          className={styles.selectDogButton}
          iconClassName={styles.icon}
        />
      )}
      <div
        className={styles.dogImage}
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className={styles.dogInfo}>
        <h3 className={styles.dogName}>{dog.name}</h3>
        <p className={styles.dogBreed}>{dog.breed}</p>
        <p className={styles.gender}>
          {dog.gender.toLowerCase() === 'male' ? 'Male' : 'Female'}
        </p>
        <p className={styles.dogAge}>{age}</p>
      </div>
    </div>
  );
};
