import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import format from 'date-fns/format';
import 'react-infinite-calendar/styles.css';
import { func, instanceOf } from 'prop-types';
import './Calendar.css';

class Calendar extends Component {
  static propTypes = {
    minDate: instanceOf(Date),
    onSelect: func.isRequired,
  };

  static defaultProps = {
    minDate: new Date(),
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedDate: undefined,
    };
  }

  onSelect = (date) => {
    this.setState({ selectedDate: date });
    this.props.onSelect(date);
    // console.log(`You selected: ${format(date, 'ddd, MMM Do YYYY')}`);
  };

  render() {
    return (
      <div className="Calendar">
        <InfiniteCalendar
          onSelect={this.onSelect}
          selected={this.state.selectedDate}
          min={this.props.minDate}
          minDate={new Date()}
          width={window.innerWidth <= 650 ? window.innerWidth : 650}
          height={window.innerHeight - 250}
          rowHeight={70}
        />
      </div>
    );
  }
}

export default Calendar;
