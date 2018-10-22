import React, { Component } from 'react';
import Schedule from '../Schedule';
import Jumbotron from '../components/Jumbotron/';

import './Services.css';

class Services extends Component {
  render() {
    return (
      <div className="Services">
        <Jumbotron
          cx="eightVH"
          header="Book a stay with us"
          subheader="We look forward to having you"
        />

        <h1 className="gradient1">Some of the services we provide</h1>

        <div>
          <Schedule />
        </div>
      </div>
    );
  }
}

export default Services;
