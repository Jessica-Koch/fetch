import React from 'react';
import SocialLogin from 'react-social-login';
import GoogleButton from 'react-google-button';

const SocialAuth = ({ children, triggerLogin, ...props }) => (
  <GoogleButton type="light" onClick={triggerLogin} {...props}>
    {children}
  </GoogleButton>
);

export default SocialLogin(SocialAuth);
