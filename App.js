/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {
  StyleSheet,
  StatusBar,
  View,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {GameEngine} from 'react-native-game-engine';
import Matter from 'matter-js';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import constants from './constants';
import Bird from './src/components/bird';
import Wall from './src/components/wall';
import Floor from './src/components/floor';
import Pipe from './src/components/pipe';
import Fire from './src/components/fire';
import FireButton from './src/components/fireButton';
import {Physics, CreateFire} from './src/engine/physics';
import Images from './assets/images';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      running: true,
      score: 0,
      fireCounter: 0,
    };
    this.gameEngine = null;
    this.entities = this.setupWorld();
  }

  setupWorld() {
    var defaultCategory = 0x0001, flyingCategory = 0x0002;
    let engine = Matter.Engine.create({enableSleeping: false});
    let world = engine.world;
    world.gravity.y = 0.0;

    let bird = Matter.Bodies.rectangle(
      constants.MAX_WIDTH / 3,
      constants.MAX_HEIGHT / 2,
      50,
      35,
      {collisionFilter:{
        category: flyingCategory,
        mask:defaultCategory,
        group: -1,
      }}
    );

    let floor1 = Matter.Bodies.rectangle(
      constants.MAX_WIDTH / 2,
      constants.MAX_HEIGHT - 25,
      constants.MAX_WIDTH + 4,
      50,
      {isStatic: true,
        collisionFilter:{
          category:defaultCategory
        }
      },
    );

    let floor2 = Matter.Bodies.rectangle(
      (constants.MAX_WIDTH * 3) / 2,
      constants.MAX_HEIGHT - 25,
      constants.MAX_WIDTH + 4,
      50,
      {isStatic: true,
        collisionFilter:{
          category:defaultCategory
        }
      },
    );

    let fireButton = Matter.Bodies.circle(
      50,
      constants.MAX_HEIGHT - 100,
      25,
      {isStatic: true,
        collisionFilter:{
          category:defaultCategory
        }
      },
    );

    Matter.World.add(world, [bird, floor1, floor2, fireButton]);

    Matter.Events.on(engine, 'collisionStart', e => {
      this.gameEngine.dispatch({type: 'game-over'});
    });

    return {
      physics: {engine: engine, world: world},
      bird: {body: bird, pose: 1, renderer: Bird},
      floor1: {
        body: floor1,
        renderer: Floor,
      },
      floor2: {
        body: floor2,
        renderer: Floor,
      },
      fireButton: {
        body: fireButton,
        renderer: FireButton
      }
    };
  }

  onEvent = e => {
    if (e.type === 'game-over') {
      this.setState({
        running: false,
        fireCounter: 0,
      });
    } else if (e.type === 'score') {
      this.setState({
        score: this.state.score + 1,
      });
    }
  };

  reset = () => {
    this.gameEngine.swap(this.setupWorld());
    this.setState({running: true, score: 0});
  };

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={Images.background}
          resizeMode={'stretch'}
          style={styles.backgroundImage}
        />
        <GameEngine
          ref={ref => {
            this.gameEngine = ref;
          }}
          style={styles.gameContainer}
          running={this.state.running}
          onEvent={this.onEvent}
          systems={[Physics, CreateFire]}
          entities={this.entities}>
          <StatusBar hidden={true} />
        </GameEngine>
        <Text style={styles.score}>{this.state.score}</Text>
        
        {!this.state.running && (
          <TouchableOpacity
            onPress={this.reset}
            style={styles.fullScreenButton}>
            <View style={styles.fullScreen}>
              <Text style={styles.sectionTitle}>Game Over!</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lighter,
  },
  fireButton: {
    position: 'absolute',
    left: 50,
    top: constants.MAX_HEIGHT - 100,
  },
  fireButtonWrapper: {
    position: 'absolute',
    left: 50,
    top: constants.MAX_HEIGHT - 100,
  },
  fullScreenButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    flex: 1,
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black,
    opacity: 0.8,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width: constants.MAX_WIDTH,
    height: constants.MAX_HEIGHT,
  },
  score: {
    position: 'absolute',
    top: 50,
    left: constants.MAX_WIDTH / 2 - 10,
    color: 'white',
    fontSize: 72,
    textShadowColor: '#000000',
    textShadowOffset: {width: 2, height: 2},
    textShadowRadius: 2,
  },
});
