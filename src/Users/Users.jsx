import React, { Component } from 'react';
import { array } from 'prop-types';
import User from '../User';

import './Users.scss';


class Users extends Component {
  static propTypes = {
    users: array,
  };

  constructor(props) {
    super(props);
    this.state = { users: this.props.users };
  }

  componentDidMount() {
    fetch('/api/users')
      .then(response => response.json())
      .then(users => this.setState({ users }));
  }

  render() {
    const users = this.state.users.map(user => <User key={user.id} user={user} />);

    return (
      <div className="grid-container">
        <div className="header">First Name</div>
        <div className="header">Last Name</div>
        <div className="header">email</div>
        <div className="header">Dog</div>

        {users}
      </div>
      <Switch>
        <Route exact path='/users' component={Users}/>
      </Switch>
    );
  }
}

export default Users;
