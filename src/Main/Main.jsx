import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Home';
import UserList from '../UserList';
import Schedule from '../Schedule';

class Main extends Component {
  render() {
    return (
      <main>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" compnent={UserList} />
          <Route path="/schedule" component={Schedule} />
        </Switch>
      </main>
    );
  }
}
export default Main;
