import React, { PureComponent } from 'react';
import { string } from 'prop-types';
import styles from './Avatar.css';

class Avatar extends PureComponent {
  static propTypes = {
    avatarUrl: string.isRequired,
  };

  render() {
    return (
      <div className="round">
        <img className={styles.Avatar} alt="avatar" src={this.props.avatarUrl} />
      </div>
    );
  }
}

export default Avatar;
