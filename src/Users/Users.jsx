import React, { Component } from 'react';
// import { Switch, Route } from 'react-router-dom';

// import { array } from 'prop-types';
// import User from '../User';
import './Users.css';

class Users extends Component {
  // static propTypes = {
  //   users: array,
  // };

  // static defaultProps = {
  //   users: [],
  // };
  //
  // constructor(props) {
  //   super(props);
  //   this.state = { users: this.props.users };
  // }

  // componentDidMount() {
  //   fetch('/api/users')
  //     .then(response => response.json())
  //     .then(users => this.setState({ users }));
  // }

  render() {
    // const users = this.state.users.map(user => (
    //   // <User key={user.id} user={user} linkTo={`/users/${user.id}`} />
    // ));

    return (
      <div className="grid-container">
        <div className="header">First Name</div>
        <div className="header">Last Name</div>
        <div className="header">email</div>
        <div className="header">Dogs</div>

        {/* {users} */}
      </div>
    );
  }
}

export default Users;
