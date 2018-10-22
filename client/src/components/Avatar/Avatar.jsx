import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import './Avatar.css';

class Avatar extends PureComponent {
  static propTypes = {
    avatarUrl: string.isRequired,
  };

  render() {
    return (
      <div className="Avatar">
        <img className="Avatar-img" alt="avatar" src={this.props.avatarUrl} />
      </div>
    );
  }
}

export default Avatar;
