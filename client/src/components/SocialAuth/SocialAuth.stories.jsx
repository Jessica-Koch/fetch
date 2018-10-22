import React from 'react';
import { action, storiesOf } from '@storybook/react';
import SocialAuth from './SocialAuth';

storiesOf('SocialAuth', module)
  .add('google', () => (
    <div>
      <SocialAuth
        provider="google"
        appId="875263736017-mj90dtotqnkbiio3b38rtaq8tomqc3da.apps.googleusercontent.com"
      />
    </div>
  ))
  .add('facebook', () => (
    <div>
      <SocialAuth
        provider="facebook"
        appId="875263736017-mj90dtotqnkbiio3b38rtaq8tomqc3da.apps.googleusercontent.com"
      >
        <div
          className="fb-login-button"
          data-width="240px"
          data-max-rows="1"
          data-size="large"
          data-button-type="login_with"
          data-show-faces="false"
          data-auto-logout-link="true"
          data-use-continue-as="false"
        />
      </SocialAuth>
    </div>
  ));
