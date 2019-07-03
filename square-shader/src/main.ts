/**
 * ---- Main sketch ----------------------------------------------------------
 */

import { getElementOrBody, getElementSize } from "./common/environment";

const HTML_ELEMENT = getElementOrBody("ShaderSquare");
const PATH_CANDIDATES = [
  "",
  "../assets/",
  "https://fal-works.github.io/p5js-sketches/square-shader/assets/"
];
const GLSL_DIRECTORY_PATH = PATH_CANDIDATES[2];

const sketch = (p: p5): void => {
  // ---- variables
  let shaderObject: p5.Shader;
  let unitLength: number;
  let squarePosition: p5.Vector;

  // ---- functions
  const createOpaqueColorData = (c: p5.Color): number[] => [
    p.red(c) / 255,
    p.green(c) / 255,
    p.blue(c) / 255
  ];

  const createCenteredRectangleData = (
    centerX: number,
    centerY: number,
    width: number,
    height: number
  ): number[] => {
    const x = centerX - 0.5 * width;
    const y = centerY - 0.5 * height;

    return [x, y, x + width, y + height];
  };

  function setupShader(): void {
    p.shader(shaderObject);
    shaderObject.setUniform("resolution", [p.width, p.height]);
    shaderObject.setUniform(
      "squareColor",
      createOpaqueColorData(p.color(40, 40, 48))
    );
  }

  // ---- setup & draw etc.
  p.preload = () => {
    shaderObject = p.loadShader(
      GLSL_DIRECTORY_PATH + "base.vert",
      GLSL_DIRECTORY_PATH + "square.frag"
    );
  };

  p.setup = () => {
    const canvasSize = getElementSize(HTML_ELEMENT);
    const shortSideLength = Math.min(canvasSize.width, canvasSize.height);
    p.createCanvas(shortSideLength, shortSideLength, p.WEBGL);

    unitLength = shortSideLength * 0.01;
    squarePosition = p.createVector(0.5 * p.width, 0.5 * p.height);

    setupShader();
  };

  p.draw = () => {
    const innerSquareSize =
      40 * (1 + 0.1 * Math.sin(p.frameCount * 0.05)) * unitLength;

    shaderObject.setUniform(
      "innerSquare",
      createCenteredRectangleData(
        squarePosition.x,
        squarePosition.y,
        innerSquareSize,
        innerSquareSize
      )
    );

    const outerSquareSize = innerSquareSize + 5 * unitLength;

    shaderObject.setUniform(
      "outerSquare",
      createCenteredRectangleData(
        squarePosition.x,
        squarePosition.y,
        outerSquareSize,
        outerSquareSize
      )
    );

    p.rect(0, 0, 1, 1); // Seems to be necessary but no idea what this is

    // if (p.frameCount % 60 === 0) console.log(p.frameRate().toFixed(1) + " fps");
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();
    if (p.key === "s") p.save("image.png");
  };
};

new p5(sketch, HTML_ELEMENT);
