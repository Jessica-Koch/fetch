import React from 'react';
import { shallow } from 'enzyme';

export const renderTest = (
  Component,
  props = {},
  itText = 'should render',
  describeText = 'render',
) => {
  describe(describeText, () => {
    it(itText, () => {
      const comp = shallow(<Component {...props} />);
      expect(comp).toBePresent();
    });
  });
};
