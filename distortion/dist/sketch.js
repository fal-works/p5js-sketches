/**
 * Distortion.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/distortion

 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, CCC) {
  "use strict";

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const { Numeric, Arrays } = CCC;
  const { onSetup, onInstantiate } = p5ex;
  /**
   * Shared p5 instance.
   */
  let p;
  onInstantiate.push((p5Instance) => {
    p = p5Instance;
  });
  /**
   * Shared canvas instance.
   */
  let canvas;
  onSetup.push(() => {
    canvas = p5ex.canvas;
  });

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /** The id of the HTML element to which the canvas should belong. */
  const HTML_ELEMENT_ID = "Distortion";
  /** The logical width of the canvas. */
  const LOGICAL_CANVAS_WIDTH = 1920;
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 1080;

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let photo;
  let originalPixels;
  let x;
  let time = 0;
  const preload = () => {
    photo = p.loadImage("photo.jpg");
  };
  const reset = () => {
    canvas.drawScaled(() => {
      p.image(photo, 0, 0);
    });
    p.loadPixels();
    originalPixels = p.pixels.slice();
    x = Arrays.createIntegerSequence(Numeric.ceil(p.width));
  };
  const initialize = () => {
    p.pixelDensity(1);
    p.frameRate(30);
    reset();
  };
  const noise = (rowOffset, time, x) =>
    -0.5 + p.noise(rowOffset + time + x * 0.005);
  const draw = () => {
    const { floor } = Numeric;
    const { pixels, width, frameCount } = p;
    const totalLength = pixels.length;
    const indicesPerRow = width * 4;
    const editLength = totalLength - indicesPerRow;
    const timeScale = 0.3 * Numeric.cube(p.noise(frameCount * 0.03));
    time += timeScale;
    let index = 0;
    let y = 0;
    while (index < indicesPerRow) {
      pixels[index] = originalPixels[index++];
      pixels[index] = originalPixels[index++];
      pixels[index] = originalPixels[index];
      index += 2;
    }
    y += 1;
    let row = -1;
    let indexOffset = [];
    while (index < editLength) {
      const newRow = y >> 2;
      if (row != newRow) {
        row = newRow;
        const noiseFactor = Numeric.pow4(p.noise(0.05 * row + time));
        indexOffset = x.map(
          (x) => floor(noiseFactor * 0.65 * noise(row, time, x) * width) << 2
        );
      }
      for (let x = 0; x < width; x += 1) {
        const sourceIndex = index + indexOffset[x];
        pixels[index] = originalPixels[sourceIndex];
        pixels[index + 1] = originalPixels[sourceIndex + 1];
        pixels[index + 2] = originalPixels[sourceIndex + 2];
        index += 4;
      }
      y += 1;
    }
    while (index < totalLength) {
      pixels[index] = originalPixels[index++];
      pixels[index] = originalPixels[index++];
      pixels[index] = originalPixels[index];
      index += 2;
    }
    p.updatePixels();
  };
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        p5ex.pauseOrResume();
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
  const p5Methods = {
    draw,
    keyTyped,
    preload,
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  p5ex.startSketch({
    htmlElement: HTML_ELEMENT_ID,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    logicalCanvasWidth: LOGICAL_CANVAS_WIDTH,
    initialize: initialize,
    windowResized: () => canvas.resizeIfNeeded(),
    onCanvasResized: reset,
    p5Methods: p5Methods,
  });
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
