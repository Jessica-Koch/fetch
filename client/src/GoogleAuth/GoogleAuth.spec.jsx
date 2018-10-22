import React from 'react';
import { renderTest } from '../../utils/testUtils';
import GoogleAuth from './GoogleAuth';
import GoogleAuth2 from './GoogleAuth2';

describe('GoogleAuth', () => {
  renderTest(GoogleAuth);
  renderTest(GoogleAuth2);
});
