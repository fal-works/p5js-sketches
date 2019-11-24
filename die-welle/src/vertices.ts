/**
 * ---- Vertices --------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, p, width, LEFT_X, RIGHT_X } from "./common";
import * as Vertex from "./vertex";

export type Unit = CCC.ArrayList.Unit<Vertex.Unit>;

export const create = (): Unit => ArrayList.create<Vertex.Unit>(32);

export const reset = (vertices: Unit) => {
  ArrayList.clear(vertices);
  [0.25, 0.5, 0.75, 1].forEach(factor =>
    ArrayList.add(vertices, Vertex.create(factor * width, 0))
  );
};
export const update = (vertices: Unit) =>
  ArrayList.removeShiftAll(vertices, Vertex.update);

export const addNewVertex = (
  vertices: Unit,
  y: number,
  noiseOffsetX: number,
  noiseOffsetY: number
) =>
  ArrayList.add(
    vertices,
    Vertex.create(RIGHT_X, y, noiseOffsetX, noiseOffsetY)
  );

export const draw = (vertices: Unit) => {
  p.beginShape();
  p.curveVertex(LEFT_X - 20, 0);
  p.curveVertex(LEFT_X - 10, 0);
  p.curveVertex(LEFT_X, 0);
  ArrayList.loop(vertices, Vertex.draw);
  p.curveVertex(RIGHT_X, 0);
  p.curveVertex(RIGHT_X + 10, 0);
  p.curveVertex(RIGHT_X + 20, 0);
  p.endShape();
};
