import React, { Component } from 'react';
import GoogleButton from 'react-google-button';

// const responseGoogle = response => console.log(response);

class GoogleAuth extends Component {
  render() {
    return (
      <div className="mx-1">
        <GoogleButton
          type="light"
          onClick={() => {
            console.log('button clicked');
          }}
        />
      </div>
    );
  }
}
export default GoogleAuth;
