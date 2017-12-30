/* eslint-disable import/no-extraneous-dependencies */
import { action, storiesOf } from '@storybook/react';
import React from 'react';
import classNames from 'classnames';
import Button from './Button';
import Jumbotron from '../Jumbotron';
import '../../../.storybook/base.css';

storiesOf('Button', module)
  .add('default button', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'default')}
        displayText="default"
      />
    </div>
  ))
  .add('link button', () => (
    <div>
      <Button onClick={action('onClick')} className="link" theme="link" displayText="link" />
    </div>
  ))
  .add('ghost button', () => (
    <div>
      <Jumbotron cx="eightVH">
        <Button
          onClick={action('onClick')}
          className={classNames('btn', 'btn-hover', 'ghost')}
          theme="ghost"
          displayText="ghost"
        />
      </Jumbotron>
    </div>
  ))
  .add('green gradient button', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-1')}
        displayText="color-1"
      />
    </div>
  ))
  .add('magenta gradient button', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-2')}
        displayText="color-2"
      />
    </div>
  ))
  .add('lilac :: purple', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-3')}
        displayText="color-3"
      />
    </div>
  ))
  .add('pink :: orange', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-4')}
        displayText="color-4"
      />
    </div>
  ))
  .add('green :: aqua', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-5')}
        displayText="color-5"
      />
    </div>
  ))
  .add('green :: yellow', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-6')}
        displayText="color-6"
      />
    </div>
  ))
  .add('blue :: purple', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-7')}
        displayText="color-7"
      />
    </div>
  ))
  .add('aqua :: teal', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-8')}
        displayText="color-8"
      />
    </div>
  ))
  .add('light :: dark blue', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-9')}
        displayText="color-9"
      />
    </div>
  ))
  .add('pink :: peach', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-10')}
        displayText="color-10"
      />
    </div>
  ))
  .add('red :: pink', () => (
    <div className="container">
      <Button
        onClick={action('onClick')}
        className={classNames('btn', 'btn-hover', 'color-11')}
        displayText="color-11"
      />
    </div>
  ));
