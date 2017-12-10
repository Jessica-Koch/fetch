import React from 'react';
// import PropTypes from 'prop-types';
import styles from './Button.css';

const Button = props => {
  return (
    <button theme={props.theme} className={props.className} onClick={props.onClick}>
      {props.displayText}
    </button>
  );
};

Button.defaultProps = {
  className: 'Button',
  displayText: '',
  href: undefined,
  onClick: () => {},
  theme: 'default',
  type: 'button',
};
export default Button;
