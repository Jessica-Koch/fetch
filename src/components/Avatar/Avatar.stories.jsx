/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Avatar from './Avatar';
import '../../../.storybook/base.css';
import avatar from './avatar.jpeg';

storiesOf('Avatar', module).add('Avatar', () => (
  <div
    style={{
      height: '100%',
      display: 'flex',
      margin: '0 auto',
      flexdirection: 'column',
    }}
  >
    <Avatar className="Avatar" avatarUrl={avatar} />
  </div>
));
