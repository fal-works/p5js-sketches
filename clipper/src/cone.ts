/**
 * ---- Cone -------------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import {
  p,
  canvas,
  renderer,
  Vector2D,
  Random,
  PI,
  hypotenuse2D,
  lerp,
  Timer,
  Easing
} from "./common";

export type Unit = {
  readonly rotationVelocity: number;
  rotationAngle: number;
  bearingAngle: number;
  interiorAngle: number;
  directionOffsetAngle: number;
  timer: CCC.Timer.Component.Unit;
};

const randomBearingAngle = () => 2 * Random.angle();
const randomInteriorAngle = () => Random.between(0.05, 0.2);
const randomDirectionOffsetAngle = () => Random.signed(0.25);

let startPointDistance: number;
let diameter: number;

export const reset = () => {
  const diagonalLength = hypotenuse2D(
    canvas.logicalSize.width,
    canvas.logicalSize.height
  );
  startPointDistance = (diagonalLength / 2) * 1.2;
  const radius = startPointDistance + diagonalLength / 2;
  diameter = 2 * radius;
};

const createTimer = (cone: Unit) => {
  const {
    bearingAngle: startBearingAngle,
    interiorAngle: startInteriorAngle,
    directionOffsetAngle: startDirectionOffsetAngle
  } = cone;

  const endBearingAngle = randomBearingAngle();
  const endInteriorAngle = randomInteriorAngle();
  const endDirectionOffsetAngle = randomDirectionOffsetAngle();

  const move = Timer.create({
    duration: 30,
    onProgress: listener => {
      const ratio = Easing.InOut.expo(listener.ratio);

      cone.bearingAngle = lerp(startBearingAngle, endBearingAngle, ratio);
      cone.interiorAngle = lerp(startInteriorAngle, endInteriorAngle, ratio);
      cone.directionOffsetAngle = lerp(
        startDirectionOffsetAngle,
        endDirectionOffsetAngle,
        ratio
      );
    }
  });

  const wait = Timer.create({ duration: 90 });
  const timer = Timer.chain([move, wait]);
  timer.onComplete.push(() => {
    cone.timer = createTimer(cone);
  });

  return timer;
};

export const create = (
  rotationAngle: number,
  rotationVelocity: number
): Unit => {
  const cone: Unit = {
    rotationVelocity,
    rotationAngle,
    bearingAngle: randomBearingAngle(),
    interiorAngle: randomInteriorAngle(),
    directionOffsetAngle: randomDirectionOffsetAngle(),
    timer: Timer.dummy
  };
  cone.timer = createTimer(cone);

  return cone;
};

export const update = (cone: Unit) => {
  cone.rotationAngle += cone.rotationVelocity;
  cone.timer.step();
};

const startPoint = Vector2D.Mutable.create();

const drawShape = (
  startPoint: CCC.Vector2D.Unit,
  startAngle: number,
  endAngle: number
) =>
  renderer.arc(
    startPoint.x,
    startPoint.y,
    diameter,
    diameter,
    startAngle,
    endAngle,
    p.PIE
  );

export const draw = (cone: Unit) => {
  const actualBearingAngle = cone.bearingAngle + cone.rotationAngle;

  Vector2D.Assign.setPolar(startPointDistance, actualBearingAngle, startPoint);

  const direction = actualBearingAngle + PI + cone.directionOffsetAngle;
  const halfInteriorAngle = cone.interiorAngle / 2;

  drawShape(
    startPoint,
    direction - halfInteriorAngle,
    direction + halfInteriorAngle
  );
};
