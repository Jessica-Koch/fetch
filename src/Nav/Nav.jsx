import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';

import './Nav.css';

class Nav extends PureComponent {
  render() {
    return (
      <header className="Nav main-head">
        <nav className="main-nav">
          <ul className="nav-links">
            <li>
              <Link className="nav-link" exact to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/users">
                Members
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/about">
                About
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/services">
                Services
              </Link>
            </li>
            <li>
              <Link className="nav-link" to="/login">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Nav;
