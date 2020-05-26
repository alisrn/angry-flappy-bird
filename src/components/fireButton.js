import React, { Component } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

import Images from '../../assets/images'
import constants from '../../constants';

export default class Floor extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    let body = this.props.body;
    const width = 50;
    const height = 50;
    const x = 50;
    const y = constants.MAX_HEIGHT - 100;

    return (
      <TouchableOpacity style={{ position: 'absolute', left: x, top: y, width: width, height: height}}>
        <Image source={Images.fireButton} style={styles.fireButton} />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  fireButton: {
    /* position: 'absolute',
    left: 50,
    top: constants.MAX_HEIGHT - 100, */
    width: 50,
    height: 50,
  },
});