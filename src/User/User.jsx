import React, { Component } from 'react';
import { array, string } from 'prop-types';
import { Link } from 'react-router-dom';

class User extends Component {
  static propTypes = {
    firstName: string.isRequired,
    lastName: string.isRequired,
    email: string.isRequired,
    dogs: array.isRequired,
    linkTo: string.isRequired,
  };

  render() {
    const {
      firstName, lastName, email, dogs, linkTo,
    } = this.props;
    return (
      <div className="grid-row">
        <div className="grid-col">
          <Link to={`/users/${linkTo}`}>{firstName}</Link>
        </div>
        <div className="grid-col">
          <Link to={`/users/${linkTo}`}>{lastName}</Link>
        </div>
        <div className="grid-col">{email}</div>
        <div className="grid-col">{dogs}</div>
      </div>
    );
  }
}

export default User;
