import React from 'react';
import TextInput from './TextInput';
import { storiesOf } from '@storybook/react';
import '../../.storybook/base.css';

storiesOf('TextInput', module).add('text input', () => (
  <div className="container">
    <TextInput className="TextInput" />
  </div>
));
