/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Calendar from './Calendar';

describe('Calendar', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const comp = shallow(<Calendar />);
      expect(comp).toBePresent();
    });
  });
});
