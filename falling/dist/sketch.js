/**
 * Falling.
 * Source code in TypeScript: https://github.com/fal-works/p5js-sketches/tree/master/falling

 * @copyright 2020 FAL
 * @version 0.1.0
 */

(function(p5ex, CCC) {
  "use strict";

  /**
   * ---- Common ----------------------------------------------------------------
   */
  const {
    ArrayList,
    Vector2D,
    SimpleDynamics,
    Random,
    Timer,
    Tween,
    Easing,
    Numeric: { cube }
  } = CCC;
  const { Noise, ShapeColor } = p5ex;
  /**
   * Shared p5 instance.
   */
  let p;
  p5ex.onSetup.push(p5Instance => {
    p = p5Instance;
  });
  /**
   * Shared canvas instance.
   */
  let canvas;
  p5ex.onSetup.push(() => {
    canvas = p5ex.canvas;
  });

  /**
   * ---- Settings --------------------------------------------------------------
   */
  /**
   * The id of the HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT_ID = "Falling";
  /**
   * The HTML element to which the canvas should belong.
   */
  const HTML_ELEMENT = CCC.HtmlUtility.getElementOrBody(HTML_ELEMENT_ID);
  /**
   * The logical size of the canvas.
   */
  const LOGICAL_CANVAS_SIZE = {
    width: HTML_ELEMENT.getBoundingClientRect().width,
    height: HTML_ELEMENT.getBoundingClientRect().height
  };

  /**
   * ---- Dot -------------------------------------------------------------------
   */
  const Dot = (() => {
    const maxSize = 20;
    const habitableZoneBottomY = LOGICAL_CANVAS_SIZE.height + maxSize;
    const shapeColor = ShapeColor.create(undefined, [32, 192], 255);
    const timerSet = Timer.Set.construct(1024);
    const dotSizeTweenParameters = {
      start: maxSize / 2,
      end: maxSize,
      easing: Easing.Out.createBack()
    };
    const create = (x, y) => {
      const dot = Object.assign(
        Object.assign({}, SimpleDynamics.createQuantity(x, y)),
        { alpha: 255, size: 0 }
      );
      timerSet.add(
        Tween.create(
          v => {
            dot.size = v;
          },
          30,
          dotSizeTweenParameters
        )
      );
      return dot;
    };
    const update = dot => {
      dot.fy = 0.05;
      SimpleDynamics.updateEuler(dot);
      dot.alpha -= 2;
      return dot.alpha <= 0 || dot.y >= habitableZoneBottomY;
    };
    const draw = dot => {
      ShapeColor.apply(shapeColor, dot.alpha);
      p.circle(dot.x, dot.y, dot.size);
    };
    return {
      timerSet,
      create,
      update,
      draw
    };
  })();

  /**
   * ---- Dots ------------------------------------------------------------------
   */
  const Dots = (() => {
    const list = ArrayList.create(1024);
    const update = () => {
      Dot.timerSet.step();
      ArrayList.removeShiftAll(list, Dot.update);
    };
    const draw = () => ArrayList.loop(list, Dot.draw);
    const add = (x, y) => ArrayList.add(list, Dot.create(x, y));
    return { update, draw, add };
  })();

  /**
   * ---- Grid ------------------------------------------------------------------
   */
  const Grid = (() => {
    const cellSize = 25;
    const columns = Math.floor(LOGICAL_CANVAS_SIZE.width / cellSize);
    const rows = Math.floor(LOGICAL_CANVAS_SIZE.height / cellSize);
    const createMove = (column, row) => ({
      column,
      row,
      nextMoves: []
    });
    const Left = createMove(-1, 0);
    const Up = createMove(0, -1);
    const Right = createMove(1, 0);
    const Down = createMove(0, 1);
    Left.nextMoves.push(Left, Up, Down);
    Up.nextMoves.push(Left, Up, Right);
    Right.nextMoves.push(Up, Right, Down);
    Down.nextMoves.push(Left, Right, Down);
    const Moves = [Left, Up, Right, Down];
    let currentColumn = Math.floor(columns / 2);
    let currentRow = Math.floor(rows / 2);
    let lastMove = createMove(0, 0);
    lastMove.nextMoves.push(...Moves);
    const reverseMove = move => {
      switch (move) {
        default:
        case Left:
          return Right;
        case Up:
          return Down;
        case Right:
          return Left;
        case Down:
          return Up;
      }
    };
    const getNextMove = () => Random.Arrays.get(lastMove.nextMoves);
    const applyMove = move => {
      const nextColumn = currentColumn + move.column;
      if (nextColumn < 0 || nextColumn >= columns) {
        lastMove = reverseMove(lastMove);
        return false;
      }
      const nextRow = currentRow + move.row;
      if (nextRow < 0 || nextRow >= rows) {
        lastMove = reverseMove(lastMove);
        return false;
      }
      currentColumn = nextColumn;
      currentRow = nextRow;
      return true;
    };
    const getPosition = (column, row) =>
      Vector2D.create((0.5 + column) * cellSize, (0.5 + row) * cellSize);
    const nextPosition = () => {
      let nextMove = getNextMove();
      while (!applyMove(nextMove)) {
        nextMove = getNextMove();
      }
      lastMove = nextMove;
      return getPosition(currentColumn, currentRow);
    };
    return {
      nextPosition
    };
  })();

  /**
   * ---- Repeater --------------------------------------------------------------
   */
  const Repeater = (() => {
    /**
     * Creates a `Repeater` unit.
     * @param callback
     * @param frequency Frequency per frame for running `callback`.
     */
    const create = (callback, frequency = 1) => ({
      callback,
      frequency,
      accumulation: 0
    });
    const run = repeater => {
      repeater.accumulation += repeater.frequency;
      while (repeater.accumulation >= 1) {
        repeater.accumulation -= 1;
        repeater.callback();
      }
    };
    return {
      create,
      run
    };
  })();

  /**
   * ---- Sketch ----------------------------------------------------------------
   */
  let drawBackground;
  const repeater = Repeater.create(() => {
    const position = Grid.nextPosition();
    Dots.add(position.x, position.y);
  });
  const noise = Noise.withChangeRate(0.05);
  const initialize = () => {
    p.background(252);
    drawBackground = p5ex.storePixels();
    p.noStroke();
  };
  const updateSketch = () => {
    repeater.frequency = 18 * cube(noise());
    Repeater.run(repeater);
    Dots.update();
  };
  const drawSketch = () => {
    Dots.draw();
  };
  const draw = () => {
    updateSketch();
    drawBackground();
    canvas.drawScaled(drawSketch);
  };

  /**
   * ---- Main ------------------------------------------------------------------
   */
  const keyTyped = () => {
    switch (p.key) {
      case "p":
        p5ex.pauseOrResume();
        break;
      case "g":
        p.save("image.png");
        break;
    }
  };
  const setP5Methods = p => {
    p.draw = draw;
    p.keyTyped = keyTyped;
  };
  p5ex.startSketch({
    htmlElement: HTML_ELEMENT,
    logicalCanvasSize: LOGICAL_CANVAS_SIZE,
    initialize: initialize,
    setP5Methods,
    fittingOption: null
  });
})(p5ex, CreativeCodingCore);
//# sourceMappingURL=sketch.js.map
