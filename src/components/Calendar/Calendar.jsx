import React, { Component } from 'react';
import { func, instanceOf } from 'prop-types';
import './Calendar.css';
import ICalendar from '../ICalendar';

const today = new Date();

class Calendar extends Component {
  static propTypes = {
    minDate: instanceOf(Date),
    onSelect: func.isRequired,
  };

  static defaultProps = {
    minDate: today,
  };
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
    };
  }

  onSelect = (e) => {
    console.log('DATE!!!!!!!!!!! ', e);
    return this.setState({ selected: e });
  };

  onScroll = (...args) => console.log('onscroll: ', args);

  render() {
    const { minDate } = this.props;
    const { selected } = this.state;

    return (
      <div className="Calendar">
        <ICalendar
          minDate={minDate}
          selected={selected}
          onSelect={this.onSelect}
          onScroll={this.onScroll}
        />
      </div>
    );
  }
}

export default Calendar;
