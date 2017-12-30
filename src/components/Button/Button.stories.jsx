/* eslint-disable import/no-extraneous-dependencies */
import { storiesOf } from '@storybook/react';
import React from 'react';
import classNames from 'classnames';
import Button from './Button';
import Jumbotron from '../Jumbotron';
import '../../../.storybook/base.css';

storiesOf('Button', module)
  .add('default button', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'default')} displayText="default" />
    </div>
  ))
  .add('link button', () => (
    <div>
      <Button className="link" theme="link" displayText="link" />
    </div>
  ))
  .add('ghost button', () => (
    <div>
      <Jumbotron cx="eightVH">
        <Button
          className={classNames('btn', 'btn-hover', 'ghost')}
          theme="ghost"
          displayText="ghost"
        />
      </Jumbotron>
    </div>
  ))
  .add('green gradient button', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-1')} displayText="green" />
    </div>
  ))
  .add('blue gradient button', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-2')} displayText="blue" />
    </div>
  ))
  .add('button 3', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-3')} displayText="orange" />
    </div>
  ))
  .add('button 4', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-4')} displayText="orange" />
    </div>
  ))
  .add('button 5', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-5')} displayText="orange" />
    </div>
  ))
  .add('button 6', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-6')} displayText="orange" />
    </div>
  ))
  .add('button 7', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-7')} displayText="orange" />
    </div>
  ))
  .add('button 8', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-8')} displayText="orange" />
    </div>
  ))
  .add('button 9', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-9')} displayText="orange" />
    </div>
  ))
  .add('button 10', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-10')} displayText="orange" />
    </div>
  ))
  .add('button 11', () => (
    <div className="container">
      <Button className={classNames('btn', 'btn-hover', 'color-11')} displayText="orange" />
    </div>
  ));
