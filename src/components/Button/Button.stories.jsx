/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import classNames from 'classnames';
import Button from './Button';
import '../../../.storybook/base.css';

storiesOf('Button', module)
  .add('story 1', () => <Button label="You should be able to switch backgrounds for this story" />)
  .add('default button', () => (
    <div className="container">
      <Button className="default" displayText="default" />
    </div>
  ))
  .add('ghost button', () => (
    <div className="container">
      <Button className="ghost" displayText="ghost" />
    </div>
  ))
  .add('green gradient button', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-1')} displayText="green" />
    </div>
  ))
  .add('blue gradient button', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-2')} displayText="blue" />
    </div>
  ))
  .add('button 3', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-3')} displayText="orange" />
    </div>
  ))
  .add('button 4', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-4')} displayText="orange" />
    </div>
  ))
  .add('button 5', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-5')} displayText="orange" />
    </div>
  ))
  .add('button 6', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-6')} displayText="orange" />
    </div>
  ))
  .add('button 7', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-7')} displayText="orange" />
    </div>
  ))
  .add('button 8', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-8')} displayText="orange" />
    </div>
  ))
  .add('button 9', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-9')} displayText="orange" />
    </div>
  ))
  .add('button 10', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-10')} displayText="orange" />
    </div>
  ))
  .add('button 11', () => (
    <div className="container">
      <Button className={classNames('btn', 'color-11')} displayText="orange" />
    </div>
  ));
