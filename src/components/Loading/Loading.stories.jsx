/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Loading from './Loading';
import '../../../.storybook/base.css';

storiesOf('Loading', module).add('loading', () => (
  <div className="container">
    <Loading loading />
  </div>
));
