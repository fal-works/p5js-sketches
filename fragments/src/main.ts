import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";
import * as Fragment from "./fragment";
import { p, canvas } from "./global";

const { ArrayList } = CCC;
const { startSketch, createPixels, replaceCanvasPixels, pauseOrResume } = p5ex;

// ---- variables | functions ----
let drawBackground: () => void;
const fragments = ArrayList.create<Fragment.Unit>(256);

// ---- reset & initialize ----

const prelaod = (): void => {};

const reset = (): void => {};

const initialize = (): void => {
  const backgroundPixels = createPixels(() => {
    canvas.drawScaled(() => {
      const { width, height } = LOGICAL_CANVAS_SIZE;
      /* eslint-disable @typescript-eslint/no-explicit-any */
      const g = (p.createGraphics(width / 4, height / 4) as any) as p5;
      g.background(232, 236, 240);
      g.noStroke();
      g.fill(252, 253, 255);
      g.ellipse(g.width / 2, g.height / 2, g.width, g.height);
      g.filter(p.BLUR, 10);
      p.image(g as any, 0, 0, width, height);
      /* eslint-enable */
    });
  });
  drawBackground = () => replaceCanvasPixels(backgroundPixels);

  p.imageMode(p.CENTER);

  reset();
};

// ---- draw ----

const drawSketch = (): void => {
  if (p.frameCount % 4 === 0) ArrayList.add(fragments, Fragment.create());
  ArrayList.removeShiftAll(fragments, Fragment.update);
  ArrayList.loop(fragments, Fragment.draw);
};

const draw = (): void => {
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
  p.preload = prelaod;
  p.draw = draw;
  p.keyTyped = keyTyped;
};

startSketch({
  htmlElement: HTML_ELEMENT,
  logicalCanvasSize: LOGICAL_CANVAS_SIZE,
  initialize,
  setP5Methods,
  fittingOption: undefined // set null to diable scaling
});
