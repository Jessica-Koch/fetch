import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../fox-sitting.png';
import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <header className="main-head">
        <nav className="main-nav">
          <img src={logo} className="App-logo" alt="logo" />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/schedule">Schedule With Us</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
