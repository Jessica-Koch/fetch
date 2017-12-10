import React from 'react';
import ReactDOM from 'react-dom';
import TextInput from './TextInput';

describe('TextInput', () => {
  it('should render without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<TextInput />, div);
  });
});
