import Matter from 'matter-js';
import constants from '../../constants';
import Pipe from '../components/pipe';
import Fire from '../components/fire';

let tick = 0;
let pose = 1;
let fireTurn = 0;
let activePipeCount = 0;
let passedPipeCount = true;
let consoleOn = true;
let fireCounter = 0;
const defaultCategory = 0x0001, flyingCategory = 0x0002;
export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export const generatePipes = () => {
  let topPipeHeight = randomBetween(
    (constants.MAX_HEIGHT * 1) / 5,
    (constants.MAX_HEIGHT * 3) / 4 - 100,
  );
  let bottomPipeHeight =
    constants.MAX_HEIGHT - topPipeHeight - constants.GAP_SIZE;
  let sizes = [topPipeHeight, bottomPipeHeight];

  return sizes;
};

export const addPipesAtLocation = (x, world, entities) => {
  let sizes = generatePipes();
  let pipeUp = Matter.Bodies.rectangle(
    x,
    Math.ceil(sizes[0] / 2),
    constants.PIPE_WIDTH,
    sizes[0],
    {
      isSleeping: true,
      collisionFilter:{
        category: flyingCategory,
        mask:defaultCategory,
        group: -1,
      }
    },
  );
  let pipeDown = Matter.Bodies.rectangle(
    x,
    Math.ceil(constants.MAX_HEIGHT - sizes[1] / 2),
    constants.PIPE_WIDTH,
    sizes[1],
    { isStatic: true },
  );
  Matter.World.add(world, [pipeUp, pipeDown]);

  entities['pipeUp'] = { body: pipeUp, down: 0, height: sizes[0], renderer: Pipe, };
  entities['pipeDown'] = { body: pipeDown, down: 1, height: sizes[1], renderer: Pipe, };
}

const Physics = (entities, { touches, time, dispatch }) => {
  let engine = entities.physics.engine;
  let world = entities.physics.world;
  let bird = entities.bird.body;
  let fireButton = entities.fireButton.body;
  let fireButtonWidth = (fireButton.bounds.max.x - fireButton.bounds.min.x) / 2;
  let fireButtonHeight = (fireButton.bounds.max.y - fireButton.bounds.min.y) / 2;
  let fireButtonMiddleX = fireButton.position.x + fireButtonWidth;
  let fireButtonMiddleY = fireButton.position.y + fireButtonHeight;


  touches.filter(t => t.type === 'press' && Math.hypot(t.event.pageX - fireButtonMiddleX, t.event.pageY - fireButtonMiddleY) > 25).forEach(t => {
    if (world.gravity.y === 0.0) {
      world.gravity.y = 1.3;
      addPipesAtLocation(constants.MAX_WIDTH + constants.PIPE_WIDTH / 2, world, entities)
      //activePipeCount++;
    }
    Matter.Body.setVelocity(bird, { x: bird.velocity.x, y: -10 });
  });

  tick++;
  if (tick % 5 === 0) {
    pose++;
    if (pose > 3) { pose = 1 }
    entities.bird.pose = pose;
  }


  if (entities['floor1'].body.position.x <= -1 * constants.MAX_WIDTH / 2) {
    Matter.Body.setPosition(entities['floor1'].body, { x: entities['floor1'].body.position.x * -3, y: entities['floor1'].body.position.y })
  } else if (entities['floor2'].body.position.x <= -1 * constants.MAX_WIDTH / 2) {
    Matter.Body.setPosition(entities['floor2'].body, { x: entities['floor2'].body.position.x * -3, y: entities['floor2'].body.position.y })
  }
  else {
    Matter.Body.translate(entities['floor1'].body, { x: -1, y: 0 });
    Matter.Body.translate(entities['floor2'].body, { x: -1, y: 0 });
  }
  if (entities.pipeUp) {
    if (entities['pipeUp'].body.position.x + constants.PIPE_WIDTH / 2 < bird.bounds.min.x && passedPipeCount) {
      dispatch({ type: 'score' });
      passedPipeCount = false;
    }

    if (entities['pipeUp'].body.position.x <= -1 * constants.PIPE_WIDTH / 2) {
      delete (entities['pipeUp', 'pipeDown']);
      addPipesAtLocation(constants.MAX_WIDTH + constants.PIPE_WIDTH / 2, world, entities)
      passedPipeCount = true;
    } else {
      Matter.Body.translate(entities['pipeUp'].body, { x: -1, y: 0 });
      Matter.Body.translate(entities['pipeDown'].body, { x: -1, y: 0 });
    }
  }


  let fireList = Object.keys(entities).filter(key => key.slice(0, 4) === "fire" && key != "fireButton");

  if (tick % 2 === 0) {
    if (fireList && fireList.length > 0) {
      fireTurn++;
      fireList.forEach(fire => {
        entities[fire].pose = fireTurn * 20
      })
    }
  }

  if (fireList && fireList.length > 0) {
    fireList.forEach(fire => {
      let fireBody = entities[fire].body;

      if (fireBody.position.x - constants.FIRE_SIZE / 2 > constants.MAX_WIDTH) {
        delete (entities[fire]);
      } else if (entities.pipeDown && entities.pipeUp ? Matter.Bounds.overlaps(fireBody.bounds, entities.pipeDown.body.bounds) |
        Matter.Bounds.overlaps(fireBody.bounds, entities.pipeUp.body.bounds) : false) {
        entities.pipeUp.body.isSleeping = false;
        delete (entities[fire]);
      } else
        Matter.Body.translate(entities[fire].body, { x: 2, y: 0 })
    })
  }


  Matter.Engine.update(engine, time.delta);

  return entities;
};

const CreateFire = (state, { touches, dispatch }) => {
  let engine = state.physics.engine;
  let world = state.physics.world;
  let bird = state.bird.body;
  let fireButton = state.fireButton.body;
  let fireButtonWidth = (fireButton.bounds.max.x - fireButton.bounds.min.x) / 2;
  let fireButtonHeight = (fireButton.bounds.max.y - fireButton.bounds.min.y) / 2;
  let fireButtonMiddleX = fireButton.position.x + fireButtonWidth;
  let fireButtonMiddleY = fireButton.position.y + fireButtonHeight;

  touches.filter(t => t.type === 'press' && Math.hypot(t.event.pageX - fireButtonMiddleX, t.event.pageY - fireButtonMiddleY) <= 25).forEach(t => {
    let fire = Matter.Bodies.rectangle(
      bird.position.x + 25,
      bird.position.y,
      constants.FIRE_SIZE,
      constants.FIRE_SIZE,
      {
        isStatic: true,
        collisionFilter:{
          category: flyingCategory,
          mask:defaultCategory,
          group: -1,
        }
      },
    );

    Matter.World.add(world, [fire]);

    state['fire' + fireCounter++] = {
      body: fire,
      renderer: Fire
    };
  });

  return state;

}
export { Physics, CreateFire };
