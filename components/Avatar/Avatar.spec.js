import React from 'react';
import Avatar from './Avatar';
import ReactDOM from 'react-dom';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Avatar avatarUrl="someUrl" />, div);
});
