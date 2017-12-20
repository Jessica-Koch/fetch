import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';
import './BgCalendar.scss';

BigCalendar.momentLocalizer(moment);

class BgCalendar extends Component {
  render() {
    const { date, isOpen, selectedDate } = this.state;

    return (
      <div className="Calendar">
        <BigCalendar {...this.props} step={60} defaultDate={new Date(2015, 3, 1)} />
      </div>
    );
  }
}

export default BgCalendar;
