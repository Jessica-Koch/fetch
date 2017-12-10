import React from 'react';
import Button from './Button';
import { storiesOf } from '@storybook/react';
import '../../.storybook/base.css';

storiesOf('Button', module)
  .add('default button', () => {
    return (
      <div className="container">
        <Button className="Button" displayText="default" />
      </div>
    );
  })
  .add('ghost button', () => {
    return (
      <div className="container" style={{ height: '100%', backgroundColor: '#000000' }}>
        <Button className="ghost" displayText="ghost" />
      </div>
    );
  });
