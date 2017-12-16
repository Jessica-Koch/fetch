import 'whatwg-fetch';
import React, { PureComponent } from 'react';
import './App.css';
import Header from './../components/Header/';
import Main from './Main';

class App extends PureComponent {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="grid">
          <Main />
        </div>
      </div>
    );
  }
}

export default App;
