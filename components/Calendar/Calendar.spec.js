import React from 'react';
import ReactDOM from 'react-dom';
import Calendar from './Calendar';

describe('Calendar', () => {
  describe('rendering', () => {
    it('should render without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Calendar />);
    });
  });
});
