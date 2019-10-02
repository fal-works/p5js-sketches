import p5 from "p5";
import {
  Bezier,
  Vector2D,
  Angle,
  Random,
  Math as Math2
} from "@fal-works/creative-coding-core";
import {
  startSketch,
  p,
  canvas,
  createPixels,
  replaceCanvasPixels,
  drawBezierCurve,
  drawBezierControlLines,
  drawTranslated
} from "@fal-works/p5-extension";

import { HTML_ELEMENT, LOGICAL_CANVAS_SIZE } from "./settings";

// ---- variables | functions ----

let drawBackground: () => void;
const drawList: (() => void)[] = [];
let drawControlLines = false;

// ---- reset & initialize ----

const reset = (): void => {
  drawControlLines = !drawControlLines;
  if (!drawControlLines) return;

  drawList.length = 0;

  const gridSize = Random.integerBetween(2, 5);
  const { width, height } = canvas.logicalSize;
  const xInterval = width / (gridSize + 1);
  const yInterval = height / (gridSize + 1);

  const vertexCount = Random.integerBetween(4, 7);
  const angleInterval = Math2.TWO_PI / vertexCount;

  const randomAngleOffset = () => Random.between(-0.3, 0.3) * angleInterval;
  const randomDistanceFactor = () => Random.between(0.7, 1.3);
  const randomLength = () => Random.between(20, 100);
  const baseVertexDistance = (800 / (gridSize + 1)) * 0.4;

  const createVertex = (angle: number) => {
    return {
      point: Vector2D.fromPolar(
        randomDistanceFactor() * baseVertexDistance,
        randomAngleOffset() + angle
      ),
      controlLine: {
        length: randomLength(),
        angle: randomAngleOffset() + angle + Math2.HALF_PI
      }
    };
  };

  const createDrawShape = () => {
    const vertices = Angle.createArray(vertexCount).map(createVertex);
    const closedVertices = vertices.concat(vertices[0]);
    const curve = Bezier.createCurve(closedVertices);

    return () => {
      p.noStroke();
      p.fill(48);
      p.beginShape();
      drawBezierCurve(curve);
      p.endShape(p.CLOSE);

      if (drawControlLines) {
        p.stroke(224, 0, 64);
        drawBezierControlLines(vertices);
      }
    };
  };

  const createDrawShapeTranslated = (column: number, row: number) => {
    const drawShape = createDrawShape();

    return () =>
      drawTranslated(
        drawShape,
        (column + 1) * xInterval,
        (row + 1) * yInterval
      );
  };

  for (let column = 0; column < gridSize; column += 1) {
    for (let row = 0; row < gridSize; row += 1) {
      drawList.push(createDrawShapeTranslated(column, row));
    }
  }
};

const initialize = (): void => {
  const backgroundPixels = createPixels(() => {
    p.background(248);
  });
  drawBackground = () => replaceCanvasPixels(backgroundPixels);

  reset();

  p.noLoop();
};

// ---- draw ----

const drawSketch = (): void => {
  for (const draw of drawList) draw();
};

const draw = (): void => {
  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const mousePressed = () => {
  reset();
  p.redraw();
};

const keyTyped = (): void => {
  switch (p.key) {
    // case "p":
    //   pauseOrResume();
    //   break;
    case "s":
      p.save("image.png");
      break;
    case "r":
      reset();
      break;
  }
};

// ---- start sketch ----

const setP5Methods = (p: p5): void => {
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
