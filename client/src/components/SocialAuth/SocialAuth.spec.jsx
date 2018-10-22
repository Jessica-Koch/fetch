/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import SocialAuth from './SocialAuth';
import { renderTest } from '../../../utils/testUtils';

describe('SocialAuth', () => {
  renderTest(SocialAuth);

  it("doesn't render renders children passed to it", () => {
    const comp = shallow(<SocialAuth>
      <div />
    </SocialAuth>);
    const dv = comp.find('div');
    expect(comp).toContain(dv);
  });
});
