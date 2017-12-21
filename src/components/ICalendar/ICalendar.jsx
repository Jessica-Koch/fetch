import React, { Component } from 'react';
import { render } from 'react-dom';
import InfiniteCalendar from 'react-infinite-calendar';
import 'react-infinite-calendar/styles.css'; // only needs to be imported once
import './ICalendar.css';

class ICalendar extends Component {
  render() {
    return (
      <div>
        render(<InfiniteCalendar width={400} height={600} />);
      </div>
    );
  }
}

export default ICalendar;
