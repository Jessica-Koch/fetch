import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import UserList from '../UserList';
import User from '../User';
import './Users.css';

class Users extends Component {
  render() {
    return (
      <div className="Users">
        <Switch>
          <Route exact path="/users" component={UserList} />
          <Route exact path="/users/:number" component={User} />
        </Switch>
      </div>
    );
  }
}

export default Users;
