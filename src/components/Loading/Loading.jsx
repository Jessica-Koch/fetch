import React, { PureComponent } from 'react';
import { DotLoader } from 'react-spinners';
import { bool, number, string } from 'prop-types';

class Loading extends PureComponent {
  static propTypes = {
    color: string,
    loading: bool.isRequired,
    margin: string,
    size: number,
  };

  static defaultProps = {
    color: '#f46842',
    margin: '1rem',
    size: 60,
  };

  render() {
    const {
      color, loading, margin, size,
    } = this.props;
    return loading ? (
      <DotLoader color={color} loading={loading} margin={margin} size={size} />
    ) : null;
  }
}

export default Loading;
