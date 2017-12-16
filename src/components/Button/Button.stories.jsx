/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import Button from './Button';
import '../../.storybook/base.css';

storiesOf('Button', module)
  .add('story 1', () => <Button label="You should be able to switch backgrounds for this story" />)
  .add('default button', () => (
    <div className="container">
      <Button className="Button" displayText="default" />
    </div>
  ))
  .add('ghost button', () => (
    <div className="container">
      <Button className="ghost" displayText="ghost" />
    </div>
  ));
