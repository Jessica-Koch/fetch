import React, { Component } from 'react';
import styles from './Avatar.css';

const Avatar = props => {
  return (
    <div className="round">
      <img className="Avatar" src={props.avatarUrl} />
    </div>
  );
};

export default Avatar;
