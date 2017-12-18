import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Home';
import UserList from '../UserList';
import Schedule from '../Schedule';
import './Main.css';

class Main extends Component {
  render() {
    return (
      <main className="main-content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={UserList} />
          <Route path="/schedule" component={Schedule} />
        </Switch>
      </main>
    );
  }
}
export default Main;
