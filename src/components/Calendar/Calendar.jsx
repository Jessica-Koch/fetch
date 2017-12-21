import React, { Component } from 'react';
import InfiniteCalendar, { Calendar as ICal, withRange } from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css';
import { func, instanceOf } from 'prop-types';
import './Calendar.css';
import startOfToday from 'date-fns/start_of_today';

const CalendarWithRange = withRange(ICal);

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
    console.log('DATE!!!!!!!!!!! ', e);
    return this.setState({ selected: e });
  };

  onScroll = (...args) => console.log('onscroll: ', args);

  render() {
    const { minDate } = this.props;
    const { selected } = this.state;

    return (
      <div className="Calendar">
        render(
        <InfiniteCalendar
          Component={CalendarWithRange}
          selected={{
            start: new Date(2017, 1, 10),
            end: new Date(2017, 1, 18),
          }}
          locale={{
            headerFormat: 'MMM Do',
          }}
        />, this;
      </div>
    );
  }
}

export default Calendar;
