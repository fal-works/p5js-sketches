/**
 * Title.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <contact@fal-works.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

(function(p5) {
  "use strict";

  p5 = p5 && p5.hasOwnProperty("default") ? p5["default"] : p5;

  /**
   * -----------------------------------------------------------------------------
   * @module common/environment
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
   * -----------------------------------------------------------------------------
   * @module common/ds/array
   */
  /**
   * Runs `callback` once for each element of `array`.
   * Unlike `forEach()`, an element of `array` should not be removed during the iteration.
   * @param array
   * @param callback
   */
  const loop = (array, callback) => {
    const arrayLength = array.length;
    for (let i = 0; i < arrayLength; i += 1) {
      callback(array[i], i, array);
    }
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/shared
   */
  /**
   * The shared `p5` instance.
   */
  let p;
  /**
   * The shared `ScaledCanvas` instance.
   */
  let canvas;
  /**
   * Sets the given `p5` instance to be shared.
   * @param instance
   */
  const setP5Instance = instance => {
    p = instance;
  };
  /**
   * Sets the given `ScaledCanvas` instance to be shared.
   * @param scaledCanvas
   */
  const setCanvas = scaledCanvas => {
    canvas = scaledCanvas;
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/bounding-box
   */
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
      case "FIT_TO_BOX" /* FIT_TO_BOX */:
        return Math.min(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case "FIT_WIDTH" /* FIT_WIDTH */:
        return targetSize.width / nonScaledSize.width;
      case "FIT_HEIGHT" /* FIT_HEIGHT */:
        return targetSize.height / nonScaledSize.height;
    }
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/transform
   */
  /**
   * Runs `drawCallback` rotated with `angle`,
   * then restores the transformation by calling `p.rotate()` with the negative value.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param angle
   */
  const drawRotated = (drawCallback, angle) => {
    p.rotate(angle);
    drawCallback();
    p.rotate(-angle);
  };
  /**
   * Composite of `drawTranslated()` and `drawRotated()`.
   *
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param angle
   */
  const drawTranslatedAndRotated = (drawCallback, offsetX, offsetY, angle) => {
    p.translate(offsetX, offsetY);
    drawRotated(drawCallback, angle);
    p.translate(-offsetX, -offsetY);
  };
  /**
   * Runs `drawCallback` scaled with `scaleFactor`,
   * then restores the transformation by scaling with the inversed factor.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param drawCallback
   * @param scaleFactor
   */
  const drawScaled = (drawCallback, scaleFactor) => {
    p.scale(scaleFactor);
    drawCallback();
    p.scale(1 / scaleFactor);
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/canvas
   */
  /**
   * Runs `p.createCanvas()` with the scaled size that fits to `node`.
   * Returns the created canvas and the scale factor.
   *
   * @param node - The HTML element or its ID.
   * @param logicalSize
   * @param fittingOption
   * @param renderer
   */
  const createScaledCanvas = (node, logicalSize, fittingOption, renderer) => {
    const maxCanvasSize = getElementSize(
      typeof node === "string" ? getElementOrBody(node) : node
    );
    const scaleFactor = getScaleFactor(
      logicalSize,
      maxCanvasSize,
      fittingOption
    );
    const canvas = p.createCanvas(
      scaleFactor * logicalSize.width,
      scaleFactor * logicalSize.height,
      renderer
    );
    return {
      p5Canvas: canvas,
      scaleFactor: scaleFactor,
      logicalSize: logicalSize,
      drawScaled: drawCallback => drawScaled(drawCallback, scaleFactor),
      logicalCenterPosition: {
        x: logicalSize.width / 2,
        y: logicalSize.height / 2
      }
    };
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/setup
   */
  /**
   * A list of functions that will be called in `p.setup()`.
   */
  const onSetup = [];

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/main
   */
  /**
   * Calls `new p5()` with the given settings information.
   * @param settings
   */
  const startSketch = settings => {
    const htmlElement =
      typeof settings.htmlElement === "string"
        ? getElementOrBody(settings.htmlElement)
        : settings.htmlElement;
    new p5(p => {
      setP5Instance(p);
      p.setup = () => {
        setCanvas(createScaledCanvas(htmlElement, settings.logicalCanvasSize));
        settings.initialize();
        loop(onSetup, listener => listener(p));
        onSetup.length = 0;
      };
      settings.setP5Methods(p);
    }, htmlElement);
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/pause
   */
  let paused = false;
  /**
   * Pauses the sketch by `p.noLoop()`.
   * If already paused, resumes by `p.loop()`.
   */
  const pauseOrResume = () => {
    if (paused) {
      p.loop();
      paused = false;
    } else {
      p.noLoop();
      paused = true;
    }
  };

  /**
   * -----------------------------------------------------------------------------
   * @module common/p5util/pixels
   */
  /**
   * Runs `drawCallback` and `p.loadPixels()`, then returns `p.pixels`.
   * The style and transformations will be restored by using `p.push()` and `p.pop()`.
   * @param p The p5 instance.
   * @param drawCallback
   */
  const createPixels = drawCallback => {
    p.push();
    drawCallback();
    p.pop();
    p.loadPixels();
    return p.pixels;
  };
  /**
   * Replaces the whole pixels of the canvas.
   * Assigns the given pixels to `p.pixels` and calls `p.updatePixels()`.
   * @param pixels
   */
  const replacePixels = pixels => {
    p.pixels = pixels;
    p.updatePixels();
  };

  /**
   * -----------------------------------------------------------------------------
   * @module settings
   */
  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "Template";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = getElementOrBody(HTML_ELEMENT_ID);
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 800,
    height: 800
  };

  /**
   * -----------------------------------------------------------------------------
   * @module constants
   */
  const BACKGROUND_COLOR = "#F8F8F8";
  const SQUARE_COLOR = "#202020";
  const SQUARE_SIZE = 100;
  const ROTATION_SPEED = 0.05;

  /**
   * -----------------------------------------------------------------------------
   * @module main
   */
  // ---- variables | functions ----
  let drawBackground;
  const initialize = () => {
    const backgroundColor = p.color(BACKGROUND_COLOR);
    const backgroundPixels = createPixels(() => p.background(backgroundColor));
    drawBackground = replacePixels.bind(null, backgroundPixels);
    p.noStroke();
    p.fill(SQUARE_COLOR);
    p.rectMode(p.CENTER);
  };
  // ---- draw ----
  const drawSquare = () => p.square(0, 0, SQUARE_SIZE);
  const drawSketch = () => {
    const center = canvas.logicalCenterPosition;
    drawTranslatedAndRotated(
      drawSquare,
      center.x,
      center.y,
      p.frameCount * ROTATION_SPEED
    );
  };
  const draw = () => {
    drawBackground();
    canvas.drawScaled(drawSketch);
  };
  // ---- UI ----
  const mousePressed = () => {};
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        pauseOrResume();
        break;
      case "s":
        p.save("image.png");
        break;
      case "r":
        break;
    }
  };
  // ---- start sketch ----
  const setP5Methods = p => {
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.keyTyped = keyTyped;
  };
  startSketch({
    htmlElement: HTML_ELEMENT,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize,
    setP5Methods
  });
})(p5);
//# sourceMappingURL=sketch.js.map
