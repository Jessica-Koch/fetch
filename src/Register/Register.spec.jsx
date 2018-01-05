/* eslint-env jest */
import React from 'react';
import { shallow } from 'enzyme';
import { Alert } from 'reactstrap';
import FacebookAuth from '../FacebookAuth';
import Register from './Register';
import { renderTest } from '../../utils/testUtils';

describe('Register', () => {
  renderTest(Register, { visible: true });

  it('renders facebook auth if there is no username', () => {
    const comp = shallow(<Register username={null} />);
    const fb = comp.find(<FacebookAuth />);
    expect(fb).not.toBe(undefined);
  });

  it("sets the state to the user's name", () => {
    const comp = shallow(<Register username={null} />);
    const instance = comp.instance();

    instance.onFacebookLogin(true, { user: { name: 'Jess' } });
    expect(comp.state('username')).toBe('Jess');
  });

  it('renders alert if loginStatus is false', () => {
    const comp = shallow(<Register username={null} />);
    const instance = comp.instance();
    const alert = comp.find(<Alert />);

    instance.onFacebookLogin(false, { user: { name: '' } });
    expect(alert).not.toBe(undefined);
  });
});
