import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";
import { p, onSetup, Random, Kinematics, Bounce, boundary } from "./common";

export interface GraphNodeUnit extends CCC.Kinematics.Quantity {
  draw: (x: number, y: number) => void;
}

export const GraphNode = (() => {
  const colorCodes = ["#FFE600", "#A4C520", "#0086AB"];
  let drawFunctions: ((x: number, y: number) => void)[];
  onSetup.push(() => {
    drawFunctions = colorCodes.map(colorCode => {
      const g = p.createGraphics(120, 120);
      g.noStroke();
      g.fill(p5ex.colorWithAlpha(colorCode, 64));
      g.circle(64, 64, 100);
      g.fill(p5ex.colorWithAlpha(colorCode, 160));
      g.circle(60, 60, 100);
      return (x, y) => p.image(g, x, y);
    });
  });

  const create = (): GraphNodeUnit => {
    const position = Random.pointInRectangleRegion(boundary);
    const velocity = Random.vector(3);

    return {
      ...Kinematics.createQuantity(
        position.x,
        position.y,
        velocity.x,
        velocity.y
      ),
      draw: Random.Arrays.get(drawFunctions)
    };
  };

  const update = (node: GraphNodeUnit) => {
    Kinematics.updateEuler(node);
    Bounce.withinRectangle(node, boundary, 1);
  };

  const draw = (node: GraphNodeUnit) => node.draw(node.x, node.y);

  return { create, update, draw };
})();
