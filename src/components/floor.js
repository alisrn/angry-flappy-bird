import React, {Component} from 'react';
import {View, Image} from 'react-native';

import Images from '../../assets/images'
import constants from '../../constants';

export default class Floor extends Component {
  render() {
    let body = this.props.body;
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = 50;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;
    return (
      <View
        style={{
          position: 'absolute',
          top: y,
          left: x,
          width: width,
          height: height,
          overflow: 'hidden',
          flexDirection: 'row'
        }}
      >
          <Image style={{width:constants.MAX_WIDTH + 4, height:50}} resizeMode={'stretch'} source={Images.floor} />
      </View>
    );
  }
}
