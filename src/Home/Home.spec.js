/* eslint-env jest */
import Home from './Home';
import { shallow } from 'enzyme';

describe('Home', () => {
  it('renders', () => {
    const comp = shallow(<Home />);
    expect(comp).toBePresent();
  });
});
