import React, { Component } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import './UserList.css';
import User from '../User';
//
// const dogShape = shape({
//   name: string,
//   breed: string,
//   sex: string,
//   birthday: instanceOf(Date),
// });
//
const userShape = shape({
  firstName: string,
  lastName: string,
  phoneNumber: string,
  email: string,
  // dogs: arrayOf(dogShape),
});

class UserList extends Component {
  static propTypes = {
    users: arrayOf(userShape),
  };

  static defaultProps = {
    users: [],
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
      <div className="UserList">
        <h1>This is a User List Page</h1>
        <div className="grid-container">
          <div className="t-header">First Name</div>
          <div className="t-header">Last Name</div>
          <div className="t-header">email</div>
          <div className="t-header">Dogs</div>
          {users}
        </div>
      </div>
    );
  }
}

export default UserList;
