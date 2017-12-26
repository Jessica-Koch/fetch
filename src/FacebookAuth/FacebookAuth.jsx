import React, { Component } from 'react';
import SimpleLineIcon from 'react-simple-line-icons';

class FacebookAuth extends Component {
  responseFacebook(response) {
    console.log(response);
  }

  render() {
    return (
      <div className="social">
        <a href="/login/facebook">
          <SimpleLineIcon name=" icon-social-facebook" />
        </a>
      </div>
    );
  }
}

export default FacebookAuth;
