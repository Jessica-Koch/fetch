import React, { PureComponent } from 'react';
import logo from '../../fox-sitting.png';

class Header extends PureComponent {
  render() {
    return (
      <header className="App-header">
        <nav>
          <img src={logo} className="App-logo" alt="logo" />
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/users" />
            </li>
            <li>
              <Link to="schedule" />
            </li>
          </ul>
        </nav>
      </header>
    );
  }
}

export default Header;
