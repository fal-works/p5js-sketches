import p5 from "p5";
import * as p5ex from "@fal-works/p5-extension";

import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";
import * as Contours from "./contours";
import { p, canvas, Mouse } from "./global";

const { startSketch, createPixels, replaceCanvasPixels, pauseOrResume } = p5ex;

// ---- variables | functions ----
let drawBackground: () => void;
let cursorColor: p5.Color;

// ---- reset & initialize ----
const reset = Contours.reset;

const initialize = (): void => {
  const backgroundPixels = createPixels(() => {
    canvas.drawScaled(() => {
      const { width, height } = LOGICAL_CANVAS_SIZE;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const g = (p.createGraphics(width / 4, height / 4) as any) as p5;
      g.background(236, 232, 240);
      g.noStroke();
      g.fill(253, 252, 255);
      g.ellipse(g.width / 2, g.height / 2, g.width, g.height);
      g.filter(p.BLUR, 10);
      p.image(g as any, 0, 0, width, height);
      /* eslint-enable */
    });
  });
  drawBackground = () => replaceCanvasPixels(backgroundPixels);

  cursorColor = p.color(96);

  Mouse.setCenter();

  reset();
};

// ---- draw ----

const drawCursor = Mouse.drawAtCursor.bind(undefined, () => {
  const pressed = p.mouseIsPressed;
  if (pressed) p.rotate(0.1 * p.frameCount);

  const halfSize = pressed ? 30 : 20;
  p.stroke(cursorColor);
  p.strokeWeight(pressed ? 10 : 6);
  p.line(-halfSize, 0, halfSize, 0);
  p.line(0, -halfSize, 0, halfSize);

  if (pressed) p.rotate(-0.1 * p.frameCount);
});

const drawSketch = () => {
  Contours.draw();
  drawCursor();
};

const draw = (): void => {
  Contours.update();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const keyTyped = (): void => {
  switch (p.key) {
    case "p":
      pauseOrResume();
      break;
    case "g":
      p.save("image.png");
      break;
  }
};

// ---- start sketch ----

const setP5Methods = (p: p5): void => {
  p.draw = draw;
  p.keyTyped = keyTyped;
  p.mouseMoved = Mouse.updatePosition;
  p.mouseDragged = Mouse.updatePosition;
  p.mousePressed = Contours.gather;
  p.mouseReleased = Contours.release;
};

startSketch({
  htmlElement: HTML_ELEMENT,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize,
  setP5Methods,
  fittingOption: undefined // set null to diable scaling
});
