import React, { Component } from 'react';
import SimpleLineIcon from 'react-simple-line-icons';
// import GoogleLogin from 'react-googlse-login';

// const responseGoogle = response => console.log(response);

class GoogleAuth extends Component {
  render() {
    return (
      <div className="social">
        <a href="/api/auth/google">
          <SimpleLineIcon name=" icon-social-google" />
        </a>
      </div>
      // <GoogleLogin
      //   clientId=""
      //   buttonText="Login"
      //   onSuccess={responseGoogle}
      //   onFailure={responseGoogle}
      // />
    );
  }
}
export default GoogleAuth;
