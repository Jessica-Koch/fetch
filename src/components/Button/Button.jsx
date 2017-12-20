/* eslint-env react/no-typos */
import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { func, string } from 'prop-types';
import './Button.css';

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
      <div className={classNames('border', 'Button')}>
        <button
          theme={theme}
          className={classNames('btn', 'btn-hover', className)}
          onClick={onClick}
        >
          {displayText}
        </button>
      </div>
    );
  }
}

export default Button;
