import React, { Component } from 'react';
import classNames from 'classnames';
import Jumbotron from '../components/Jumbotron/';
import './Register.css';
import GoogleAuth from '../GoogleAuth';
import FacebookAuth from '../FacebookAuth';
import { Alert } from 'reactstrap';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: null,
    };
  }

  onFacebookLogin = (loginStatus, resultObject) => {
    if (loginStatus === true) {
      this.setState({
        username: resultObject.user.name,
      });
    } else {
      return <Alert color="danger">Facebook login error</Alert>;
    }
  };

  render() {
    const { username } = this.state;

    return (
      <div className="Register">
        <Jumbotron cx="eightVH" header="Join Our pack" />
        <div className="my-4">
          <h1 className={classNames('gradient3', 'text-center')}>Authentication</h1>
          <div className="social-buttons">
            {/* <GoogleAuth /> */}
            {!username && (
              <div>
                <FacebookAuth onLogin={this.onFacebookLogin}>
                  <button>Facebook</button>
                </FacebookAuth>
              </div>
            )}
            {username && <p>Welcome back, {username}</p>}
          </div>
        </div>
      </div>
    );
  }
}
export default Register;
