/**
 * ---- Dot -------------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import { p, onSetup, SimpleDynamics, Easing, min2 } from "./common";
import { LOGICAL_CANVAS_SIZE } from "./settings";

export interface DotUnit extends CCC.SimpleDynamics.Quantity {
  frameCount: number;
}

export const Dot = (() => {
  const expandDuration = 30;
  const livingDuration = 90;
  const maxSize = 20;
  const graphicsFrameSize = 24;
  const habitableZoneBottomY =
    LOGICAL_CANVAS_SIZE.height + graphicsFrameSize / 2;
  let graphicsFrames: readonly p5.Graphics[];

  const createGraphicsFrame = (index: number) => {
    const alphaRatio = 1 - index / livingDuration;
    const sizeRatio = min2(1, index / expandDuration);
    const easeSize = Easing.Out.createBack(2);

    const graphics = p.createGraphics(graphicsFrameSize, graphicsFrameSize);
    graphics.translate(graphics.width / 2, graphics.height / 2);
    graphics.noStroke();
    graphics.fill(32, alphaRatio * 192);
    graphics.circle(0, 0, maxSize * easeSize(sizeRatio));

    return graphics;
  };

  onSetup.push(() => {
    graphicsFrames = CCC.Arrays.createIntegerSequence(livingDuration).map(
      createGraphicsFrame
    );
  });

  const create = (x: number, y: number): DotUnit => ({
    ...SimpleDynamics.createQuantity(x, y),
    frameCount: 0
  });

  const update = (dot: DotUnit) => {
    dot.fy = 0.05;
    SimpleDynamics.updateEuler(dot);
    dot.frameCount += 1;

    return dot.frameCount >= livingDuration || dot.y >= habitableZoneBottomY;
  };

  const draw = (dot: DotUnit) =>
    p.image(graphicsFrames[dot.frameCount], dot.x, dot.y);

  return {
    create,
    update,
    draw
  };
})();
