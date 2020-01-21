import { p, ShapeColor } from "./common";
import { GraphNodeUnit } from "./graph-node";

export interface GraphEdgeUnit {
  nodeA: GraphNodeUnit;
  nodeB: GraphNodeUnit;
  markerFactor: number;
}

export const GraphEdge = (() => {
  const color = ShapeColor.create([0, 32], undefined, 1);
  const markerColor = ShapeColor.create("#BF1E56", undefined, 256);

  const create = (
    nodeA: GraphNodeUnit,
    nodeB: GraphNodeUnit
  ): GraphEdgeUnit => ({
    nodeA,
    nodeB,
    markerFactor: 0
  });

  const update = (edge: GraphEdgeUnit) => {
    if (edge.markerFactor > 0) edge.markerFactor -= 0.005;
  };

  const draw = (edge: GraphEdgeUnit) => {
    const {
      nodeA: { x: ax, y: ay },
      nodeB: { x: bx, y: by }
    } = edge;

    p.strokeWeight(2);
    ShapeColor.apply(color, 255);
    p.line(ax, ay, bx, by);

    const markerAlpha = 255 * edge.markerFactor;
    if (markerAlpha < 1) return;
    p.strokeWeight(2 + 4 * edge.markerFactor);
    ShapeColor.apply(markerColor, markerAlpha);
    p.line(ax, ay, bx, by);
  };

  const getOhterNode = (edge: GraphEdgeUnit, node: GraphNodeUnit) =>
    edge.nodeA === node ? edge.nodeB : edge.nodeA;

  const mark = (edge: GraphEdgeUnit) => {
    edge.markerFactor = 1;
  };

  return {
    create,
    update,
    draw,
    getOhterNode,
    mark
  };
})();
