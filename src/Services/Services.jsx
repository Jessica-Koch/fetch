import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import './Services.css';

class Schedule extends Component {
  static propTypes = {
    appointment: instanceOf(Date),
  };

  static defaultProps = {
    appointment: undefined,
  };

  render() {
    return (
      <div className="Services">
        <h1>Some of the services we provide</h1>
      </div>
    );
  }
}

export default Schedule;
