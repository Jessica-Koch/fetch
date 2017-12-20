import React, { Component } from 'react';
import styles from './Calendar.css';
import BgCalendar from '../BgCalendar';

class Calendar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: props.value,
      isOpen: false,
      selectedDate: undefined,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      const date = nextProps.value;
      this.setState({ date });
    }
  }

  onEscape = ({ key }) => {
    if (key === 'Escape') {
      this.hideCalendar();
    }
  };

  hideCalendar = () => this.setState({ isOpen: false });
  showCalendar = () => this.setState({ isOpen: true });

  isDateValid = (input) => {};

  render() {
    const { date, isOpen, selectedDate } = this.state;

    return (
      <div className="Calendar">
        <BgCalendar />
      </div>
    );
  }
}

export default Calendar;
