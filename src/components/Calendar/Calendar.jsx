import React, { Component } from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { func, instanceOf } from 'prop-types';
import './Calendar.css';
import format from 'date-fns/format';

class Calendar extends Component {
  static propTypes = {
    minDate: instanceOf(Date),
    onSelect: func.isRequired,
  };

  static defaultProps = {
    minDate: undefined,
  };
  constructor(props) {
    super(props);

    this.state = {
      selected: undefined,
    };
  }

  onSelect = (e) => {
    console.log(`You selected: ${format(e, 'ddd, MMM Do YYYY')}`);
  };

  render() {
    return (
      <div className="Calendar">
        render(
        <InfiniteCalendar
          onSelect={this.onSelect}
          selected={null}
          min={new Date()}
          minDate={new Date()}
          width={window.innerWidth <= 650 ? window.innerWidth : 650}
          height={window.innerHeight - 250}
          rowHeight={70}
        />, this;
      </div>
    );
  }
}

export default Calendar;
