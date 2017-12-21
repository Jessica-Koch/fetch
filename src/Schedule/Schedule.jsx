import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import './Schedule.scss';
import Calendar from '../components/Calendar';

class Schedule extends Component {
  static propTypes = {
    appointment: instanceOf(Date),
  };

  static defaultProps = {
    appointment: undefined,
  };

  render() {
    return (
      <div className="Schedule">
        <h1 className="gradient1">Some of the services we provide</h1>
        <div>
          <Calendar />
        </div>
      </div>
    );
  }
}

export default Schedule;
