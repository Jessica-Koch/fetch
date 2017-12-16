/* eslint-env jest */
import Button from './Button';
import { renderTest } from '../../utils/testUtils';

it('renders without crashing', () => {
  renderTest(Button);
});
