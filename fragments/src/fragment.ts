import p5 from "p5";
import {
  Vector2D,
  Mutable,
  MutableVector2D,
  Random
} from "@fal-works/creative-coding-core";
import { onSetup } from "@fal-works/p5-extension";
import { p, canvas } from "./global";

const SIZE = 100;
const HALF_SIZE = SIZE / 2;

let graphics: p5.Graphics;
onSetup.push(p => {
  graphics = p.createGraphics(SIZE, SIZE);
  graphics.translate(0.05 * SIZE, 0.05 * SIZE);
  graphics.stroke(0, 64, 64, 8);
  let vx = 0.3;

  const shapeSize = Math.floor(0.9 * SIZE);
  for (let x = 0, maxX = shapeSize; x <= maxX; x += vx) {
    graphics.line(0, 0, x, shapeSize);
    vx += 0.005;
  }
});

interface Rotation {
  angle: number;
  velocity: number;
}

interface Scale {
  factor: Mutable<Vector2D.Unit>;
  parameter: Mutable<Vector2D.Unit>;
  parameterChangeRate: Vector2D.Unit;
}

export interface Unit {
  position: Mutable<Vector2D.Unit>;
  velocity: Vector2D.Unit;
  rotation: Rotation;
  scale: Scale;
}

const randomAngle = Random.angle;
const randomBetween = Random.between;

export const create = (): Unit => {
  return {
    position: {
      x: randomBetween(0.25, 0.75) * canvas.logicalSize.width,
      y: -HALF_SIZE
    },
    velocity: { x: 0, y: randomBetween(2, 5) },
    rotation: {
      angle: randomAngle(),
      velocity: randomBetween(0.005, 0.02)
    },
    scale: {
      factor: { x: 1, y: 1 },
      parameter: { x: randomAngle(), y: randomAngle() },
      parameterChangeRate: {
        x: randomBetween(0.01, 0.05),
        y: randomBetween(0.01, 0.05)
      }
    }
  };
};

const MutVec = MutableVector2D;
let thresholdY: number;
onSetup.push(() => {
  thresholdY = canvas.logicalRegion.rightBottom.y + HALF_SIZE;
});

const updateRotation = (rotation: Rotation): void => {
  rotation.angle += rotation.velocity;
};

const updateScale = (scale: Scale): void => {
  const { factor, parameter, parameterChangeRate } = scale;
  MutVec.add(parameter, parameterChangeRate);
  factor.x = Math.sin(parameter.x);
  factor.y = Math.sin(parameter.y);
};

export const update = (fragment: Unit): boolean => {
  const { position, velocity, rotation, scale } = fragment;

  MutVec.add(position, velocity);
  updateRotation(rotation);
  updateScale(scale);

  return position.y >= thresholdY;
};

export const draw = (fragment: Unit): void => {
  const { position, scale, rotation } = fragment;
  const { x, y } = position;
  const { angle } = rotation;
  const { x: scaleX, y: scaleY } = scale.factor;

  if (scaleX === 0 || scaleY === 0) return;

  p.translate(x, y);
  p.rotate(angle);
  p.scale(scaleX, scaleY);

  p.image(graphics, 0, 0);

  p.scale(1 / scaleX, 1 / scaleY);
  p.rotate(-angle);
  p.translate(-x, -y);
};
