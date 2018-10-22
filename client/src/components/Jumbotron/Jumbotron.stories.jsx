import { storiesOf } from '@storybook/react';
import React from 'react';
import Jumbotron from './Jumbotron';
import '../../../.storybook/base.css';

storiesOf('Jumbotron', module)
  .add('Jumbotron main', () => (
    <Jumbotron header="Welcome to Fetch" cx="nineVH" subheader="Finding your fun" />
  ))
  .add('Jumbotron 80% vh', () => (
    <Jumbotron header="Welcome to Fetch" cx="eightVH" subheader="Finding your fun" />
  ))
  .add('Jumbotron 70% vh', () => (
    <Jumbotron header="Welcome to Fetch" cx="sevenVH" subheader="Finding your fun" />
  ))
  .add('Jumbotron 60% vh', () => (
    <Jumbotron header="Welcome to Fetch" cx="sixVH" subheader="Finding your fun" />
  ))
  .add('Jumbotron 50% vh', () => (
    <Jumbotron header="Welcome to Fetch" cx="fiveVH" subheader="Finding your fun" />
  ))
  .add('Jumbotron 40% vh', () => (
    <Jumbotron header="Welcome to Fetch" cx="fourVH" subheader="Finding your fun" />
  ));
