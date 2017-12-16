import React, { PureComponent } from 'react';
import logo from '../../fox-sitting.png';

class Header extends PureComponent {
  render() {
    return (
      <div className="nav">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to Fetch</h1>
        </header>
      </div>
    );
  }
}

export default Header;
