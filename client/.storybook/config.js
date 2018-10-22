import path from 'path';
import { configure } from '@storybook/react';
import { setDefaults } from '@storybook/addon-info';

// addon-info
setDefaults({
  // options here: https://github.com/storybooks/storybook/tree/master/addons/info#options-and-defaults
  header: false, // Toggles display of header with component name and description
  inline: true, // Displays info inline vs click button to view
  source: true, // Displays the source of story Component
});
const req = require.context('..', true, /components\/.*\.stories\.jsx$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);
