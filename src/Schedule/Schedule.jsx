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

  constructor(props) {
    super(props);

    this.state = {
      appointment: props.appointment,
    };
  }
  render() {
    return (
      <div className="Schedule">
        <div className="flex-wrapper">
          <Calendar selected={this.props.appointment} />
        </div>
      </div>
    );
  }
}

export default Schedule;
