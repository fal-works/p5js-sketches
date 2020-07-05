/**
 * Line.
 */

import {
  p,
  translateRotate,
  undoTranslateRotate,
  Timer,
  lerp,
  square,
  AlphaColor,
  Random,
} from "./common";
import * as p5ex from "@fal-works/p5-extension";
import { onSetup } from "@fal-works/p5-extension";

export interface Unit {
  x: number;
  y: number;
  length: number;
  angle: number;
  alpha: number;
}

export const create = (
  x: number,
  y: number,
  angle: number,
  easing: {
    easeAppear: (ratio: number) => number;
    easeDisappear: (ratio: number) => number;
  },
  delayDuration: number
) => {
  const displacementX = 400 * Math.cos(angle);
  const displacementY = 400 * Math.sin(angle);
  const startX = x - displacementX;
  const startY = y - displacementY;
  const endX = x + displacementX;
  const endY = y + displacementY;

  const unit: Unit = {
    x: startX,
    y: startY,
    length: 0,
    angle,
    alpha: 0,
  };

  const { easeAppear, easeDisappear } = easing;
  const length = Random.Curved.between(square, 50, 400);

  const delay = Timer.create({ duration: delayDuration });
  const appear = Timer.create({
    duration: 60,
    onProgress: (progress) => {
      const { ratio } = progress;
      const easedRatio = easeAppear(progress.ratio);
      unit.x = lerp(startX, x, easedRatio);
      unit.y = lerp(startY, y, easedRatio);
      unit.length = length * easedRatio;
      unit.alpha = 255 * ratio;
    },
  });
  const wait = Timer.create({ duration: 60 });
  const disappear = Timer.create({
    duration: 60,
    onProgress: (progress) => {
      const { ratio } = progress;
      const easedRatio = easeDisappear(progress.ratio);
      unit.x = lerp(x, endX, easedRatio);
      unit.y = lerp(y, endY, easedRatio);
      unit.length = length * (1 - easedRatio);
      unit.alpha = 255 * (1 - ratio);
    },
  });
  const timer = Timer.chain([delay, appear, wait, disappear]);
  return { unit, timer };
};

let alphaColor: p5ex.AlphaColor.Unit;
onSetup.push(() => (alphaColor = AlphaColor.create(32, 256)));

export const draw = (line: Unit): void => {
  const { x, y, length, angle, alpha } = line;
  if (alpha < 1) return;

  translateRotate(x, y, angle);
  const halfLen = length / 2;
  p.stroke(AlphaColor.get(alphaColor, alpha));
  p.line(-halfLen, 0, halfLen, 0);
  undoTranslateRotate();
};
