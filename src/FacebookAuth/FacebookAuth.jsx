/* eslint func-names: ["error", "never"] */
import React, { Component } from 'react';
import SimpleLineIcon from 'react-simple-line-icons';
import { string } from 'prop-types';
import './FacebookAuth.css';
import Loading from '../components/Loading';

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
        cookie: true,
        xfbml: true,
        version: 'v2.8',
      });

      window.FB.AppEvents.logPageView();
    };

    // window.FB.getLoginStatus((response) => {
    //   this.statusChangeCallback(response);
    // });
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

  // called with results from FB.getLoginStatus()
  statusChangeCallback = (response) => {
    console.log('statusChangeCallback');
    console.log('response: ', response);

    if (response.status === 'connected') {
      console.log('user is logged in: TODO - redirect to previous page');

      this.setState({ status: '' });
      this.testAPI();
    } else {
      // TODO create an alert or error component
      console.log('User is not logged in, login failed, create an error.');
      this.setState({ status: 'Please log into this app' });
    }
  };

  // Called after someone has interacted with the
  // login button and either logged in or not
  checkLoginState = () => {
    window.FB.getLoginStatus((response) => {
      this.statusChangeCallback(response);
    });
  };

  testAPI = () => {
    this.setState({ loading: true });
    console.log('Welcome!  Fetching your information.... ');
    window.FB.api('/me', (response) => {
      console.log(`Successful login for: ${response.name}`);
      document.getElementById('status').innerHTML = `Thanks for logging in, ${response.name}!`;
      this.setState({ loading: false });
    });
  };

  subscribeToUpdates = (fb) => {
    if (!fb) return;

    fb.event.subscribe('auth.statusChange', () => (response) => {
      if (response.authResponse) {
        this.updateLoggedInState(response);
      } else {
        this.updateLoggedOutState();
      }
    });
  };

  render() {
    const { status, loading } = this.state;
    return (
      <div className="social">
        {loading && (
          <div className="loading">
            <Loading visible />
          </div>
        )}
        <div id="status">{status}</div>
        <div className="row">
          <span className="fb">
            <SimpleLineIcon
              scope="public_profile,email"
              onClick={this.checkLoginState}
              name=" icon-social-facebook"
            />
          </span>
        </div>
      </div>
    );
  }
}

export default FacebookAuth;
