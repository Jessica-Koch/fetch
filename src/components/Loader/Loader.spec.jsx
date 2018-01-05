/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Loader from './Loader';
import { renderTest } from '../../../utils/testUtils';

describe('Loader', () => {
  renderTest(Loader, { visible: true });

  it("doesn't render if not visible", () => {
    const comp = shallow(<Loader visible={false} />);

    expect(comp.instance()).toBeUndefined();
  });
});
