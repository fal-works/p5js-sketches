import * as p5ex from "p5ex";
import { createRandomTextureGraphics, loop } from "./functions";

const SKETCH_NAME = "RotationalSymmetry";

interface RotationallySymmetricShape {
  draw(size: number): void;
  foldingNumber: number;
}

interface ShapeGroup {
  shape: RotationallySymmetricShape;
  count: number;
  shapeSize: number;
  radius: number;
  revolution: number;
  revolutionVelocity: number;
  shapeColor: p5ex.ShapeColor;
  rotationFactor: number;
}

interface Icon {
  x: number;
  y: number;
  shapeGroupList: ShapeGroup[];
}

const sketch = (p: p5ex.p5exClass): void => {
  // ---- constants

  // ---- variables
  let backgroundPixels: number[];
  let icons: p5ex.LoopableArray<Icon>;

  // ---- functions
  function drawShapeGroup(shapeGroup: ShapeGroup): void {
    shapeGroup.shapeColor.applyColor();

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

  function drawIcon(icon: Icon): void {
    const x = icon.x;
    const y = icon.y;
    p.translate(x, y);
    loop(icon.shapeGroupList, drawShapeGroup);
    p.translate(-x, -y);
  }

  function drawSquare(size: number): void {
    p.rect(0, 0, size, size, 0.05 * size);
  }

  const ROOT_THREE = p.sqrt(3);
  const ONE_THIRD = 1 / 3;
  const TWO_THIRDS = 2 / 3;
  const ONE_OVER_ROOT_THREE = 1 / ROOT_THREE;
  const TRIANGLE_SIZE_FACTOR = 1.2;

  function drawRegularTriangle(size: number): void {
    const sz = TRIANGLE_SIZE_FACTOR * size;
    p.triangle(
      TWO_THIRDS * sz,
      0,
      -ONE_THIRD * sz,
      -ONE_OVER_ROOT_THREE * sz,
      -ONE_THIRD * sz,
      ONE_OVER_ROOT_THREE * sz
    );
  }

  function drawCircle(size: number): void {
    p.ellipse(0, 0, size, size);
  }

  function drawEllipse(size: number): void {
    p.ellipse(0, 0, 0.9 * size, 1.3 * size);
  }

  function drawDiamand(size: number): void {
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

  function createShapeGroup(
    shapeCandidates: RotationallySymmetricShape[],
    count: number,
    radius: number,
    revolutionVelocityFactor: number,
    colorStack: p5ex.ShapeColor[]
  ): ShapeGroup {
    const pickedShape = p.random(shapeCandidates);
    const poppedShapeColor = colorStack.pop();
    if (!poppedShapeColor) throw "createShapeGroup - No colors in stack.";

    let determinedRotationFactor: number;
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
      shapeColor: poppedShapeColor,
      rotationFactor: determinedRotationFactor
    };
  }

  function createIcon(
    x: number,
    y: number,
    shapeCandidates: RotationallySymmetricShape[],
    shapeColorCandidates: p5ex.ShapeColor[],
    invertedRevolution: boolean = false
  ): Icon {
    const colorStack: p5ex.ShapeColor[] = p.shuffle(
      shapeColorCandidates,
      false
    );
    const revolutionVelocityFactor = invertedRevolution ? -1 : 1;

    const newShapeGroupList: ShapeGroup[] = [
      createShapeGroup(
        shapeCandidates,
        p5ex.randomIntBetween(3, 6),
        35,
        -revolutionVelocityFactor,
        colorStack
      ),
      createShapeGroup(
        shapeCandidates,
        p5ex.randomIntBetween(4, 10),
        75,
        revolutionVelocityFactor,
        colorStack
      )
    ];

    return {
      x: x,
      y: y,
      shapeGroupList: newShapeGroupList
    };
  }

  function flat<T>(arrays: T[][]): T[] {
    return [].concat.apply([], arrays);
  }

  function createRotatedShape(
    shape: RotationallySymmetricShape
  ): RotationallySymmetricShape | null {
    if (shape.foldingNumber === Infinity) return null;

    const rotationAngle = 0.5 * (p.TWO_PI / shape.foldingNumber);

    return {
      draw: (size: number) => {
        p.rotate(rotationAngle);
        shape.draw(size);
        p.rotate(-rotationAngle);
      },
      foldingNumber: shape.foldingNumber
    };
  }

  function createShifteShape(
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
      foldingNumber: 1
    };
  }

  function createCompositeShape(
    shape: RotationallySymmetricShape,
    otherShape: RotationallySymmetricShape,
    foldingNumber: number
  ): RotationallySymmetricShape {
    return {
      draw: (size: number) => {
        shape.draw(size);
        otherShape.draw(size);
      },
      foldingNumber: foldingNumber
    };
  }

  function createRotatedCompositeShape(baseShape: RotationallySymmetricShape) {
    const rotatedShape = createRotatedShape(baseShape);
    if (!rotatedShape) throw "createRotatedCompositeShape() - Invalid input.";

    return createCompositeShape(
      baseShape,
      rotatedShape,
      baseShape.foldingNumber * 2
    );
  }

  function createShiftedCompositeShape(baseShape: RotationallySymmetricShape) {
    const baseFoldingNumber = baseShape.foldingNumber;
    let newFoldingNumber: number;
    if (baseFoldingNumber === Infinity) newFoldingNumber = 2;
    else if (baseFoldingNumber % 2 === 0) newFoldingNumber = 2;
    else newFoldingNumber = 1;

    return createCompositeShape(
      createShifteShape(baseShape, -0.2),
      createShifteShape(baseShape, 0.2),
      newFoldingNumber
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

    if (shiftedCompositeShape.foldingNumber === 2) {
      const rotatedShiftedCompositeShape = createRotatedShape(
        shiftedCompositeShape
      );
      if (rotatedShiftedCompositeShape)
        array.push(rotatedShiftedCompositeShape);
    }

    return array;
  }

  function initialize() {
    const shapeCandidates: RotationallySymmetricShape[] = flat(
      [
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
      ].map(createShapePatterns)
    );

    const shapeColorCandidates: p5ex.ShapeColor[] = [
      "#C7243A",
      "#2266AF",
      "#009250",
      "#EDAD0B"
    ]
      .map((colorString: string) => p.color(colorString))
      // .map((color: p5.Color) => alphaColor(p, color, 160))
      .map((color: p5.Color) => new p5ex.ShapeColor(p, color, undefined));

    icons = new p5ex.LoopableArray<Icon>(9);

    let invertedRevolution = false;

    const positionInterval = p.nonScaledWidth / 3;
    for (let row = 0; row < 3; row += 1) {
      const y = (row + 0.5) * positionInterval;
      for (let column = 0; column < 3; column += 1) {
        const x = (column + 0.5) * positionInterval;
        const newIcon = createIcon(
          x,
          y,
          shapeCandidates,
          shapeColorCandidates,
          invertedRevolution
        );
        icons.push(newIcon);
        invertedRevolution = !invertedRevolution;
      }
    }
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);
    const texture: p5.Image = createRandomTextureGraphics(
      p,
      p.nonScaledWidth,
      p.nonScaledHeight,
      0.05
    ) as any;
    p.scalableCanvas.scale();
    p.image(texture, 0, 0);
    p.scalableCanvas.cancelScale();
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

    p.scalableCanvas.scale();
    icons.loop(drawIcon);
    p.scalableCanvas.cancelScale();
  };

  p.mousePressed = () => {
    initialize();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    // if (p.key === "s") p.save("image.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
