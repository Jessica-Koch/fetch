import { Dog } from '@fetch/shared';
import styles from './Card.module.scss';
import huskyImage from '../../assets/husky.png';

type CardProps = {
  onClick: () => void;
  dog: Dog;
};

export const Card = ({ onClick, dog }: CardProps) => {
  const imageUrl = dog.photos?.[0] || huskyImage;
  const age = dog.age < 1 ? 'Less than a year old' : `${dog.age} years old`;
  return (
    <div className={styles.dogCard} onClick={onClick}>
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
