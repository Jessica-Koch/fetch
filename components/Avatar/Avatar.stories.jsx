import React from 'react';
import Avatar from './Avatar';
import { storiesOf } from '@storybook/react';
import '../../.storybook/base.css';
import avatar from './avatar.jpg';

storiesOf('Avatar', module).add('Avatar', () => {
  return (
    <div className="container" height="100%">
      <Avatar className="Avatar" avatarUrl={avatar} />
    </div>
  );
});
