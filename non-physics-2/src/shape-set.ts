/**
 * ---- Shape set --------------------------------------------------------------
 */

import * as p5ex from "@fal-works/p5-extension";
import { onSetup, ShapeColor } from "@fal-works/p5-extension";
import { Random, translate, undoTranslate } from "./common";
import * as ShapeUnit from "./shape-unit";

let blue: p5ex.ShapeColor.Unit;
let purple: p5ex.ShapeColor.Unit;
let green: p5ex.ShapeColor.Unit;
let yellow: p5ex.ShapeColor.Unit;
onSetup.push(() => {
  blue = ShapeColor.create("#3232FF", undefined, 256); // 240, 80, 100
  purple = ShapeColor.create("#B72DE5", undefined, 256); // 285, 80, 90
  green = ShapeColor.create("#20D84E", undefined, 256); // 135, 85, 85
  yellow = ShapeColor.create("#D8D820", undefined, 256); // 60, 85, 85
});

export interface Unit {
  readonly x: number;
  readonly y: number;
  readonly units: readonly ShapeUnit.Unit[];
  visibility: number;
}

const createUnits = () => {
  const colors = Random.bool(0.7) ? [blue, purple] : [green, yellow];
  const units: ShapeUnit.Unit[] = [];
  for (let i = 0; i < 3; i += 1)
    units.push(
      ShapeUnit.create(
        Random.signed(30),
        Random.signed(30),
        Random.bool(0.5),
        Random.Arrays.get(colors)
      )
    );
  return units;
};

export const create = (x: number, y: number): Unit => ({
  x,
  y,
  units: createUnits(),
  visibility: 0.0,
});

export const draw = (shapeSet: Unit): void => {
  translate(shapeSet.x, shapeSet.y);
  for (const unit of shapeSet.units) ShapeUnit.draw(unit, shapeSet.visibility);
  undoTranslate();
};
