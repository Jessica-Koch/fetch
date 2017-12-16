import React, { PureComponent } from 'react';
import { func, string } from 'prop-types';
import styles from './Button.css';

class Button extends PureComponent {
  static defaultProps = {
    className: 'Button',
    displayText: '',
    theme: 'default',
    type: 'button',
  };

  render() {
    const { theme, className, onClick, displayText } = this.props;
    return (
      <button theme={theme} className={className} onClick={onClick}>
        {displayText}
      </button>
    );
  }
}

Button.propTypes = {
  className: string,
  displayText: string,
  onClick: func.isRequired,
  theme: string,
  type: string,
};
export default Button;
