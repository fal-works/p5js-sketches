/**
 * Random Walk Tiles.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/random-walk-tiles

 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function (p5ex, CCC) {
  "use strict";

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const { Numeric, Arrays, ArrayList, HSV, Random, Easing } = CCC;
  const { onSetup, onInstantiate } = p5ex;
  /**
   * Shared p5 instance.
   */
  let p;
  onInstantiate.push((p5Instance) => {
    p = p5Instance;
  });
  /**
   * Shared canvas instance.
   */
  let canvas;
  /**
   * Alias for `p.drawingContext`.
   */
  let context;
  onSetup.push(() => {
    canvas = p5ex.canvas;
    context = p.drawingContext;
  });

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /** The id of the HTML element to which the canvas should belong. */
  const HTML_ELEMENT_ID = "RandomWalkTiles";
  /** The logical height of the canvas. */
  const LOGICAL_CANVAS_HEIGHT = 1080;

  const size = 36;
  const drawSize = 28;
  const radius = 4;
  const easeAlpha = Easing.concatenate(
    (v) => Numeric.square(v),
    (v) => 1 - Numeric.cube(v),
    0.15
  );
  const create = (x, y, hue) => {
    return {
      x,
      y,
      hue,
      rgb: HSV.toRGB([
        (hue + Random.Curved.signed(Numeric.cube, 150) + 360) % 360,
        0.8,
        0.98,
      ]).map((v) => 255 * v),
      progress: 0,
      progressRate: 0.01,
    };
  };
  const update = (tile) => {
    const nextProgress = tile.progress + tile.progressRate;
    if (nextProgress >= 1) return true;
    else {
      tile.progress = nextProgress;
      return false;
    }
  };
  const draw = (tile) => {
    const { rgb } = tile;
    const alpha = 192 * easeAlpha(tile.progress);
    const color = p.color(rgb[0], rgb[1], rgb[2], alpha);
    p.fill(color);
    context.shadowColor = `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${
      0.2 * alpha
    })`;
    p.rect(tile.x, tile.y, drawSize, drawSize, radius);
  };

  const list = ArrayList.create(256);
  const grid = [];
  const add = (tile) => {
    const x = Math.floor(tile.x / size);
    const y = Math.floor(tile.y / size);
    if (grid[x] == undefined) grid[x] = [];
    const existingTile = grid[x][y];
    if (existingTile != undefined) existingTile.progressRate = 0.1;
    ArrayList.add(list, tile);
    grid[x][y] = tile;
  };
  const update$1 = () => ArrayList.removeSwapAll(list, update);
  const draw$1 = () => ArrayList.loop(list, draw);

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  let lastTile;
  const reset = () => {
    p.background(252);
    drawBackground = p5ex.storePixels();
  };
  const initialize = () => {
    reset();
    p.noStroke();
    p.rectMode(p.CENTER);
    p.blendMode(p.DARKEST);
    context.shadowOffsetX = 6;
    context.shadowOffsetY = 6;
    context.shadowBlur = 16;
    const canvasSize = canvas.logicalSize;
    const x = 0.5 * canvasSize.width;
    const y = 0.5 * canvasSize.height;
    lastTile = create(x, y, Random.value(360));
  };
  const addNewTile = () => {
    let x = 0;
    let y = 0;
    let horizontal, vertical;
    const { width, height } = canvas.logicalSize;
    const minX = 0.1 * width;
    const maxX = 0.9 * width;
    const minY = 0.1 * height;
    const maxY = 0.9 * height;
    let searchingNextPosition = true;
    while (searchingNextPosition) {
      switch (Random.Integer.value(4)) {
        default:
        case 0:
          horizontal = -1;
          vertical = 0;
          break;
        case 1:
          horizontal = 0;
          vertical = -1;
          break;
        case 2:
          horizontal = 1;
          vertical = 0;
          break;
        case 3:
          horizontal = 0;
          vertical = 1;
          break;
      }
      x = lastTile.x + horizontal * size;
      y = lastTile.y + vertical * size;
      if (x >= minX && x < maxX && y >= minY && y < maxY)
        searchingNextPosition = false;
    }
    const hue = (lastTile.hue + 2) % 360;
    const nextTile = create(x, y, hue);
    add(nextTile);
    lastTile = nextTile;
  };
  const updateSketch = () => {
    update$1();
    for (let i = 0; i < 2; i += 1) addNewTile();
  };
  const drawSketch = () => {
    draw$1();
  };
  const draw$2 = () => {
    updateSketch();
    drawBackground();
    canvas.drawScaled(drawSketch);
  };
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        p5ex.pauseOrResume();
        break;
      case "g":
        p.save("image.png");
        break;
      case "r":
        reset();
        break;
    }
    return false;
  };
  const p5Methods = {
    draw: draw$2,
    keyTyped,
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  p5ex.startSketch({
    htmlElement: HTML_ELEMENT_ID,
    logicalCanvasHeight: LOGICAL_CANVAS_HEIGHT,
    initialize: initialize,
    windowResized: () => canvas.resizeIfNeeded(),
    onCanvasResized: reset,
    p5Methods: p5Methods,
  });
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
