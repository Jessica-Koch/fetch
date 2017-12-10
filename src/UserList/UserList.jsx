import React, {Component} from 'react';

class UserList extends Component {
  render() {
    const users = this.props.users.map(user => <User key={user._links.self.href} user={user}/>);

    return (
      <div class="grid">
        <div class="row heading">
          <div class="header">First Name</div>
          <div class="header">Last Name</div>
          <div class="header">Description</div>
          <div class="header">Pet</div>
        </div>
        {users}
      </div>
    )
  }
}
