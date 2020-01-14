/**
 * ---- Grid ------------------------------------------------------------------
 */

import { Random, Vector2D } from "./common";
import { LOGICAL_CANVAS_SIZE } from "./settings";

interface Move {
  readonly column: number;
  readonly row: number;
  readonly nextMoves: Move[];
}

export const Grid = (() => {
  // ---- constants ----
  const cellSize = 25;
  const columns = Math.floor(LOGICAL_CANVAS_SIZE.width / cellSize);
  const rows = Math.floor(LOGICAL_CANVAS_SIZE.height / cellSize);

  // ---- moves ----
  const createMove = (column: number, row: number): Move => ({
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

  // ---- variables ----
  let currentColumn = Math.floor(columns / 2);
  let currentRow = Math.floor(rows / 2);
  let lastMove: Move = createMove(0, 0);
  lastMove.nextMoves.push(...Moves);

  // ---- functions ----
  const reverseMove = (move: Move) => {
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

  const applyMove = (move: Move) => {
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

  const getPosition = (column: number, row: number) =>
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
