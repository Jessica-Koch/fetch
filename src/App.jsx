import 'whatwg-fetch';
import React, { Component } from 'react';
import './App.css';
import Footer from './components/Footer/';
import Nav from './Nav/';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />

        <Main />
        <Footer />
      </div>
    );
  }
}

export default App;
