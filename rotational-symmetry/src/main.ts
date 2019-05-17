/**
 * ------------------------------------------------------------------------
 *  Main sketch
 * ------------------------------------------------------------------------
 */

import { getElementOrBody } from "./common/environment";
import * as random from "./common/random";
import { loop, flatNaive } from "./common/array";

import { createScaledCanvas, ScaledCanvas } from "./p5util/canvas";
import { createApplyColor, ApplyColorFunction } from "./p5util/color";
import { createPixels } from "./p5util/drawing";
import {
  drawTranslated,
  drawTranslatedAndRotated,
  drawScaled
} from "./p5util/transform";

import { createRandomTextureGraphics } from "./functions";

const HTML_ELEMENT = getElementOrBody("RotationalSymmetry");

const colorStringList = ["#C7243A", "#2266AF", "#009250", "#EDAD0B"];

interface RotationallySymmetricShape {
  draw(size: number): void;
  maxFoldingNumber: number;
}

interface ShapeGroup {
  shape: RotationallySymmetricShape;
  count: number;
  shapeSize: number;
  radius: number;
  revolution: number;
  revolutionVelocity: number;
  applyColor: ApplyColorFunction;
  rotationFactor: number | null;
}

interface Icon {
  x: number;
  y: number;
  shapeGroupList: ShapeGroup[];
}

