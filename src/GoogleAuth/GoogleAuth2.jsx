import React, { Component } from 'react';
import { GoogleAPI, GoogleLogin, GoogleLogout } from 'react-google-oauth';
import { bool, node, string } from 'prop-types';

const responseGoogle = (response) => {
  console.log(response);
};
class GoogleAuth extends Component {
  static propTypes = {
    fetchBasicProfile: bool,
    scope: string,
  };
  static defaultProps = {
    fetchBasicProfile: false,
    scope: 'profile',
  };

  onSignIn = (googleUser) => {
    const profile = googleUser.getBasicProfile();
    console.log(`ID: ${profile.getId()}`); // Do not send to your backend! Use an ID token instead.
    console.log(`Name: ${profile.getName()}`);
    console.log(`Image URL: ${profile.getImageUrl()}`);
    console.log(`Email: ${profile.getEmail()}`); // This is null if the 'email' scope is no
  };

  clickHandler = () => {
    const auth2 = window.gapi.auth2.getAuthInstance();
    auth2.signIn().then(googleUser => console.log(googleUser));
  };

  render() {
    return (
      <GoogleAPI
        clientId="875263736017-mj90dtotqnkbiio3b38rtaq8tomqc3da.apps.googleusercontent.com"
        onUpdateSigninStatus={responseGoogle}
        onInitFailure={responseGoogle}
      >
        <div>
          <div>
            <GoogleLogin />
          </div>
          <div>
            <GoogleLogout />
          </div>
        </div>
      </GoogleAPI>
    );
  }
}
export default GoogleAuth;
