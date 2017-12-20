import 'whatwg-fetch';
import React, { Component } from 'react';
import classNames from 'classnames';
import './App.css';
import Jumbotron from './components/Jumbotron/';
import Footer from './components/Footer/';
import Nav from './components/Nav/';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className={classNames('App', 'wrapper')}>
        <Jumbotron cx="eightVH" header="Welcome to Fetch" subheader="Have a look around" />
        <Nav />

        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
