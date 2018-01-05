import React, { Component } from 'react';
import { shape, string } from 'prop-types';
import { Link } from 'react-router-dom';
import Jumbotron from '../components/Jumbotron/';
import { userShape } from '../lib/shapes/user';
import './User.css';

class User extends Component {
  static propTypes = {
    user: shape(userShape).isRequired,
    linkTo: string.isRequired,
  };

  render() {
    const { user, linkTo } = this.props;
    return (
      <div className="row">
        <Jumbotron cx="eightVH" header="Members" subheader="some of your community" />

        <div className="cell">
          <Link to={`/users/${linkTo}`}>{user.name}</Link>
        </div>
        
        <div className="cell">{user.email}</div>
        <div className="grid-col">'user.dogs'</div>
      </div>
    );
  }
}

export default User;
