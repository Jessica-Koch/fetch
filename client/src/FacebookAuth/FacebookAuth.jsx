/* eslint func-names: ["error", "never"] */
import React, { Component } from 'react';
import { string } from 'prop-types';
import './FacebookAuth.css';
import Loader from '../components/Loader';

class FacebookAuth extends Component {
  static propTypes = {
    status: string,
  };

  static defaultProps = {
    status: '',
  };

  constructor(props) {
    super(props);

    this.state = { status: props.status, loading: false };
  }

  componentDidMount() {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '484689505260707',
        autoLogAppEvents: true,
        xfbml: true,
        version: 'v2.11',
      });

      // Broadcast an event when FB object is ready
      // const fbInitEvent = new Event('FBObjectReady');
      // document.dispatchEvent(fbInitEvent);
      window.FB.AppEvents.logPageView();
    };

    (function (d, s, id) {
      const fjs = d.getElementsByTagName(s)[0];

      if (d.getElementById(id)) return;
      const js = d.createElement(s);
      js.id = id;
      js.src =
        'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v2.11&appId=484689505260707';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    document.addEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  componentWillUnmount() {
    document.removeEventListener('FBObjectReady', this.initializeFacebookLogin);
  }

  /**
   * Init FB object and check Facebook Login status
   */
  initializeFacebookLogin = () => {
    this.FB = window.FB;
    this.checkLoginStatus();
  };

  /**
   * Check login status
   */
  checkLoginStatus = () => {
    this.FB.getLoginStatus(this.facebookLoginHandler);
  };

  /**
   * Check login status and call login api if user is not logged in
   */
  facebookLogin = () => {
    if (!this.FB) return;

    this.FB.getLoginStatus((response) => {
      if (response.status === 'connected') {
        this.facebookLoginHandler(response);
      } else {
        this.FB.login(this.facebookLoginHandler, { scope: 'public_profile' });
      }
    });
  };

  facebookLogout = () => {};

  /**
   * Handle login response
   */
  facebookLoginHandler = (response) => {
    if (response.status === 'connected') {
      this.FB.api('/me', (userData) => {
        const result = {
          ...response,
          user: userData,
        };
        this.props.onLogin(true, result);
      });
    } else {
      console.log('in facebookLoginHandler: else statement response: ', response);
      this.props.onLogin(false);
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <div>
        {loading && (
          <div className="loading">
            <Loader visible />
          </div>
        )}
        <div id="fb-root" className="mx-1">
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
        </div>
      </div>
    );
  }
}

export default FacebookAuth;
