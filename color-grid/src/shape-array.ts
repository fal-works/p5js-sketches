/**
 * ---- Shape Array ------------------------------------------------------------
 */

import * as Shape from "./shape";

export const ArrayType = {
  Row: 0,
  Column: 1,
} as const;
type ArrayType = typeof ArrayType[keyof typeof ArrayType];

export interface Unit {
  array: Shape.Unit[];
  visibility: number;
  type: ArrayType;
}

export const create = (array: Shape.Unit[], type: ArrayType): Unit => ({
  array: array,
  visibility: 0.0,
  type: type,
});

export const update = (shapes: Unit): void => {
  shapes;
};

export const draw = (shapes: Unit): void => {
  const { array, visibility, type } = shapes;
  switch (type) {
    case ArrayType.Row:
      for (const shape of array) Shape.draw(shape, 1.0, visibility);
      break;
    case ArrayType.Column:
      for (const shape of array) Shape.draw(shape, visibility, 1.0);
      break;
  }
};
