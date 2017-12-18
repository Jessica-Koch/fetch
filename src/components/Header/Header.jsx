import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../fox-sitting.png';
import './Header.css';

class Header extends PureComponent {
  render() {
    return (
      <header className="main-head">
        <nav className="main-nav">
          <Link to="/">
            <img src={logo} className="App-logo" alt="logo" />
          </Link>
          <ul className="nav-links">
            <li>
              <Link to="/users">Users</Link>
            </li>
            <li>
              <Link to="/services">Schedule With Us</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
