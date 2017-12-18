import React, { Component } from 'react';
import { instanceOf } from 'prop-types';

class Schedule extends Component {
  static propTypes = {
    appointment: instanceOf(Date),
  };

  static defaultProps = {
    appointment: undefined,
  };

  render() {
    return <div className="Schedule" appointment={this.props.appointment} />;
  }
}

export default Schedule;
