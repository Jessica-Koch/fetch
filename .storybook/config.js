import path from 'path';
import { configure } from '@storybook/react';

const req = require.context('..', true, /components\/.*\.stories\.jsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
  // require('../src/stories');
}

configure(loadStories, module);
