/* eslint-env jest */
import Avatar from './Avatar';
import { renderTest } from '../../../utils/testUtils';

describe('Avatar', () => {
  renderTest(Avatar, { avatarUrl: 'immaurl' });
});
