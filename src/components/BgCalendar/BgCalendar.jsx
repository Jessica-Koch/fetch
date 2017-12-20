import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment';
import './BgCalendar.css';

BigCalendar.momentLocalizer(moment);

class BgCalendar extends Component {
  render() {
    return (
      <div className="Calendar">
        <BigCalendar culture="en-US" events={[]} />
      </div>
    );
  }
}

export default BgCalendar;
