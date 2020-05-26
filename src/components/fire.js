import React, { Component } from 'react';
import { View, Image } from 'react-native';

import Images from '../../assets/images'
import constants from '../../constants';

export default class Fire extends Component {
  render() {
    let body = this.props.body;
    const width = constants.FIRE_SIZE;
    const height = constants.FIRE_SIZE;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;
    let pose = this.props.pose ? this.props.pose : 0

    return (
      <Image style={{ position: 'absolute', left: x, top: y, width: width, height: height, transform: [{ rotate: pose.toString() + 'deg' }] }}
        source={Images.fire} />
    );
  }
}
