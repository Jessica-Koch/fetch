/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Loader from './Loader';
import '../../../.storybook/base.css';

storiesOf('Loader', module).add('loading', () => (
  <div className="container">
    <Loader loading />
  </div>
));
