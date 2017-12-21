import React, { Component } from 'react';
import Schedule from '../Schedule';
import './Services.css';

class Services extends Component {
  render() {
    return (
      <div className="Services">
        <h1 className="gradient1">Some of the services we provide</h1>

        <div>
          <Schedule />
        </div>
      </div>
    );
  }
}

export default Services;
