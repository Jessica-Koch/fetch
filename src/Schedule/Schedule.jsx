import React, { Component } from 'react';
import { instanceOf } from 'prop-types';
import './Schedule.css';
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
        <div className="flex-wrapper">
          <Calendar />
        </div>
      </div>
    );
  }
}

export default Schedule;
