import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Jumbotron from '../components/Jumbotron/';
import './Home.css';

class Home extends PureComponent {
  render() {
    return (
      <div className="Home">
        <Jumbotron cx="eightVH" header="Welcome to Fetch" subheader="Have a look around" />
        <div className={classNames('row', 'content')}>
          <div className="container">
            <h1 className="gradient2">We’re here to entertain you, and your dog!</h1>
            <div className={classNames('mt-4', 'row')}>
              <Link className="color-1" to="/services">
                Services
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
