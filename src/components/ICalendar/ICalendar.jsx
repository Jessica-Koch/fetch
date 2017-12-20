import React, { Component } from 'react';
import { render } from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once

const today = new Date();
const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

class ICalendar extends Component {
  render() {
    return (
      <div>
        render(<InfiniteCalendar
          width={400}
          height={600}
          selected={today}
          disabledDays={[0, 6]}
          minDate={lastWeek}
               />);
      </div>
    );
  }
}

export default ICalendar;
