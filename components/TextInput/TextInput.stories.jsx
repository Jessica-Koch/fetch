import React from 'react';
import TextInput from './TextInput';
import { storiesOf } from '@storybook/react';
import '../../.storybook/base.css';

storiesOf('TextInput', module).add('text input', () => {
  return (
    <div style={{ height: '100%', backgroundColor: 'black' }} className="container">
      <TextInput className="TextInput" />
    </div>
  );
});
