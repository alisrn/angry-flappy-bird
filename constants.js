import { Dimensions } from 'react-native';

// eslint-disable-next-line no-undef
export default (constants = {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  GAP_SIZE: 200,
  PIPE_WIDTH: 100,
  PIPE_HEIGHT: 615,
  FIRE_SIZE:30,
});