const sketch = (p: p5): void => {
  // ---- variables
  let scaledCanvas: ScaledCanvas;
  let backgroundPixels: number[];
  let icons: Icon[];
  let shapeCandidates: RotationallySymmetricShape[];
  let applyColorFunctionCandidates: ApplyColorFunction[];

  // ---- drawing functions
  function drawShapeGroup(shapeGroup: ShapeGroup): void {
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

  function drawIcon(icon: Icon): void {
    drawTranslated(
      p,
      () => loop(icon.shapeGroupList, drawShapeGroup),
      icon.x,
      icon.y
    );
  }

  // ---- primitive shapes drawing functions
  function drawSquare(size: number): void {
    p.rect(0, 0, size, size, 0.05 * size);
  }

  const ONE_THIRD = 1 / 3;
  const TWO_THIRDS = 2 / 3;
  const ROOT_THREE = p.sqrt(3);
  const ONE_OVER_ROOT_THREE = 1 / ROOT_THREE;

  function drawRegularTriangle(size: number): void {
    const sz = 1.2 * size;
    const leftX = -ONE_THIRD * sz;
    const rightX = TWO_THIRDS * sz;
    const bottomY = ONE_OVER_ROOT_THREE * sz;
    p.triangle(rightX, 0, leftX, -bottomY, leftX, bottomY);
  }

  function drawCircle(size: number): void {
    p.ellipse(0, 0, size, size);
  }

  function drawEllipse(size: number): void {
    p.ellipse(0, 0, 0.9 * size, 1.3 * size);
  }

  function drawRhombus(size: number): void {
    p.quad(0.9 * size, 0, 0, 0.6 * size, -0.9 * size, 0, 0, -0.6 * size);
  }

  function drawDrop(size: number): void {
    p.beginShape();
    p.vertex(0.8 * size, 0);
    p.vertex(0, 0.5 * size);
    p.curveVertex(-0.4 * size, 0);
    p.vertex(0, -0.5 * size);
    p.endShape(p.CLOSE);
  }

  // ---- builder functions
  function createShapeGroup(
    shapeCandidates: RotationallySymmetricShape[],
    count: number,
    radius: number,
    revolutionVelocityFactor: number,
    applyColorFunctionStack: ApplyColorFunction[]
  ): ShapeGroup {
    const pickedShape = random.fromArray(shapeCandidates);
    const poppedApplyColorFunction = applyColorFunctionStack.pop();
    if (!poppedApplyColorFunction) throw new Error("No colors in stack.");

    let determinedRotationFactor: number | null;
    switch (pickedShape.maxFoldingNumber) {
      case 1:
        determinedRotationFactor = 0;
        break;
      case 4:
        determinedRotationFactor = random.fromArray([-2, -1, 0, 1, 2]);
        break;
      case Infinity:
        determinedRotationFactor = null;
        break;
      default:
        determinedRotationFactor = random.fromArray([-2, 0, 2]);
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
    x: number,
    y: number,
    shapeCandidates: RotationallySymmetricShape[],
    shapeColorCandidates: ApplyColorFunction[],
    invertedRevolution: boolean = false
  ): Icon {
    const applyColorFunctionStack: ApplyColorFunction[] = p.shuffle(
      shapeColorCandidates,
      false
    );
    const revolutionVelocityFactor = invertedRevolution ? -1 : 1;

    const newShapeGroupList: ShapeGroup[] = [
      createShapeGroup(
        shapeCandidates,
        random.intBetween(3, 6),
        35,
        -revolutionVelocityFactor,
        applyColorFunctionStack
      ),
      createShapeGroup(
        shapeCandidates,
        random.intBetween(4, 10),
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

  function createRotatedShape(
    shape: RotationallySymmetricShape
  ): RotationallySymmetricShape | null {
    if (shape.maxFoldingNumber === Infinity) return null;

    const rotationAngle = 0.5 * (p.TWO_PI / shape.maxFoldingNumber);

    return {
      draw: (size: number) => {
        p.rotate(rotationAngle);
        shape.draw(size);
        p.rotate(-rotationAngle);
      },
      maxFoldingNumber: shape.maxFoldingNumber
    };
  }

  function createShiftedShape(
    shape: RotationallySymmetricShape,
    shiftFactor: number
  ): RotationallySymmetricShape {
    return {
      draw: (size: number) => {
        const displacement = shiftFactor * size;
        p.translate(displacement, 0);
        shape.draw(size);
        p.translate(-displacement, 0);
      },
      maxFoldingNumber: 1 // assuming that the base shape was centered at the origin
    };
  }

  function createCompositeShape(
    shape: RotationallySymmetricShape,
    otherShape: RotationallySymmetricShape,
    maxFoldingNumber: number
  ): RotationallySymmetricShape {
    return {
      draw: (size: number) => {
        shape.draw(size);
        otherShape.draw(size);
      },
      maxFoldingNumber: maxFoldingNumber
    };
  }

  function createRotatedCompositeShape(baseShape: RotationallySymmetricShape) {
    const rotatedShape = createRotatedShape(baseShape);
    if (!rotatedShape) throw new Error("Could not create rotated shape.");

    return createCompositeShape(
      baseShape,
      rotatedShape,
      baseShape.maxFoldingNumber * 2
    );
  }

  function createShiftedCompositeShape(baseShape: RotationallySymmetricShape) {
    const basemaxFoldingNumber = baseShape.maxFoldingNumber;
    let newmaxFoldingNumber: number;
    if (basemaxFoldingNumber === Infinity) newmaxFoldingNumber = 2;
    else if (basemaxFoldingNumber % 2 === 0) newmaxFoldingNumber = 2;
    else newmaxFoldingNumber = 1;

    return createCompositeShape(
      createShiftedShape(baseShape, -0.2),
      createShiftedShape(baseShape, 0.2),
      newmaxFoldingNumber
    );
  }

  function createShapePatterns(
    baseShape: RotationallySymmetricShape
  ): RotationallySymmetricShape[] {
    const array: RotationallySymmetricShape[] = [baseShape];

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

  // ---- initialize & reset
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
      .map((colorString: string) => p.color(colorString))
      // .map((color: p5.Color) => alphaColor(p, color, 160))
      .map((color: p5.Color) =>
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

  // ---- core drawing process
  function drawSketch(): void {
    loop(icons, drawIcon);
  }

  // ---- setup & draw etc.
  p.preload = () => {};

  p.setup = () => {
    const nonScaledSize = { width: 640, height: 640 };
    scaledCanvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
    backgroundPixels = createPixels(p, (p: p5) => {
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
    // if (p.key === "s") p.save("image.png");
  };
};

new p5(sketch, HTML_ELEMENT);
