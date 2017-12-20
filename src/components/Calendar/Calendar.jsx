import React, { Component } from 'react';
import styles from './Calendar.css';
import BigCalendar from 'react-big-calendar';

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
        <BigCalendar {...this.props} step={60} defaultDate={new Date(2015, 3, 1)} />
      </div>
    );
  }
}

export default Calendar;
