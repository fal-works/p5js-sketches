/**
 * Rotational Symmetry.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.1
 * @license CC-BY-SA-3.0
 */

(function () {
  'use strict';

  /**
   * Returns random integer from 0 up to (but not including) the max number.
   */
  function randomInt(maxInt) {
      return Math.floor(Math.random() * maxInt);
  }
  /**
   * Returns random integer from the min number up to (but not including) the max number.
   */
  function randomIntBetween(minInt, maxInt) {
      return minInt + randomInt(maxInt - minInt);
  }
  function loop(array, callback) {
      const len = array.length;
      for (let i = 0; i < len; i += 1)
          callback(array[i]);
  }
  function getHTMLElement(id) {
      return document.getElementById(id) || document.body;
  }
  var RegionFittingOption;
  (function (RegionFittingOption) {
      RegionFittingOption[RegionFittingOption["FIT_SIZE"] = 0] = "FIT_SIZE";
      RegionFittingOption[RegionFittingOption["FIT_WIDTH"] = 1] = "FIT_WIDTH";
      RegionFittingOption[RegionFittingOption["FIT_HEIGHT"] = 2] = "FIT_HEIGHT";
  })(RegionFittingOption || (RegionFittingOption = {}));
  // -----------------------------------------------------
  function getHTMLElementRegionSize(node) {
      if (node === document.body)
          return {
              width: window.innerWidth,
              height: window.innerHeight
          };
      const boundingClientRect = node.getBoundingClientRect();
      return {
          width: boundingClientRect.width,
          height: boundingClientRect.height
      };
  }
  function calculateRegionFittingScaleFactor(nonScaledRegionSize, targetRegionSize, fittingOption) {
      switch (fittingOption) {
          default:
          case RegionFittingOption.FIT_SIZE:
              const scaleFactorCandidate = targetRegionSize.width / nonScaledRegionSize.width;
              const nonScaledHeight = nonScaledRegionSize.height;
              if (scaleFactorCandidate * nonScaledHeight < targetRegionSize.height) {
                  return scaleFactorCandidate;
              }
              else {
                  return targetRegionSize.height / nonScaledHeight;
              }
          case RegionFittingOption.FIT_WIDTH:
              return targetRegionSize.width / nonScaledRegionSize.width;
          case RegionFittingOption.FIT_HEIGHT:
              return targetRegionSize.height / nonScaledRegionSize.height;
      }
  }
  function createScaledCanvas(p, node, nonScaledRegion, fittingOption, renderer) {
      const maxCanvasRegion = getHTMLElementRegionSize(node);
      const scaleFactor = calculateRegionFittingScaleFactor(nonScaledRegion, maxCanvasRegion, fittingOption);
      const canvas = p.createCanvas(scaleFactor * nonScaledRegion.width, scaleFactor * nonScaledRegion.height, renderer);
      return {
          p5Canvas: canvas,
          scaleFactor: scaleFactor
      };
  }
  /**
   * Set color to the specified pixel.
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
  function createRandomTextureGraphics(p, w, h, factor) {
      const g = p.createGraphics(w, h);
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
  function createApplyColor(p, shapeColor) {
      const strokeColor = shapeColor.strokeColor;
      const fillColor = shapeColor.fillColor;
      if (strokeColor && fillColor) {
          return () => {
              p.stroke(strokeColor);
              p.fill(fillColor);
          };
      }
      if (strokeColor) {
          if (fillColor === null)
              return () => {
                  p.stroke(strokeColor);
                  p.noFill();
              };
          else
              return () => {
                  p.stroke(strokeColor);
              };
      }
      if (fillColor) {
          if (strokeColor === null)
              return () => {
                  p.noStroke();
                  p.fill(fillColor);
              };
          else
              return () => p.fill(fillColor);
      }
      if (strokeColor === null) {
          if (fillColor === null) {
              return () => {
                  p.noStroke();
                  p.noFill();
              };
          }
          else
              return () => p.noStroke();
      }
      else {
          if (fillColor === null)
              return () => p.noFill();
      }
      return () => { };
  }

  const HTML_ELEMENT = getHTMLElement("RotationalSymmetry");
  const sketch = (p) => {
      // ---- variables
      let nonScaledWidth;
      let nonScaledHeight;
      let scaledCanvas;
      let backgroundPixels;
      let icons;
      // ---- functions
      function drawShapeGroup(shapeGroup) {
          shapeGroup.applyColor();
          const revolution = shapeGroup.revolution;
          const count = shapeGroup.count;
          const shape = shapeGroup.shape;
          const radius = shapeGroup.radius;
          const shapeUnitSize = shapeGroup.shapeSize;
          const rotationFactor = shapeGroup.rotationFactor;
          let angle = revolution;
          const angleInterval = p.TWO_PI / count;
          for (let i = 0; i < count; i += 1) {
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);
              const rotationAngle = rotationFactor * angle;
              p.translate(x, y);
              p.rotate(rotationAngle);
              shape.draw(shapeUnitSize);
              p.rotate(-rotationAngle);
              p.translate(-x, -y);
              angle += angleInterval;
          }
          shapeGroup.revolution = revolution + shapeGroup.revolutionVelocity;
      }
      function drawIcon(icon) {
          const x = icon.x;
          const y = icon.y;
          p.translate(x, y);
          loop(icon.shapeGroupList, drawShapeGroup);
          p.translate(-x, -y);
      }
      function drawSquare(size) {
          p.rect(0, 0, size, size, 0.05 * size);
      }
      const ROOT_THREE = p.sqrt(3);
      const ONE_THIRD = 1 / 3;
      const TWO_THIRDS = 2 / 3;
      const ONE_OVER_ROOT_THREE = 1 / ROOT_THREE;
      const TRIANGLE_SIZE_FACTOR = 1.2;
      function drawRegularTriangle(size) {
          const sz = TRIANGLE_SIZE_FACTOR * size;
          p.triangle(TWO_THIRDS * sz, 0, -ONE_THIRD * sz, -ONE_OVER_ROOT_THREE * sz, -ONE_THIRD * sz, ONE_OVER_ROOT_THREE * sz);
      }
      function drawCircle(size) {
          p.ellipse(0, 0, size, size);
      }
      function drawEllipse(size) {
          p.ellipse(0, 0, 0.9 * size, 1.3 * size);
      }
      function drawDiamand(size) {
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
      function createShapeGroup(shapeCandidates, count, radius, revolutionVelocityFactor, applyColorFunctionStack) {
          const pickedShape = p.random(shapeCandidates);
          const poppedApplyColorFunction = applyColorFunctionStack.pop();
          if (!poppedApplyColorFunction)
              throw "createShapeGroup - No colors in stack.";
          let determinedRotationFactor;
          switch (pickedShape.foldingNumber) {
              case 1:
                  determinedRotationFactor = 1;
                  break;
              case 4:
                  determinedRotationFactor = p.random([-1, 0, 1]);
                  break;
              case Infinity:
                  determinedRotationFactor = 0;
                  break;
              default:
                  determinedRotationFactor = p.random([-1, 1]);
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
      function createIcon(x, y, shapeCandidates, shapeColorCandidates, invertedRevolution = false) {
          const applyColorFunctionStack = p.shuffle(shapeColorCandidates, false);
          const revolutionVelocityFactor = invertedRevolution ? -1 : 1;
          const newShapeGroupList = [
              createShapeGroup(shapeCandidates, randomIntBetween(3, 6), 35, -revolutionVelocityFactor, applyColorFunctionStack),
              createShapeGroup(shapeCandidates, randomIntBetween(4, 10), 75, revolutionVelocityFactor, applyColorFunctionStack)
          ];
          return {
              x: x,
              y: y,
              shapeGroupList: newShapeGroupList
          };
      }
      function flat(arrays) {
          return [].concat.apply([], arrays);
      }
      function createRotatedShape(shape) {
          if (shape.foldingNumber === Infinity)
              return null;
          const rotationAngle = 0.5 * (p.TWO_PI / shape.foldingNumber);
          return {
              draw: (size) => {
                  p.rotate(rotationAngle);
                  shape.draw(size);
                  p.rotate(-rotationAngle);
              },
              foldingNumber: shape.foldingNumber
          };
      }
      function createShiftedShape(shape, shiftFactor) {
          return {
              draw: (size) => {
                  const displacement = shiftFactor * size;
                  p.translate(displacement, 0);
                  shape.draw(size);
                  p.translate(-displacement, 0);
              },
              foldingNumber: 1
          };
      }
      function createCompositeShape(shape, otherShape, foldingNumber) {
          return {
              draw: (size) => {
                  shape.draw(size);
                  otherShape.draw(size);
              },
              foldingNumber: foldingNumber
          };
      }
      function createRotatedCompositeShape(baseShape) {
          const rotatedShape = createRotatedShape(baseShape);
          if (!rotatedShape)
              throw "createRotatedCompositeShape() - Invalid input.";
          return createCompositeShape(baseShape, rotatedShape, baseShape.foldingNumber * 2);
      }
      function createShiftedCompositeShape(baseShape) {
          const baseFoldingNumber = baseShape.foldingNumber;
          let newFoldingNumber;
          if (baseFoldingNumber === Infinity)
              newFoldingNumber = 2;
          else if (baseFoldingNumber % 2 === 0)
              newFoldingNumber = 2;
          else
              newFoldingNumber = 1;
          return createCompositeShape(createShiftedShape(baseShape, -0.2), createShiftedShape(baseShape, 0.2), newFoldingNumber);
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
          if (shiftedCompositeShape.foldingNumber === 2) {
              const rotatedShiftedCompositeShape = createRotatedShape(shiftedCompositeShape);
              if (rotatedShiftedCompositeShape)
                  array.push(rotatedShiftedCompositeShape);
          }
          return array;
      }
      function initialize() {
          const shapeCandidates = flat([
              {
                  draw: drawSquare,
                  foldingNumber: 4
              },
              {
                  draw: drawRegularTriangle,
                  foldingNumber: 3
              },
              {
                  draw: drawCircle,
                  foldingNumber: Infinity
              },
              {
                  draw: drawEllipse,
                  foldingNumber: 2
              },
              {
                  draw: drawDiamand,
                  foldingNumber: 2
              },
              {
                  draw: drawDrop,
                  foldingNumber: 1
              }
          ].map(createShapePatterns));
          const applyColorFunctionCandidates = [
              "#C7243A",
              "#2266AF",
              "#009250",
              "#EDAD0B"
          ]
              .map((colorString) => p.color(colorString))
              // .map((color: p5.Color) => alphaColor(p, color, 160))
              .map((color) => createApplyColor(p, { strokeColor: color, fillColor: undefined }));
          icons = [];
          let invertedRevolution = false;
          const positionInterval = nonScaledWidth / 3;
          for (let row = 0; row < 3; row += 1) {
              const y = (row + 0.5) * positionInterval;
              for (let column = 0; column < 3; column += 1) {
                  const x = (column + 0.5) * positionInterval;
                  const newIcon = createIcon(x, y, shapeCandidates, applyColorFunctionCandidates, invertedRevolution);
                  icons.push(newIcon);
                  invertedRevolution = !invertedRevolution;
              }
          }
      }
      // ---- Setup & Draw etc.
      p.preload = () => { };
      p.setup = () => {
          nonScaledWidth = 640;
          nonScaledHeight = 640;
          scaledCanvas = createScaledCanvas(p, HTML_ELEMENT, {
              width: 640,
              height: 640
          });
          const texture = createRandomTextureGraphics(p, nonScaledWidth, nonScaledHeight, 0.05);
          p.push();
          p.scale(scaledCanvas.scaleFactor);
          p.image(texture, 0, 0);
          p.pop();
          p.loadPixels();
          backgroundPixels = p.pixels;
          p.noFill();
          p.strokeWeight(2);
          p.rectMode(p.CENTER);
          initialize();
      };
      p.draw = () => {
          p.pixels = backgroundPixels;
          p.updatePixels();
          p.push();
          p.scale(scaledCanvas.scaleFactor);
          loop(icons, drawIcon);
          p.pop();
      };
      p.mousePressed = () => {
          initialize();
      };
      p.keyTyped = () => {
          if (p.key === "p")
              p.noLoop();
          // if (p.key === "s") p.save("image.png");
      };
  };
  new p5(sketch, HTML_ELEMENT);

}());
//# sourceMappingURL=sketch.js.map
