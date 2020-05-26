import React, { Component } from 'react';
import { View, Image } from 'react-native';

import Images from '../../assets/images'
import constants from '../../constants';

export default class Pipe extends Component {
  render() {
    let body = this.props.body;
    const width = constants.PIPE_WIDTH;
    const height = constants.PIPE_HEIGHT;
    const x = body.position.x - width / 2;
    const y = !this.props.down ? body.position.y * 2 - height : constants.MAX_HEIGHT - this.props.height;

    return (
      <Image style={{ position: 'absolute', left: x, top: y, width: width, height: height, transform: [{ rotate: (this.props.down * 180).toString() + 'deg' }] }}
        source={Images.pipe} />
    );
  }
}
