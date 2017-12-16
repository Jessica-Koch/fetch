/* eslint-env react/no-typos */
import React, { PureComponent } from 'react';
import { func, string } from 'prop-types';

class Button extends PureComponent {
  static defaultProps = {
    className: 'Button',
    displayText: '',
    theme: 'default',
  };

  static propTypes = {
    className: string,
    displayText: string,
    onClick: func.isRequired,
    theme: string,
  };

  render() {
    const {
      theme, className, onClick, displayText,
    } = this.props;
    return (
      <button theme={theme} className={className} onClick={onClick}>
        {displayText}
      </button>
    );
  }
}

export default Button;
