/**
 * Rotational Symmetry.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.7
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
   * ---- Common random utility ------------------------------------------------
   */
  /**
   * Returns random integer from 0 up to (but not including) `maxInt`.
   * `maxInt` is not expected to be negative.
   * @param maxInt
   * @return A random integer value.
   */
  const pickInt = maxInt => Math.floor(Math.random() * maxInt);
  /**
   * Returns random integer from `minInt` up to (but not including) `maxInt`.
   * The case where `minInt > maxInt` is not expected.
   * @param minInt
   * @param maxInt
   * @return A random integer value.
   */
  const pickIntBetween = (minInt, maxInt) => minInt + pickInt(maxInt - minInt);
  /**
   * Returns one element of `array` randomly.
   * `array` is not expected to be empty.
   * @param array
   * @return A random element.
   */
  const fromArray = array => array[pickInt(array.length)];

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
   * Creates a new 1-dimensional array by concatenating sub-array elements of a 2-dimensional array.
   * @param arrays
   * @return A new 1-dimensional array.
   */
  const flatNaive = arrays => [].concat.apply([], arrays);

  /**
   * ---- Common bounding box utility ------------------------------------------
   */
  /**
   * -
   */
  var FittingOption;
  (function(FittingOption) {
    FittingOption[(FittingOption["FIT_TO_BOX"] = 0)] = "FIT_TO_BOX";
    FittingOption[(FittingOption["FIT_WIDTH"] = 1)] = "FIT_WIDTH";
    FittingOption[(FittingOption["FIT_HEIGHT"] = 2)] = "FIT_HEIGHT";
  })(FittingOption || (FittingOption = {}));
  /**
   * Calculates the scale factor for fitting `nonScaledSize` to `targetSize` keeping the original aspect ratio.
   *
   * @param nonScaledSize
   * @param targetSize
   * @param fittingOption
   */
  const calculateScaleFactor = (nonScaledSize, targetSize, fittingOption) => {
    switch (fittingOption) {
      default:
      case FittingOption.FIT_TO_BOX:
        return Math.min(
          targetSize.width / nonScaledSize.width,
          targetSize.height / nonScaledSize.height
        );
      case FittingOption.FIT_WIDTH:
        return targetSize.width / nonScaledSize.width;
      case FittingOption.FIT_HEIGHT:
        return targetSize.height / nonScaledSize.height;
    }
  };

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
    const scaleFactor = calculateScaleFactor(
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
      nonScaledSize: nonScaledSize
    };
  }

  /**
   * ---- p5.js color utility --------------------------------------------------
   */
  /**
   * Creates a composite function of `p.stroke()` and `p.fill()`.
   * A `null` color will be interpreted as `p.noStroke()` or `p.noFill()`.
   * An `undefined` color will have no effect.
   *
   * @param p - The p5 instance.
   * @param shapeColor - Composite of two colors for `p.stroke()` and `p.fill()`.
   */
  const createApplyColor = (p, shapeColor) => {
    const strokeColor = shapeColor.strokeColor;
    const fillColor = shapeColor.fillColor;
    switch (strokeColor) {
      case undefined:
        switch (fillColor) {
          case undefined:
            return () => {};
          case null:
            return () => p.noFill();
          default:
            return () => p.fill(fillColor);
        }
      case null:
        switch (fillColor) {
          case undefined:
            return () => p.noStroke();
          case null:
            return () => {
              p.noStroke();
              p.noFill();
            };
          default:
            return () => {
              p.noStroke();
              p.fill(fillColor);
            };
        }
      default:
        switch (fillColor) {
          case undefined:
            return () => p.stroke(strokeColor);
          case null:
            return () => {
              p.stroke(strokeColor);
              p.noFill();
            };
          default:
            return () => {
              p.stroke(strokeColor);
              p.fill(fillColor);
            };
        }
    }
  };

  /**
   * ---- p5.js drawing utility ------------------------------------------------
   */
  /**
   * Sets color to the specified pixel.
   * Should be used in conjunction with loadPixels() and updatePixels().
   * @param renderer - Instance of either p5 or p5.Graphics.
   * @param x - The x index of the pixel.
   * @param y - The y index of the pixel.
   * @param red - The red value (0 - 255).
   * @param green - The green value (0 - 255).
   * @param blue - The blue value (0 - 255).
   * @param pixelDensity - If not specified, renderer.pixelDensity() will be called.
   */
  function setPixel(renderer, x, y, red, green, blue, alpha, pixelDensity) {
    const g = renderer;
    const d = pixelDensity || g.pixelDensity();
    const graphicsPixels = g.pixels;
    for (let i = 0; i < d; i += 1) {
      for (let j = 0; j < d; j += 1) {
        const idx = 4 * ((y * d + j) * g.width * d + (x * d + i));
        graphicsPixels[idx] = red;
        graphicsPixels[idx + 1] = green;
        graphicsPixels[idx + 2] = blue;
        graphicsPixels[idx + 3] = alpha;
      }
    }
  }
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
   * Runs `drawCallback` rotated with `angle`,
   * then restores the transformation by calling `p.rotate()` with the negative value.
   * Used to avoid calling `p.push()` and `p.pop()` frequently.
   *
   * @param p
   * @param drawCallback
   * @param angle
   */
  function drawRotated(p, drawCallback, angle) {
    p.rotate(angle);
    drawCallback(p);
    p.rotate(-angle);
  }
  /**
   * Composite of `drawTranslated()` and `drawRotated()`.
   *
   * @param p
   * @param drawCallback
   * @param offsetX
   * @param offsetY
   * @param angle
   */
  function drawTranslatedAndRotated(p, drawCallback, offsetX, offsetY, angle) {
    p.translate(offsetX, offsetY);
    drawRotated(p, drawCallback, angle);
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
   * ---- Other functions ------------------------------------------------------
   */
  function createRandomTextureGraphics(p, size, factor) {
    const g = p.createGraphics(size.width, size.height);
    const width = g.width;
    const height = g.height;
    const pixelDensity = g.pixelDensity();
    g.loadPixels();
    for (let y = 0; y < height; y += 1) {
      for (let x = 0; x < width; x += 1) {
        setPixel(g, x, y, 0, 0, 0, 255 * Math.random() * factor, pixelDensity);
      }
    }
    g.updatePixels();
    return g;
  }

  /**
   * ---- Main sketch ----------------------------------------------------------
   */
  const HTML_ELEMENT = getElementOrBody("RotationalSymmetry");
  const colorStringList = ["#C7243A", "#2266AF", "#009250", "#EDAD0B"];
  const sketch = p => {
    let scaledCanvas;
    let backgroundPixels;
    let icons;
    let shapeCandidates;
    let applyColorFunctionCandidates;

    function drawShapeGroup(shapeGroup) {
      shapeGroup.applyColor();
      const revolution = shapeGroup.revolution % p.TWO_PI;
      const count = shapeGroup.count;
      const shape = shapeGroup.shape;
      const radius = shapeGroup.radius;
      const shapeUnitSize = shapeGroup.shapeSize;
      const rotationFactor = shapeGroup.rotationFactor;
      let angle = revolution;
      const angleInterval = p.TWO_PI / count;
      const drawShape = () => shape.draw(shapeUnitSize);
      for (let i = 0; i < count; i += 1) {
        const x = radius * Math.cos(angle);
        const y = radius * Math.sin(angle);
        const rotationAngle = angle + (rotationFactor || 0) * revolution;
        drawTranslatedAndRotated(p, drawShape, x, y, rotationAngle);
        angle += angleInterval;
      }
      shapeGroup.revolution = revolution + shapeGroup.revolutionVelocity;
    }
    function drawIcon(icon) {
      drawTranslated(
        p,
        () => loop(icon.shapeGroupList, drawShapeGroup),
        icon.x,
        icon.y
      );
    }

    function drawSquare(size) {
      p.rect(0, 0, size, size, 0.05 * size);
    }
    const ONE_THIRD = 1 / 3;
    const TWO_THIRDS = 2 / 3;
    const ROOT_THREE = p.sqrt(3);
    const ONE_OVER_ROOT_THREE = 1 / ROOT_THREE;
    function drawRegularTriangle(size) {
      const sz = 1.2 * size;
      const leftX = -ONE_THIRD * sz;
      const rightX = TWO_THIRDS * sz;
      const bottomY = ONE_OVER_ROOT_THREE * sz;
      p.triangle(rightX, 0, leftX, -bottomY, leftX, bottomY);
    }
    function drawCircle(size) {
      p.ellipse(0, 0, size, size);
    }
    function drawEllipse(size) {
      p.ellipse(0, 0, 0.9 * size, 1.3 * size);
    }
    function drawRhombus(size) {
      p.quad(0.9 * size, 0, 0, 0.6 * size, -0.9 * size, 0, 0, -0.6 * size);
    }
    function drawDrop(size) {
      p.beginShape();
      p.vertex(0.8 * size, 0);
      p.vertex(0, 0.5 * size);
      p.curveVertex(-0.4 * size, 0);
      p.vertex(0, -0.5 * size);
      p.endShape(p.CLOSE);
    }

    function createShapeGroup(
      shapeCandidates,
      count,
      radius,
      revolutionVelocityFactor,
      applyColorFunctionStack
    ) {
      const pickedShape = fromArray(shapeCandidates);
      const poppedApplyColorFunction = applyColorFunctionStack.pop();
      if (!poppedApplyColorFunction) throw new Error("No colors in stack.");
      let determinedRotationFactor;
      switch (pickedShape.maxFoldingNumber) {
        case 1:
          determinedRotationFactor = 0;
          break;
        case 4:
          determinedRotationFactor = fromArray([-2, -1, 0, 1, 2]);
          break;
        case Infinity:
          determinedRotationFactor = null;
          break;
        default:
          determinedRotationFactor = fromArray([-2, 0, 2]);
          break;
      }
      return {
        shape: pickedShape,
        count: count,
        shapeSize: 18,
        radius: radius,
        revolution: 0,
        revolutionVelocity: revolutionVelocityFactor * 0.004 * p.TWO_PI,
        applyColor: poppedApplyColorFunction,
        rotationFactor: determinedRotationFactor
      };
    }
    function createIcon(
      x,
      y,
      shapeCandidates,
      shapeColorCandidates,
      invertedRevolution = false
    ) {
      const applyColorFunctionStack = p.shuffle(shapeColorCandidates, false);
      const revolutionVelocityFactor = invertedRevolution ? -1 : 1;
      const newShapeGroupList = [
        createShapeGroup(
          shapeCandidates,
          pickIntBetween(3, 6),
          35,
          -revolutionVelocityFactor,
          applyColorFunctionStack
        ),
        createShapeGroup(
          shapeCandidates,
          pickIntBetween(4, 10),
          75,
          revolutionVelocityFactor,
          applyColorFunctionStack
        )
      ];
      return {
        x: x,
        y: y,
        shapeGroupList: newShapeGroupList
      };
    }
    function createRotatedShape(shape) {
      if (shape.maxFoldingNumber === Infinity) return null;
      const rotationAngle = 0.5 * (p.TWO_PI / shape.maxFoldingNumber);
      return {
        draw: size => {
          p.rotate(rotationAngle);
          shape.draw(size);
          p.rotate(-rotationAngle);
        },
        maxFoldingNumber: shape.maxFoldingNumber
      };
    }
    function createShiftedShape(shape, shiftFactor) {
      return {
        draw: size => {
          const displacement = shiftFactor * size;
          p.translate(displacement, 0);
          shape.draw(size);
          p.translate(-displacement, 0);
        },
        maxFoldingNumber: 1
      };
    }
    function createCompositeShape(shape, otherShape, maxFoldingNumber) {
      return {
        draw: size => {
          shape.draw(size);
          otherShape.draw(size);
        },
        maxFoldingNumber: maxFoldingNumber
      };
    }
    function createRotatedCompositeShape(baseShape) {
      const rotatedShape = createRotatedShape(baseShape);
      if (!rotatedShape) throw new Error("Could not create rotated shape.");
      return createCompositeShape(
        baseShape,
        rotatedShape,
        baseShape.maxFoldingNumber * 2
      );
    }
    function createShiftedCompositeShape(baseShape) {
      const basemaxFoldingNumber = baseShape.maxFoldingNumber;
      let newmaxFoldingNumber;
      if (basemaxFoldingNumber === Infinity) newmaxFoldingNumber = 2;
      else if (basemaxFoldingNumber % 2 === 0) newmaxFoldingNumber = 2;
      else newmaxFoldingNumber = 1;
      return createCompositeShape(
        createShiftedShape(baseShape, -0.2),
        createShiftedShape(baseShape, 0.2),
        newmaxFoldingNumber
      );
    }
    function createShapePatterns(baseShape) {
      const array = [baseShape];
      const rotatedShape = createRotatedShape(baseShape);
      if (rotatedShape) {
        array.push(rotatedShape);
        array.push(createRotatedCompositeShape(baseShape));
        array.push(createShiftedCompositeShape(rotatedShape));
      }
      const shiftedCompositeShape = createShiftedCompositeShape(baseShape);
      array.push(shiftedCompositeShape);
      if (shiftedCompositeShape.maxFoldingNumber === 2) {
        const rotatedShiftedCompositeShape = createRotatedShape(
          shiftedCompositeShape
        );
        if (rotatedShiftedCompositeShape)
          array.push(rotatedShiftedCompositeShape);
      }
      return array;
    }

    function initializeStyle() {
      p.noFill();
      p.strokeWeight(2);
      p.rectMode(p.CENTER);
    }
    function initializeData() {
      shapeCandidates = flatNaive(
        [
          { draw: drawSquare, maxFoldingNumber: 4 },
          { draw: drawRegularTriangle, maxFoldingNumber: 3 },
          { draw: drawCircle, maxFoldingNumber: Infinity },
          { draw: drawEllipse, maxFoldingNumber: 2 },
          { draw: drawRhombus, maxFoldingNumber: 2 },
          { draw: drawDrop, maxFoldingNumber: 1 }
        ].map(createShapePatterns)
      );
      applyColorFunctionCandidates = colorStringList
        .map(colorString => p.color(colorString))

        .map(color =>
          createApplyColor(p, { strokeColor: color, fillColor: undefined })
        );
    }
    function reset() {
      icons = [];
      let invertedRevolution = false;
      const positionInterval = scaledCanvas.nonScaledSize.width / 3;
      for (let row = 0; row < 3; row += 1) {
        const y = (row + 0.5) * positionInterval;
        for (let column = 0; column < 3; column += 1) {
          const x = (column + 0.5) * positionInterval;
          const newIcon = createIcon(
            x,
            y,
            shapeCandidates,
            applyColorFunctionCandidates,
            invertedRevolution
          );
          icons.push(newIcon);
          invertedRevolution = !invertedRevolution;
        }
      }
    }

    function drawSketch() {
      loop(icons, drawIcon);
    }

    p.preload = () => {};
    p.setup = () => {
      const nonScaledSize = { width: 640, height: 640 };
      scaledCanvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
      backgroundPixels = createPixels(p, p => {
        p.background(255);
        p.scale(scaledCanvas.scaleFactor);
        p.image(createRandomTextureGraphics(p, nonScaledSize, 0.05), 0, 0);
      });
      initializeStyle();
      initializeData();
      reset();
    };
    p.draw = () => {
      p.pixels = backgroundPixels;
      p.updatePixels();
      drawScaled(p, drawSketch, scaledCanvas.scaleFactor);
    };
    p.mousePressed = () => {
      reset();
    };
    p.keyTyped = () => {
      if (p.key === "p") p.noLoop();
    };
  };
  new p5(sketch, HTML_ELEMENT);
})();
//# sourceMappingURL=sketch.js.map
