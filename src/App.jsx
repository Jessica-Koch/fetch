import 'whatwg-fetch';
import React, { Component } from 'react';
import classNames from 'classnames';
import './App.css';
import Header from './components/Header/';
import Footer from './components/Footer/';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className={classNames('App', 'wrapper')}>
        <Header />

        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
