/* eslint-env react/no-typos */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { arrayOf, func, oneOf, string } from 'prop-types';
import './Button.css';

class Button extends PureComponent {
  static defaultProps = {
    className: 'Button',
    displayText: '',
    theme: 'default',
  };

  static propTypes = {
    className: arrayOf(string),
    displayText: string,
    onClick: func.isRequired,
    theme: oneOf('ghost', 'gradient', 'link'),
  };

  render() {
    const {
      theme, className, onClick, displayText,
    } = this.props;
    return (
      <div className={classNames('Button')}>
        <button theme={theme} className={classNames(className, theme)} onClick={onClick}>
          <span>{displayText}</span>
        </button>
      </div>
    );
  }
}

export default Button;
