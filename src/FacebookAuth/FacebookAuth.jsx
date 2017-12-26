/* eslint func-names: ["error", "never"] */

import React, { Component } from 'react';
import SimpleLineIcon from 'react-simple-line-icons';

class FacebookAuth extends Component {
  debugger;
  componentDidMount() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '484689505260707',
        cookie: true,
        xfbml: true,
        version: 'v2.1',
      });

      window.FB.AppEvents.logPageView();
    };

    this.subscribeToUpdates(window.FB);

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src = 'https://connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }

  getCurrentUser = () => {};

  isLoggedIn = () => {
    window.FB.getLoginStatus((response) => {
      console.log('in isLoggedIn: ', response);
      if (response.status === 'connected') {
        console.log('user is logged in: TODO - redirect to previous page');
      } else {
        window.FB.login();
        console.log('User is not logged in, login failed, create an error.');
      }
    });
  };

  logout = () => {
    window.FB.logout();
  };

  subscribeToUpdates(fb) {
    if (!fb) return;

    fb.event.subscribe('auth.statusChange', () => (response) => {
      if (response.authResponse) {
        this.updateLoggedInState(response);
      } else {
        this.updateLoggedOutState();
      }
    });
  }

  render() {
    return (
      <div className="social">
        <a href="/login/facebook">
          <SimpleLineIcon name=" icon-social-facebook" />
        </a>

        <fb:login-button scope="public_profile,email" onlogin="checkLoginState();" />
      </div>
    );
  }
}

export default FacebookAuth;
