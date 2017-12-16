import { Switch, Route } from 'react-router-dom';
import React from 'react';
import './UserList.scss';
import Users from '../Users';
import User from '../User';

const UserList = () => (
  <div className="section">
    <h1>This is a User page!</h1>
    <Switch>
      <Route exact path="/users" component={Users} />
      <Route path="users/:number" component={User} />
    </Switch>
  </div>
);
// class UserList extends Component {
//   static propTypes = {
//     users: array,
//   };
//
//   constructor(props) {
//     super(props);
//     this.state = { users: this.props.users };
//   }
//
//   componentDidMount() {
//     fetch('/api/users')
//       .then(response => response.json())
//       .then(users => this.setState({ users }));
//   }
//
//   render() {
//     const users = this.state.users.map(user => <User key={user.id} user={user} />);
//
//     return (
//       <div className="grid-container">
//         <div className="header">First Name</div>
//         <div className="header">Last Name</div>
//         <div className="header">email</div>
//         <div className="header">Pet</div>
//
//         {users}
//       </div>
//       <Switch>
//         <Route exact path='/users' component={UserList}/>
//       </Switch>
//     );
//   }
// }
//
// export default UserList;
