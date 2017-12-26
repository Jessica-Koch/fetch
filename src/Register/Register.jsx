import React, { Component } from 'react';
import classNames from 'classnames';
import './Register.css';
import GoogleAuth from '../GoogleAuth';
import FacebookAuth from '../FacebookAuth';

class Register extends Component {
  render() {
    return (
      <div className="Register">
        <h1 className={classNames('gradient3', 'text-center')}>Authentication</h1>
        <div className="social-buttons">
          <GoogleAuth />
          <FacebookAuth />
        </div>
        {/* <div className="container">
          <form>
            <div className="form-group">
          <label htmlFor="username">
          Username
          <input type="text" className="form-control" id="username" placeholder="Username" />
          </label>
            </div>
            <div className="form-group">
          <label htmlFor="password">
          Password
          <input
          type="password"
          className="form-control"
          id="password"
          placeholder="Password"
          />
          </label>
            </div>
            <button type="button" className="btn btn-primary center-block" onClick="auth()">
          Submit
            </button>
          </form>
          <div id="token-display" />
          </div>

          <div className="container">
          <form>
            <div className="form-group">
          <label htmlFor="token">
          Username
          <input className="form-control" id="token" placeholder="token" type="text" />
          </label>
            </div>
            <button type="button" className="btn btn-primary center-block" onClick="getlist()">
          Get List
            </button>
          </form>
          <div id="list" />
        </div> */}
      </div>
    );
  }
}
export default Register;
