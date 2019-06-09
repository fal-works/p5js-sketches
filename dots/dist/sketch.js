/**
 * Dots.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

(function() {
  "use strict";

  /**
   * ---- Common environment utility -------------------------------------------
   */
  /**
   * Finds HTML element by `id`. If not found, returns `document.body`.
   * @param id
   */
  const getElementOrBody = id => document.getElementById(id) || document.body;
  /**
   * Returns the width and height of `node`.
   * If `node === document.body`, returns the inner width and height of `window`.
   * @param node
   */
  const getElementSize = node =>
    node === document.body
      ? {
          width: window.innerWidth,
          height: window.innerHeight
        }
      : node.getBoundingClientRect();

  /**
   * ---- Common array utility -------------------------------------------------
   */
  /**
   * Runs `callback` once for each element of `array`.
   * Unlike `forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  function loop(array, callback) {
    const arrayLength = array.length;
    for (let i = 0; i < arrayLength; i += 1) {
      callback(array[i], i, array);
    }
  }

  /**
   * ---- Common bounding box utility ------------------------------------------
   */
  /**
   * Parameter for `getScaleFactor()`.
   * `FIT_TO_BOX` checks both width and height and returns the smaller scale factor.
   */
  var FittingOption;
  (function(FittingOption) {
    FittingOption["FIT_TO_BOX"] = "FIT_TO_BOX";
    FittingOption["FIT_WIDTH"] = "FIT_WIDTH";
    FittingOption["FIT_HEIGHT"] = "FIT_HEIGHT";
  })(FittingOption || (FittingOption = {}));
  /**
   * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
   *
   * @param nonScaledSize
   * @param targetSize
   * @param fittingOption
   */
  const getScaleFactor = (nonScaledSize, targetSize, fittingOption) => {
    switch (fittingOption) {
      default:
      case "FIT_TO_BOX":
        return Math.min(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case "FIT_WIDTH":
        return targetSize.width / nonScaledSize.width;
      case "FIT_HEIGHT":
        return targetSize.height / nonScaledSize.height;
    }
  };

  /**
   * ---- p5.js transformation utility -----------------------------------------
   */
  /**
   * Runs `drawCallback` scaled with `scaleFactor`,
   * then restores the transformation by scaling with the inversed factor.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param p
   * @param drawCallback
   * @param scaleFactor
   */
  function drawScaled(p, drawCallback, scaleFactor) {
    p.scale(scaleFactor);
    drawCallback(p);
    p.scale(1 / scaleFactor);
  }

  /**
   * ---- p5.js canvas utility -------------------------------------------------
   */
  /**
   * Runs `p.createCanvas()` with the scaled size that fits to `node`.
   * Returns the created canvas and the scale factor.
   *
   * @param p - The p5 instance.
   * @param node - The HTML element or its ID.
   * @param nonScaledSize
   * @param fittingOption
   * @param renderer
   */
  function createScaledCanvas(p, node, nonScaledSize, fittingOption, renderer) {
    const maxCanvasSize = getElementSize(
      typeof node === "string" ? getElementOrBody(node) : node
    );
    const scaleFactor = getScaleFactor(
      nonScaledSize,
      maxCanvasSize,
      fittingOption
    );
    const canvas = p.createCanvas(
      scaleFactor * nonScaledSize.width,
      scaleFactor * nonScaledSize.height,
      renderer
    );
    return {
      p5Canvas: canvas,
      scaleFactor: scaleFactor,
      nonScaledSize: nonScaledSize,
      drawScaled: drawCallback => drawScaled(p, drawCallback, scaleFactor)
    };
  }

  /**
   * ---- p5.js drawing utility ------------------------------------------------
   */
  /**
   * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
   * The style and transformations will be restored by using `p.push()` and `p.pop()`.
   * @param p The p5 instance.
   * @param drawCallback
   */
  function createPixels(p, drawCallback) {
    p.push();
    drawCallback(p);
    p.pop();
    p.loadPixels();
    return p.pixels;
  }

  /**
   * ---- Common random utility ------------------------------------------------
   */
  const createTimer = duration => {
    let count = 0;
    const step = () => {
      count += 1;
    };
    const isCompleted = () => count === duration;
    const reset = () => {
      count = 0;
    };
    const getProgressRatio = () => count / duration;
    const getCount = () => count;
    return {
      step,
      isCompleted,
      reset,
      getProgressRatio,
      getCount
    };
  };
  const createTimerChain = (phases, loopCallback = () => {}) => {
    let phaseIndex = 0;
    let currentCallback = phases[0].callback;
    const phaseLength = phases.length;
    const timers = [];
    const callbacks = [];
    for (let i = 0, len = phases.length; i < len; i += 1) {
      timers.push(createTimer(phases[i].duration));
      callbacks.push(phases[i].callback);
    }
    let currentTimer = timers[0];
    const step = () => {
      currentTimer.step();
      if (currentTimer.isCompleted()) {
        currentTimer.reset();
        phaseIndex += 1;
        if (phaseIndex >= phaseLength) {
          phaseIndex = 0;
          loopCallback();
        }
        currentTimer = timers[phaseIndex];
        currentCallback = phases[phaseIndex].callback;
      }
    };
    const runPhase = () => {
      currentCallback(currentTimer);
    };
    return {
      step,
      runPhase
    };
  };

  /**
   * ---- Common random utility ------------------------------------------------
   */
  /**
   * easeOutQuad.
   * @param ratio
   */
  function easeOutQuad(ratio) {
    return -Math.pow(ratio - 1, 2) + 1;
  }
  /**
   * easeOutQuart.
   * @param ratio
   */
  function easeOutQuart(ratio) {
    return -Math.pow(ratio - 1, 4) + 1;
  }

  /**
   * ---- Main sketch ----------------------------------------------------------
   */
  const HTML_ELEMENT = getElementOrBody("Dots");
  const sketch = p => {
    const GRAPHICS_FRAME_LENGTH = 128;
    let canvas;
    let backgroundPixels;
    let backgroundColor;
    let graphicsFrames;
    let dots;

    const createDot = (x, y) => {
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
            callback: timer => {
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
            callback: timer => {
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
        setFactor: newFactor => {
          factor = newFactor;
        }
      };
    };
    const runDot = dot => {
      dot.step();
      dot.draw();
    };

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
        const graphics = p.createGraphics(gSize, gSize);
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

    function drawSketch() {
      loop(dots, runDot);
    }

    p.preload = () => {};
    p.setup = () => {
      const nonScaledSize = { width: 640, height: 640 };
      canvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
      backgroundColor = p.color(252, 252, 255);
      backgroundPixels = createPixels(p, p => {
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
})();
//# sourceMappingURL=sketch.js.map
