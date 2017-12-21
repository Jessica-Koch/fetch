/* eslint-disable import/no-extraneous-dependencies */
import { action, storiesOf } from '@storybook/react';
import React from 'react';
import Calendar from './Calendar';
import '../../../.storybook/base.css';

storiesOf('Calendar', module).add('calendar', () => (
  <div className="container">
    <Calendar onSelect={action('onSelect')} minDate={new Date()} className="Calendar" />
  </div>
));
