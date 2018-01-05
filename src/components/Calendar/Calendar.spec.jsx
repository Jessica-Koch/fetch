/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import Calendar from './Calendar';
import { renderTest } from '../../../utils/testUtils';

describe('Calendar', () => {
  renderTest(Calendar, { onSelect: Function.prototype });

  describe('selectedDate', () => {
    const comp = shallow(<Calendar />);
    const instance = comp.instance();
    const spy = jest.spyOn(instance, 'onSelect');
    expect(comp.state('selectedDate')).toBe(undefined);

    instance.onSelect('06/13/2018');
    expect(spy).toHaveBeenCalled();
    expect(comp.state('selectedDate')).toBe('06/13/2018');
    spy.mockReset();
    spy.mockRestore();
  });
});
