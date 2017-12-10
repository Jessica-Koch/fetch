import React, { Component } from 'react';
import styles from './TextInput.css';

const TextInput = props => {
  return (
    <div>
      <input className={props.className} />
    </div>
  );
};

TextInput.defaultProps = {
  className: undefined,
  theme: 'default',
  type: 'text',
  value: '',
};

export default TextInput;
