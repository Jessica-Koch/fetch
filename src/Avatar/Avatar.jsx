import React, { React } from 'react';
import styles from './Avatar.css';

class Avatar extends Component {
  static propTypes = {
    avatarUrl: string.isRequired,
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="round">
        <img className="Avatar" src={props.avatarUrl} />
      </div>
    );
  }
}

export default Avatar;
