/**
 * Shape.
 */

import {
  p,
  translateRotate,
  undoTranslateRotate,
  Coordinates2D,
} from "./common";
import { onSetup } from "@fal-works/p5-extension";
import p5 from "p5";

const maxTemperature = 60;
const rotationVelocityDelayFactor = 0.95;
const shapeWidth = 6;
const shapeHeight = 36;

export interface Unit {
  x: number;
  y: number;
  rotation: number;
  rotationVelocity: number;
  temperature: number;
}

export const create = (x: number, y: number): Unit => ({
  x,
  y,
  rotation: 0.0,
  rotationVelocity: 0.0,
  temperature: 0,
});

const shapeColors: p5.Color[] = [];
onSetup.push((p) => {
  const black = p.color(32, 48, 64);
  const blue = p.color(128, 192, 255);
  for (let i = 0; i <= maxTemperature; i += 1) {
    const ratio = i / maxTemperature;
    shapeColors.push(p.lerpColor(black, blue, ratio));
  }
});

export const impact = (shape: Unit) => {
  shape.rotationVelocity = 0.25;
  shape.temperature = maxTemperature;
};

const normalizeAngle = (angle: number): number =>
  angle - p.PI * Math.floor((angle + p.HALF_PI) / p.PI);

export const update = (shape: Unit): void => {
  let { rotation, rotationVelocity } = shape;

  rotation += rotationVelocity;

  const minVel = 0.02;
  if (minVel <= rotationVelocity) {
    rotationVelocity = Math.max(
      rotationVelocityDelayFactor * rotationVelocity,
      minVel
    );
    if (rotationVelocity == minVel) {
      if (Math.abs(normalizeAngle(rotation)) < minVel) {
        rotation = 0.0;
        rotationVelocity = 0.0;
      }
    }
  }

  shape.rotation = rotation;
  shape.rotationVelocity = rotationVelocity;

  if (0 < shape.temperature) shape.temperature -= 1;
};

export const draw = (shape: Unit): void => {
  const { x, y, rotation, temperature } = shape;

  translateRotate(x, y, rotation);
  p.fill(shapeColors[temperature]);
  p.rect(0.0, 0.0, shapeWidth, shapeHeight);
  undoTranslateRotate();
};

const collisionDistance = 1.5 * (shapeHeight / 2);

export const getDistSq = (shape: Unit, x: number, y: number): number =>
  Coordinates2D.distanceSquared(shape.x, shape.y, x, y);

export const collides = (
  shape: Unit,
  x: number,
  y: number,
  colliderRadius: number
) => {
  const dist = collisionDistance + colliderRadius;
  const distSq = dist * dist;

  return getDistSq(shape, x, y) < distSq;
};
