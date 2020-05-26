import React, { Component } from 'react';
import { View, Image } from 'react-native';

import Images from '../../assets/images'

export default class Bird extends Component {
  render() {
    const width = this.props.body.bounds.max.x - this.props.body.bounds.min.x;
    const height = this.props.body.bounds.max.y - this.props.body.bounds.min.y;
    const x = this.props.body.position.x - width / 2;
    const y = this.props.body.position.y - height / 2;

    let image = Images['flappy' + this.props.pose];
    let rotation = (this.props.body.velocity.y * 6 > 45 ? 45 : this.props.body.velocity.y * 4.5).toString() + 'deg';
    return (
      <Image source={image} style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        transform: [{ rotate: rotation }]
      }} resizeMode={"stretch"} />
    );
  }
}
