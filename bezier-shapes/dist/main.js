/**
 * Bezier Shapes.
 * @copyright 2019 FAL
 * @version 0.1.0
 */

(function(creativeCodingCore, p5Extension) {
  "use strict";

  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "BezierShapes";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = creativeCodingCore.HtmlUtility.getElementOrBody(
    HTML_ELEMENT_ID
  );
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: 800,
    height: 800
  };

  // ---- variables | functions ----
  let drawBackground;
  const drawList = [];
  let drawControlLines = false;
  // ---- reset & initialize ----
  const reset = () => {
    drawControlLines = !drawControlLines;
    if (!drawControlLines) return;
    drawList.length = 0;
    const gridSize = creativeCodingCore.Random.integerBetween(2, 5);
    const { width, height } = p5Extension.canvas.logicalSize;
    const xInterval = width / (gridSize + 1);
    const yInterval = height / (gridSize + 1);
    const vertexCount = creativeCodingCore.Random.integerBetween(4, 7);
    const angleInterval = creativeCodingCore.Math.TWO_PI / vertexCount;
    const randomAngleOffset = () =>
      creativeCodingCore.Random.between(-0.3, 0.3) * angleInterval;
    const randomDistanceFactor = () =>
      creativeCodingCore.Random.between(0.7, 1.3);
    const randomLength = () => creativeCodingCore.Random.between(20, 100);
    const baseVertexDistance = (800 / (gridSize + 1)) * 0.4;
    const createVertex = angle => {
      return {
        point: creativeCodingCore.Vector2D.fromPolar(
          randomDistanceFactor() * baseVertexDistance,
          randomAngleOffset() + angle
        ),
        controlLine: {
          length: randomLength(),
          angle: randomAngleOffset() + angle + creativeCodingCore.Math.HALF_PI
        }
      };
    };
    const createDrawShape = () => {
      const vertices = creativeCodingCore.Angle.createArray(vertexCount).map(
        createVertex
      );
      const closedVertices = vertices.concat(vertices[0]);
      const curve = creativeCodingCore.Bezier.createCurve(closedVertices);
      return () => {
        p5Extension.p.noStroke();
        p5Extension.p.fill(48);
        p5Extension.p.beginShape();
        p5Extension.drawBezierCurve(curve);
        p5Extension.p.endShape(p5Extension.p.CLOSE);
        if (drawControlLines) {
          p5Extension.p.stroke(224, 0, 64);
          p5Extension.drawBezierControlLines(vertices);
        }
      };
    };
    const createDrawShapeTranslated = (column, row) => {
      const drawShape = createDrawShape();
      const x = (column + 1) * xInterval;
      const y = (row + 1) * yInterval;
      return () => p5Extension.drawTranslated(drawShape, x, y);
    };
    for (let column = 0; column < gridSize; column += 1) {
      for (let row = 0; row < gridSize; row += 1) {
        drawList.push(createDrawShapeTranslated(column, row));
      }
    }
  };
  const initialize = () => {
    const backgroundPixels = p5Extension.createPixels(() => {
      p5Extension.p.background(248);
    });
    drawBackground = () => p5Extension.replaceCanvasPixels(backgroundPixels);
    reset();
    p5Extension.p.noLoop();
  };
  // ---- draw ----
  const drawSketch = () => {
    for (const draw of drawList) draw();
  };
  const draw = () => {
    drawBackground();
    p5Extension.canvas.drawScaled(drawSketch);
  };
  // ---- UI ----
  const mousePressed = () => {
    reset();
    p5Extension.p.redraw();
  };
  const keyTyped = () => {
    switch (p5Extension.p.key) {
      // case "p":
      //   pauseOrResume();
      //   break;
      case "s":
        p5Extension.p.save("image.png");
        break;
      case "r":
        reset();
        break;
    }
  };
  // ---- start sketch ----
  const setP5Methods = p => {
    p.draw = draw;
    p.mousePressed = mousePressed;
    p.keyTyped = keyTyped;
  };
  p5Extension.startSketch({
    htmlElement: HTML_ELEMENT,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize,
    setP5Methods
  });
})(CreativeCodingCore, p5ex);
//# sourceMappingURL=main.js.map
