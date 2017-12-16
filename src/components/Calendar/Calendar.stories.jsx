/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Calendar from './Calendar';
import '../../../.storybook/base.css';

storiesOf('Calendar', module).add('calendar', () => (
  <div className="container">
    <Calendar className="Calendar" />
  </div>
));
