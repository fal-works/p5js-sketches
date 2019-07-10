/**
 * Cloud Counter.
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
   * Runs `drawCallback` translated with `offsetX` and `offsetY`,
   * then restores the transformation by calling `p.translate()` with negative values.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param p
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   */
  function drawTranslated(p, drawCallback, offsetX, offsetY) {
    p.translate(offsetX, offsetY);
    drawCallback(p);
    p.translate(-offsetX, -offsetY);
  }
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
   * ---- Main sketch ----------------------------------------------------------
   */
  const HTML_ELEMENT = getElementOrBody("CloudCounter");
  const sketch = p => {
    const ANGLE_RESOLUTION = 12;
    const DEFAULT_SHAPE_SIZE = 100;
    let canvas;
    let backgroundPixels;
    let backgroundColor;
    const vertices = [];
    let shapeColor;
    let reactionFactor = 0;
    let time = 0;
    let currentCount = -1;
    let shapeIsActive = false;
    let loaded = false;

    const sq = v => v * v;
    function mouseIsOver(scaledX, scaledY) {
      const mouseAngle = (p.atan2(scaledY, scaledX) + p.TWO_PI) % p.TWO_PI;
      const x = -canvas.nonScaledSize.width / 2 + scaledX / canvas.scaleFactor;
      const y = -canvas.nonScaledSize.height / 2 + scaledY / canvas.scaleFactor;
      const mouseDistanceSq = sq(x) + sq(y);
      const vertexIndex = Math.floor(
        mouseAngle / (p.TWO_PI / ANGLE_RESOLUTION)
      );
      return mouseDistanceSq <= vertices[vertexIndex].magSq();
    }
    function updateShape(vertices, size) {
      for (let i = 0; i < ANGLE_RESOLUTION; i += 1) {
        const angle = (i * p.TWO_PI) / ANGLE_RESOLUTION;
        const distance = size * (1 + 1 * p.noise(i * 0.5, time));
        vertices[i].set(distance * Math.cos(angle), distance * Math.sin(angle));
      }
    }
    function drawShape(p) {
      p.beginShape();
      const len = vertices.length;
      const maxI = len + 3;
      for (let i = 0; i < maxI; i += 1) {
        const index = i % len;
        const vertex = vertices[index];
        p.curveVertex(vertex.x, vertex.y);
      }
      p.endShape();
    }
    function drawText(p) {
      p.text(currentCount, 0, 0);
    }
    function getCount() {
      const request = new XMLHttpRequest();
      request.open("GET", "https://cloud-counter.herokuapp.com/", true);
      request.responseType = "json";
      request.onload = function() {
        const data = request.response;
        if (data.count > currentCount) {
          currentCount = data.count;
          reactionFactor = 1.0;
        }
        loaded = true;
      };
      request.send();
    }
    function incrementCount() {
      currentCount += 1;
      reactionFactor = 1.0;
      const request = new XMLHttpRequest();
      request.open(
        "GET",
        "https://cloud-counter.herokuapp.com/increment",
        true
      );
      request.responseType = "json";
      request.onload = function() {
        const data = request.response;
        if (data.count > currentCount) {
          currentCount = data.count;
          reactionFactor = 1.0;
        }
      };
      request.send();
    }

    function initializeStyle() {
      p.noStroke();
      p.fill(shapeColor);
      p.blendMode(p.DIFFERENCE);
      p.strokeWeight(2);
      p.textAlign(p.CENTER, p.CENTER);
    }
    function initializeData() {
      for (let i = 0; i < ANGLE_RESOLUTION; i += 1) {
        vertices.push(p.createVector());
      }
    }

    function drawSketch() {
      let shakeOffsetX = 0;
      let shakeOffsetY = 0;
      if (reactionFactor > 0.01) {
        shakeOffsetX =
          reactionFactor * p.random(-1, 1) * canvas.nonScaledSize.width * 0.1;
        shakeOffsetY =
          reactionFactor * p.random(-1, 1) * canvas.nonScaledSize.height * 0.1;
      }

      p.noStroke();
      p.fill(shapeColor);
      if (loaded) {
        p.textFont("Impact", 64);
        drawTranslated(
          p,
          drawText,
          reactionFactor * shakeOffsetX,
          reactionFactor * shakeOffsetY
        );
        p.textFont("Verdana", 24);
        p.text(
          `Clicked ${currentCount} times around the world.`,
          0,
          0.4 * canvas.nonScaledSize.height
        );
      } else {
        p.textFont("Verdana", 24);
        p.text("Connecting.\nPlease wait a few seconds...", 0, 0);
      }

      if (!loaded) return;
      if (!shapeIsActive) {
        p.stroke(shapeColor);
        p.noFill();
      }
      drawTranslated(p, drawShape, shakeOffsetX, shakeOffsetY);
    }

    p.preload = () => {};
    p.setup = () => {
      const nonScaledSize = { width: 800, height: 800 };
      canvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
      backgroundColor = p.color(252, 252, 255);
      backgroundPixels = createPixels(p, p => {
        p.background(backgroundColor);
      });
      shapeColor = p.color(255, 255, 240);
      initializeStyle();
      initializeData();
      getCount();
    };
    p.draw = () => {
      p.pixels = backgroundPixels;
      p.updatePixels();
      updateShape(vertices, (1 + sq(reactionFactor)) * DEFAULT_SHAPE_SIZE);
      p.translate(0.5 * p.width, 0.45 * p.height);
      canvas.drawScaled(drawSketch);
      time += (1 + 16 * reactionFactor) * 0.01;
      reactionFactor *= 0.92;
      if (p.frameCount % 60 === 0) getCount();
    };
    p.mousePressed = () => {
      if (!loaded) return;
      shapeIsActive = mouseIsOver(p.mouseX, p.mouseY);
      if (shapeIsActive) {
        incrementCount();
        return;
      }
    };
    p.mouseMoved = () => {
      if (!loaded) return;
      shapeIsActive = mouseIsOver(p.mouseX, p.mouseY);
    };
    p.mouseReleased = () => {
      shapeIsActive = mouseIsOver(p.mouseX, p.mouseY);
    };
    p.touchStarted = () => {
      if (!loaded) return;
      if (mouseIsOver(p.mouseX, p.mouseY)) {
        shapeIsActive = true;
        incrementCount();
        return false;
      }
    };
    p.touchMoved = () => {};
    p.touchEnded = () => {
      shapeIsActive = false;
    };
    p.keyTyped = () => {
      if (p.key === "p") p.noLoop();
      if (p.key === "s") p.save("image.png");
    };
  };
  new p5(sketch, HTML_ELEMENT);
})();
//# sourceMappingURL=sketch.js.map
