import React from 'react';
import Calendar from './Calendar';
import { storiesOf } from '@storybook/react';
import '../../.storybook/base.css';

storiesOf('Calendar', module).add('calendar', () => {
  return (
    <div style={{ height: '100%', backgroundColor: 'black' }} className="container">
      <Calendar className="Calendar" />
    </div>
  );
});
