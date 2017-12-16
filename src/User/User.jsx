import React, { PureComponent } from 'react';
import { array, string } from 'prop-types';

class User extends PureComponent {
  static propTypes = {
    firstName: string.isRequired,
    lastName: string.isRequired,
    email: string.isRequired,
    dogs: array.isRequired,
  };

  render() {
    const {
      firstName, lastName, email, dogs,
    } = this.props;
    return (
      <div className="grid-row">
        <div className="grid-col">{firstName}</div>
        <div className="grid-col">{lastName}</div>
        <div className="grid-col">{email}</div>
        <div className="grid-col">{dogs}</div>
      </div>
    );
  }
}

export default User;
