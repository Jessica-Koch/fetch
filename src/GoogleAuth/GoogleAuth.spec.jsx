import React, { Component } from 'react';

class GoogleAuth extends Component {
  handleLogin = user => console.log(user);

  handleLoginFailure = (err) => {
    console.log('LoginFailure: ', err);
  };
}

export default GoogleAuth;
