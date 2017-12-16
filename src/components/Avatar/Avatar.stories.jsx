/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Avatar from './Avatar';
import '../../.storybook/base.css';
import { avatar } from './avatar.jpg';

storiesOf('Avatar', module).add('Avatar', () => <Avatar className="Avatar" avatarUrl={avatar} />);
