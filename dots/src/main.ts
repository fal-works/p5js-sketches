/**
 * ---- Main sketch ----------------------------------------------------------
 */

import { getElementOrBody } from "./common/environment";
// import * as random from "./common/random";
import { loop } from "./common/array";

import { createScaledCanvas, ScaledCanvas } from "./p5util/canvas";
// import { createApplyColor, ApplyColorFunction } from "./p5util/color";
import { createPixels } from "./p5util/drawing";
// import { drawTranslated, drawTranslatedAndRotated } from "./p5util/transform";

import { createTimerChain, Timer } from "./common/timer";
import { easeOutQuad, easeOutQuart } from "./common/easing";

const HTML_ELEMENT = getElementOrBody("Dots");

interface Sprite {
  step: () => void;
  draw: () => void;
}

interface Dot extends Sprite {
  setFactor: (factor: number) => void;
}

const sketch = (p: p5): void => {
  // ---- variables
  const GRAPHICS_FRAME_LENGTH = 128;
  let canvas: ScaledCanvas;
  let backgroundPixels: number[];
  let backgroundColor: p5.Color;
  let graphicsFrames: p5.Graphics[];
  let dots: Sprite[];

  // ---- functions
  const createDot = (x: number, y: number): Dot => {
    let factor = 1;
    let active = true;
    let noiseTime = 0;
    const lastFrameIndex = graphicsFrames.length - 1;
    const loopCallback = () => {
      noiseTime += 1;
      factor = (p.noise(0.01 * x, 0.01 * y, noiseTime) - 0.5) * 2;
      factor = Math.min(factor + p.random(-0.3, 0.3), 1);
      active = factor > 0;
    };
    loopCallback();
    const timerChain = createTimerChain(
      [
        {
          duration: 15,
          callback: (timer: Timer) => {
            if (!active) return;
            const frameIndex =
              (factor * timer.getProgressRatio() * lastFrameIndex) | 0;
            p.image(graphicsFrames[frameIndex], x, y);
          }
        },
        {
          duration: 60,
          callback: () => {
            if (!active) return;
            p.image(graphicsFrames[(factor * lastFrameIndex) | 0], x, y);
          }
        },
        {
          duration: 30,
          callback: (timer: Timer) => {
            if (!active) return;
            const frameIndex =
              (factor * (1 - timer.getProgressRatio()) * lastFrameIndex) | 0;
            p.image(graphicsFrames[frameIndex], x, y);
          }
        }
      ],
      loopCallback
    );

    return {
      step: () => {
        timerChain.step();
      },
      draw: () => {
        timerChain.runPhase();
      },
      setFactor: (newFactor: number) => {
        factor = newFactor;
      }
    };
  };

  const runDot = (dot: Dot) => {
    dot.step();
    dot.draw();
  };

  // ---- initialize & reset
  function initializeStyle() {
    p.noFill();
    p.strokeWeight(2);
    p.rectMode(p.CENTER);
    p.imageMode(p.CENTER);
  }

  function initializeData() {
    graphicsFrames = [];

    for (let i = 0; i < GRAPHICS_FRAME_LENGTH; i += 1) {
      const ratio = i / (GRAPHICS_FRAME_LENGTH - 1);
      const sizeRatio = easeOutQuad(ratio);
      const alphaRatio = easeOutQuart(ratio);
      const size = sizeRatio * 12;
      const gSize = (12 + size) | 0;
      const graphics = p.createGraphics(gSize, gSize) as any;
      graphics.noStroke();
      graphics.background(backgroundColor);
      graphics.translate(graphics.width / 2, graphics.height / 2);
      graphics.fill(0, alphaRatio * 192);
      graphics.ellipse(0, 0, size, size);
      graphics.filter(p.BLUR, 2);
      graphics.fill(0, alphaRatio * 192);
      graphics.ellipse(0, 0, size, size);

      graphicsFrames.push(graphics);
    }
  }

  function reset() {
    p.noiseSeed(100 * Math.random());
    dots = [];
    for (let x = 24; x < p.width; x += 24) {
      for (let y = 24; y < p.height; y += 24) {
        dots.push(createDot(x, y));
      }
    }
  }

  // ---- core drawing process
  function drawSketch(): void {
    loop(dots, runDot);
  }

  // ---- setup & draw etc.
  p.preload = () => {};

  p.setup = () => {
    const nonScaledSize = { width: 640, height: 640 };
    canvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
    backgroundColor = p.color(252, 252, 255);
    backgroundPixels = createPixels(p, (p: p5) => {
      p.background(backgroundColor);
    });

    initializeStyle();
    initializeData();
    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    canvas.drawScaled(drawSketch);
  };

  p.mousePressed = () => {
    reset();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();
    if (p.key === "s") p.save("dots.png");
  };
};

new p5(sketch, HTML_ELEMENT);
