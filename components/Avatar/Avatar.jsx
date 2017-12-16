import React from 'react';
import styles from './Avatar.css';

const Avatar = props => (
  <div className="round">
    <img className={styles.Avatar} alt="avatar" src={props.avatarUrl} />
  </div>
);

export default Avatar;
