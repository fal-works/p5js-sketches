/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels, pauseOrResume } from "@fal-works/p5-extension";
import {
  p,
  canvas,
  resetCommon,
  Timer,
  Random,
  Easing as Ease,
  context,
} from "./common";
import * as Shape from "./shape";
import * as ShapeArray from "./shape-array";

// ---- variables | functions ----
let drawBackground: () => void;
const shapeArrays: ShapeArray.Unit[] = [];
const timers = Timer.Set.construct(32);

// ---- reset & initialize ----
const createBackground = () => {
  p.blendMode(p.REPLACE);
  p.background(0, 0, 99);
  return storePixels();
};

const resetShapes = () => {
  shapeArrays.length = 0;

  const { width, height } = canvas.logicalSize;

  const xInterval = 96;
  const yInterval = 96;
  const columns = Math.floor(width / xInterval) - 1;
  const rows = Math.floor(height / yInterval) - 1;

  const forEachColumn = (callback: (x: number) => void) => {
    for (
      let i = 0, x = width / 2 - ((columns - 1) / 2) * xInterval;
      i < columns;
      i += 1, x += xInterval
    ) {
      callback(x);
    }
  };

  const forEachRow = (callback: (y: number) => void) => {
    for (
      let k = 0, y = height / 2 - ((rows - 1) / 2) * yInterval;
      k < rows;
      k += 1, y += yInterval
    ) {
      callback(y);
    }
  };

  const createShape = (x: number, y: number, baseHue: number) => {
    let hue = baseHue + Random.signed(30);
    if (hue < 0) hue += 360;
    else if (360 < hue) hue -= 360;
    return Shape.create(x, y, p.color(hue, 100, 30, 1.0));
  };

  const setTimer = (shapeArray: ShapeArray.Unit, onComplete: () => void) => {
    const appear = Timer.create({
      duration: 30,
      onProgress: (progress) =>
        (shapeArray.visibility = Ease.Out.quart(progress.ratio)),
    });
    const wait = Timer.create({ duration: Random.Integer.between(60, 420) });
    const disappear = Timer.create({
      duration: 30,
      onProgress: (progress) =>
        (shapeArray.visibility = 1.0 - Ease.Out.quart(progress.ratio)),
      onComplete: () => {
        onComplete();
        setTimer(shapeArray, onComplete);
      },
    });
    timers.add(Timer.chain([appear, wait, disappear]));
  };

  forEachRow((y) => {
    const createArray = () => {
      const array: Shape.Unit[] = [];
      const baseHue = Random.value(360);
      forEachColumn((x) => array.push(createShape(x, y, baseHue)));
      return array;
    };
    const shapeArray = ShapeArray.create(
      createArray(),
      ShapeArray.ArrayType.Row
    );
    setTimer(shapeArray, () => {
      shapeArray.array = createArray();
    });
    shapeArrays.push(shapeArray);
  });

  forEachColumn((x) => {
    const createArray = () => {
      const array: Shape.Unit[] = [];
      const baseHue = Random.value(360);
      forEachRow((y) => array.push(createShape(x, y, baseHue)));
      return array;
    };
    const shapeArray = ShapeArray.create(
      createArray(),
      ShapeArray.ArrayType.Column
    );
    setTimer(shapeArray, () => {
      shapeArray.array = createArray();
    });
    shapeArrays.push(shapeArray);
  });
};

export const reset = () => {
  drawBackground = createBackground();

  resetCommon();

  resetShapes();

  p.blendMode(p.DIFFERENCE);
};

export const initialize = (): void => {
  p.colorMode(p.HSB, 360, 100, 100, 1);
  p.noStroke();
  p.rectMode(p.CENTER);

  reset();

  context;
  // const { scaleFactor } = canvas;
  // context.shadowOffsetX = scaleFactor * 16;
  // context.shadowOffsetY = scaleFactor * 16;
  // context.shadowBlur = scaleFactor * 6;
  // context.shadowColor = `rgba(0, 0, 0, 0.1)`;
};

// ---- draw ----

const updateSketch = () => {
  timers.step();
  for (const array of shapeArrays) ShapeArray.update(array);
};

const drawSketch = () => {
  for (const array of shapeArrays) ShapeArray.draw(array);
};

const draw = (): void => {
  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const keyTyped = () => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
    case "r":
      reset();
      break;
  }

  return false;
};

// ---- p5 methods ----

export const p5Methods = {
  draw,
  keyTyped,
};
