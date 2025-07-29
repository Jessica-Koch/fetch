import { NavLink } from 'react-router-dom';

export const Navbar = () => (
  <nav>
    <ul>
      <li>
        <NavLink
          to='/'
          style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
        >
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/about'
          style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
        >
          About
        </NavLink>
      </li>
      <li>
        <NavLink
          to='/adoption-application'
          style={({ isActive }) => ({ color: isActive ? 'blue' : 'black' })}
        >
          Adoption Application
        </NavLink>
      </li>
    </ul>
  </nav>
);
