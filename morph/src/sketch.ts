/**
 * ---- Sketch ----------------------------------------------------------------
 */

import p5 from "p5";
import { onSetup, pauseOrResume } from "@fal-works/p5-extension";
import { p, canvas, Random } from "./common";
import * as Point from "./point";

// ---- variables & functions ----
const { PI, cos, sin } = Math;
const points: Point.Unit[] = [];
const diffuse = () => {
  const { width, height } = canvas.logicalSize;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  points.forEach((point) => {
    point.targetX = Random.between(-halfWidth, halfWidth);
    point.targetY = Random.between(-halfHeight, halfHeight);
  });
};
const circle = () => {
  const maxIndex = points.length;
  const radius = 240;
  const angleInterval = (2 * PI) / maxIndex;
  points.forEach((point, i) => {
    const angle = i * angleInterval;
    point.targetX = radius * cos(angle);
    point.targetY = radius * sin(angle);
  });
};
const fan = () => {
  const maxIndex = points.length;
  const radius = 120;
  const angleInterval = (2 * PI) / maxIndex;
  points.forEach((point, i) => {
    const angle = i * angleInterval;
    const factor = 1 + sin(4 * angle);
    point.targetX = radius * cos(angle) * factor;
    point.targetY = radius * sin(angle) * factor;
  });
};

let backgroundColor: p5.Color;
let shapeColor: p5.Color;
onSetup.push((p) => {
  backgroundColor = p.color(255, 12);
  shapeColor = p.color(255, 0, 128, 16);
});

// ---- reset & initialize ----
const drawSketch = (): void => {
  const { width, height } = canvas.logicalSize;
  p.translate(width / 2, height / 2);

  points.forEach(Point.draw);
};

export const reset = (): void => {};

export const initialize = (): void => {
  p.frameRate(30);

  p.noStroke();

  points.length = 0;
  const { width, height } = canvas.logicalSize;
  const halfWidth = width / 2;
  const halfHeight = height / 2;
  for (let i = 0; i < Point.count; i += 1) {
    points.push(
      Point.create(
        i,
        Random.between(-halfWidth, halfWidth),
        Random.between(-halfHeight, halfHeight)
      )
    );
  }

  circle();
  p.background(255);

  reset();
};

const draw = () => {
  switch (p.frameCount % 180) {
    case 0:
      circle();
      break;
    case 60:
      fan();
      break;
    case 120:
      diffuse();
      break;
  }

  Point.tick();
  points.forEach(Point.update);

  p.blendMode(p.ADD);
  p.fill(backgroundColor);
  p.rect(0, 0, p.width, p.height);

  p.blendMode(p.BLEND);
  p.fill(shapeColor);
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
  keyTyped,
  draw,
};
