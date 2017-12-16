import React, { Component } from 'react';
import styles from './Calendar.css';
import TextInput from '../TextInput/TextInput';

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

  showCalendar = () => this.setState({ isOpen: true });

  hideCalendar = () => this.setState({ isOpen: false });

  onEscape = ({ key }) => {
    if (key === 'Escape') {
      this.hideCalendar();
    }
  };

  isDateValid = input => {};

  render() {
    const { date, isOpen, selectedDate } = this.state;

    return (
      <div className="Calendar">
        <div className="row" />
      </div>
    );
  }
}

export default Calendar;
