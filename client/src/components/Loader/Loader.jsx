import React, { PureComponent } from 'react';
import { DotLoader } from 'react-spinners';
import { bool, number, string } from 'prop-types';

class Loader extends PureComponent {
  static propTypes = {
    color: string,
    visible: bool.isRequired,
    margin: string,
    size: number,
  };

  static defaultProps = {
    color: '#f46842',
    margin: '1rem',
    size: 60,
  };

  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
    };
  }

  render() {
    const { color, margin, size } = this.props;
    const { visible } = this.state;
    if (visible === true) {
      return <DotLoader color={color} visible={visible} margin={margin} size={size} />;
    }
    return undefined;
  }
}

export default Loader;
