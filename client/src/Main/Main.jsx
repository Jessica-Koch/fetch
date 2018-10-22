import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Home from '../Home';
import UserList from '../UserList';
import Services from '../Services';
import Register from '../Register';
import About from '../About';
import './Main.css';

class Main extends Component {
  render() {
    return (
      <main className="main-content">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/users" component={UserList} />
          <Route path="/services" component={Services} />
          <Route path="/about" component={About} />
          <Route path="/login" component={Register} />
        </Switch>
      </main>
    );
  }
}
export default Main;
