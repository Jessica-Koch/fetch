import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import styles from './TextInput.css';

class TextInput extends PureComponent {
  static defaultProps = {
    cx: undefined,
    theme: 'default',
    type: 'text',
    value: '',
  };

  static propTypes = {
    cx: string,
    theme: string,
    type: string,
    value: string,
  };

  render() {
    const {
      cx, theme, type, value,
    } = this.props;
    return (
      <div className={cx}>
        <input type={type} value={value} theme={theme} />
      </div>
    );
  }
}

export default TextInput;
