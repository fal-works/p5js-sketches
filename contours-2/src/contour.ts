import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";
import {
  p,
  canvas,
  onSetup,
  ArrayUtility,
  Vector2D,
  Numeric,
  Random,
  Angle,
  Kinematics,
  SimpleDynamics,
  Rotation,
  ShapeColor,
  reverseColor
} from "./global";
import * as NoiseVector from "./noise-vector";

let colorCandidates: readonly p5ex.ShapeColor.Unit[];
onSetup.push(p => {
  colorCandidates = ["#ef476f", "#ffd166", "#06d6a0", "#118ab2"]
    .map(code => reverseColor(p.color(code)))
    .map(color => ShapeColor.create(undefined, color, 256));
});

export let maxForceMagnitude = 0;
export const setMaxForceMagnitude = (value: number) => {
  maxForceMagnitude = value;
};

type NoiseFunction = (t: number) => number;

export interface Unit
  extends CCC.SimpleDynamics.VerletQuantity,
    CCC.Rotation.Quantity {
  readonly rotationFactor: number;
  readonly vertexDistance: readonly NoiseFunction[];
  color: p5ex.ShapeColor.Unit;
  time: number;
  deltaTime: number;
}

const DRAG_COEFFICIENT = 0.3;

const VERTEX_COUNT = 6;
const VERTEX_MIN_DISTANCE = 10;
const VERTEX_MAX_DISTANCE_NOISE = 150;
const DEFAULT_DELTA_TIME = 0.01;
const DELTA_TIME_DECAY = 0.9;

const unitVectors: readonly CCC.Vector2D.Unit[] = Angle.createArray(
  VERTEX_COUNT
).map(angle => Vector2D.fromPolar(1, angle));

const { square } = Numeric;

const createVertexDistanceFunction = (): NoiseFunction => {
  const offset = Random.value(256);
  return t =>
    VERTEX_MIN_DISTANCE +
    VERTEX_MAX_DISTANCE_NOISE * square(p.noise(offset + t));
};

/**
 * Creates a `Contour` unit.
 * @return New `Contour` instance.
 */
export const create = (): Unit => {
  const position = Random.pointInRectangleRegion(canvas.logicalRegion);
  const velocity = Random.vector(5);

  return {
    ...SimpleDynamics.createVerletQuantity(
      position.x,
      position.y,
      velocity.x,
      velocity.y
    ),
    rotationAngle: Random.angle(),
    rotationVelocity: 0,
    rotationFactor: Random.signed(1),
    vertexDistance: ArrayUtility.createPopulated(
      createVertexDistanceFunction,
      VERTEX_COUNT
    ),
    color: Random.fromArray(colorCandidates),
    time: 0,
    deltaTime: DEFAULT_DELTA_TIME
  };
};

let bounce: (contour: Unit) => boolean;
onSetup.push(() => {
  bounce = Kinematics.bounceInRectangleRegion.bind(
    undefined,
    canvas.logicalRegion,
    0.7
  );
});

export const applyDrag = (contour: Unit): void => {
  SimpleDynamics.addForceCartesian(
    contour,
    -DRAG_COEFFICIENT * contour.vx,
    -DRAG_COEFFICIENT * contour.vy
  );
  SimpleDynamics.addForcePolar(contour, Random.value(0.5), Random.angle());
};

export const update = (contour: Unit): void => {
  SimpleDynamics.updateVerlet(contour);
  Rotation.update(contour);
};

export const postUpdate = (contour: Unit): void => {
  const speed = Kinematics.getSpeed(contour);
  SimpleDynamics.truncateForce(contour, maxForceMagnitude);
  SimpleDynamics.postUpdateVerlet(contour);

  if (bounce(contour)) {
    if (speed > 5) contour.deltaTime += 0.5;
  }

  contour.rotationVelocity = contour.rotationFactor * speed * 0.01;

  const { deltaTime } = contour;
  const additionalDeltaTime = speed * 0.005;
  contour.time += deltaTime + additionalDeltaTime;
  contour.deltaTime =
    DEFAULT_DELTA_TIME + DELTA_TIME_DECAY * (deltaTime - DEFAULT_DELTA_TIME);
};

const drawShape = (contour: Unit, scaleFactor: number) => {
  const { x, y, rotationAngle, vertexDistance, time } = contour;

  p.translate(x, y);
  p.rotate(rotationAngle);
  p.scale(scaleFactor);

  p.beginShape();
  const len = VERTEX_COUNT + 3;
  for (let i = 0; i < len; i += 1) {
    const index = i % VERTEX_COUNT;
    const distance = vertexDistance[index](time);
    const unitVector = unitVectors[index];
    p.curveVertex(distance * unitVector.x, distance * unitVector.y);
  }
  p.endShape();

  p.scale(1 / scaleFactor);
  p.rotate(-rotationAngle);
  p.translate(-x, -y);
};

export const drawOutline = (contour: Unit): void => {
  drawShape(contour, 1);
};

export const drawShadow = (contour: Unit): void => {
  ShapeColor.apply(contour.color, NoiseVector.alpha);
  drawShape(contour, NoiseVector.scaleFactor);
};

export const activate = (contour: Unit) => {
  contour.deltaTime += 20;
  SimpleDynamics.addForcePolar(contour, 100, Random.angle());
};
