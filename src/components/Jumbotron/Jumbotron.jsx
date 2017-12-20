import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { oneOf, string } from 'prop-types';
import './Jumbotron.css';

class Jumbotron extends PureComponent {
  static propTypes = {
    cx: oneOf('nineVH', 'eightVH', 'sevenVH', 'sixVH', 'fiveVH', 'fourVH').isRequired,
    header: string,
    subheader: string,
  };

  static defaultProps = {
    header: '',
    subheader: '',
  };

  render() {
    const { cx, header, subheader } = this.props;
    return (
      <div className={classNames('Jumbotron', cx)}>
        <div className="wrapper">
          <h1>{header}</h1>
          <h3>{subheader}</h3>
        </div>
      </div>
    );
  }
}

export default Jumbotron;
