/**
 * ---- Wave ------------------------------------------------------------------
 */

import p5 from "p5";
import {
  p,
  onSetup,
  ArrayUtility,
  floor,
  hsvColor,
  reverseColor
} from "./common";
import * as Vertices from "./vertices";

let colors: p5.Color[];
onSetup.push(() => {
  colors = ArrayUtility.createIntegerSequence(360).map(hue =>
    reverseColor(hsvColor(hue, 1, 0.8, 96))
  );
});
const getColor = (hue: number) => colors[floor(hue) % 360];

export interface Unit {
  vertices: Vertices.Unit;
  hue: number;
}

export const create = (hue: number): Unit => {
  return {
    vertices: Vertices.create(),
    hue
  };
};

export const update = (wave: Unit) => {
  Vertices.update(wave.vertices);
  wave.hue += 1;
};

export const draw = (wave: Unit) => {
  p.stroke(getColor(wave.hue));
  Vertices.draw(wave.vertices);
};

export const reset = (wave: Unit) => Vertices.reset(wave.vertices);
