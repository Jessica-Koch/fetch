import React, { Component } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import classNames from 'classnames';
import Jumbotron from '../components/Jumbotron/';
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
  name: string,
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
        <Jumbotron cx="eightVH" header="Members" subheader="some of your community" />

        <h1 className="gradient1">This is a User List Page</h1>
        <div className="grid-container">
          <div className="header-container">
            <div className={classNames('gradient2', 't-header')}> Name</div>
            <div className={classNames('gradient2', 't-header')}>email</div>
            <div className={classNames('gradient2', 't-header')}>Dogs</div>
          </div>
          {users}
        </div>
      </div>
    );
  }
}

export default UserList;
