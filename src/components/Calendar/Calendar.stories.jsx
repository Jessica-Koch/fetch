import React from 'react';
import Calendar from './Calendar';
import { storiesOf } from '@storybook/react';
import '../../../.storybook/base.css';

storiesOf('Calendar', module).add('calendar', () => (
  <div className="container">
    <Calendar className="Calendar" />
  </div>
));
