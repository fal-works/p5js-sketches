/**
 * SquareShader.
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
   * ---- Main sketch ----------------------------------------------------------
   */
  const HTML_ELEMENT = getElementOrBody("ShaderSquare");
  const PATH_CANDIDATES = [
    "",
    "../assets/",
    "https://fal-works.github.io/p5js-sketches/square-shader/assets/"
  ];
  const GLSL_DIRECTORY_PATH = PATH_CANDIDATES[2];
  const sketch = p => {
    let shaderObject;
    let unitLength;
    let squarePosition;

    const createOpaqueColorData = c => [
      p.red(c) / 255,
      p.green(c) / 255,
      p.blue(c) / 255
    ];
    const createCenteredRectangleData = (centerX, centerY, width, height) => {
      const x = centerX - 0.5 * width;
      const y = centerY - 0.5 * height;
      return [x, y, x + width, y + height];
    };
    function setupShader() {
      p.shader(shaderObject);
      shaderObject.setUniform("resolution", [p.width, p.height]);
      shaderObject.setUniform(
        "squareColor",
        createOpaqueColorData(p.color(40, 40, 48))
      );
    }

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
      p.rect(0, 0, 1, 1);
    };
    p.keyTyped = () => {
      if (p.key === "p") p.noLoop();
      if (p.key === "s") p.save("image.png");
    };
  };
  new p5(sketch, HTML_ELEMENT);
})();
//# sourceMappingURL=sketch.js.map
