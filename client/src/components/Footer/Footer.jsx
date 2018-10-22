import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import './Footer.css';

class Footer extends PureComponent {
  static propTypes = {
    email: string,
  };

  static defaultProps = {
    email: 'example@gmail.com',
  };

  render() {
    return (
      <footer className="Footer">
        <div className="phone">555-555-5555</div>
        <a href={`mailto:${this.props.email}`}>Email Us</a>
      </footer>
    );
  }
}

export default Footer;
