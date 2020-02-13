/**
 * ---- Cone -------------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import {
  p,
  canvas,
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
  hue: number;
  saturation: number;
  brightness: number;
  timer: CCC.Timer.Component.Unit;
};

const randomBearingAngle = () => 2 * Random.angle();
const randomInteriorAngle = () => Random.between(0.1, 0.7);
const randomDirectionOffsetAngle = () => Random.signed(0.15);
const randomSaturation = () => Random.between(80, 100);
const randomBrightness = () => Random.between(60, 90);

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
  const wait = Timer.create({ duration: 60 });

  const {
    bearingAngle: startBearingAngle,
    interiorAngle: startInteriorAngle,
    directionOffsetAngle: startDirectionOffsetAngle,
    hue: startHue,
    saturation: startSaturation,
    brightness: startBrightness
  } = cone;

  const endBearingAngle = randomBearingAngle();
  const endInteriorAngle = randomInteriorAngle();
  const endDirectionOffsetAngle = randomDirectionOffsetAngle();

  const endHue = (startHue + 110) % 360;
  const endSaturation = randomSaturation();
  const endBrightness = randomBrightness();

  const move = Timer.create({
    duration: 60,
    onProgress: listener => {
      const ratio = Easing.InOut.expo(listener.ratio);

      cone.bearingAngle = lerp(startBearingAngle, endBearingAngle, ratio);
      cone.interiorAngle = lerp(startInteriorAngle, endInteriorAngle, ratio);
      cone.directionOffsetAngle = lerp(
        startDirectionOffsetAngle,
        endDirectionOffsetAngle,
        ratio
      );

      cone.hue = lerp(startHue, endHue, ratio);
      cone.saturation = lerp(startSaturation, endSaturation, ratio);
      cone.brightness = lerp(startBrightness, endBrightness, ratio);
    }
  });

  const timer = Timer.chain([wait, move]);
  timer.onComplete.push(() => {
    cone.timer = createTimer(cone);
  });

  return timer;
};

export const create = (
  rotationAngle: number,
  hue: number,
  rotationVelocity: number
): Unit => {
  const cone: Unit = {
    rotationVelocity,
    rotationAngle,
    bearingAngle: randomBearingAngle(),
    interiorAngle: randomInteriorAngle(),
    directionOffsetAngle: randomDirectionOffsetAngle(),
    hue,
    saturation: randomSaturation(),
    brightness: randomBrightness(),
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

export const draw = (cone: Unit) => {
  p.fill(cone.hue, cone.saturation, cone.brightness);

  const actualBearingAngle = cone.bearingAngle + cone.rotationAngle;

  Vector2D.Assign.setPolar(startPointDistance, actualBearingAngle, startPoint);

  const direction = actualBearingAngle + PI + cone.directionOffsetAngle;
  const halfInteriorAngle = cone.interiorAngle / 2;

  p.arc(
    startPoint.x,
    startPoint.y,
    diameter,
    diameter,
    direction - halfInteriorAngle,
    direction + halfInteriorAngle
  );
};
