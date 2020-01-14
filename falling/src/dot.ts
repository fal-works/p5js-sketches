/**
 * ---- Dot -------------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import { p, SimpleDynamics, ShapeColor, Timer, Tween, Easing } from "./common";
import { LOGICAL_CANVAS_SIZE } from "./settings";

export interface DotUnit extends CCC.SimpleDynamics.Quantity {
  alpha: number;
  size: number;
}

export const Dot = (() => {
  const maxSize = 20;
  const habitableZoneBottomY = LOGICAL_CANVAS_SIZE.height + maxSize;

  const shapeColor = ShapeColor.create(undefined, [32, 192], 255);

  const timerSet = Timer.Set.construct(1024);
  const dotSizeTweenParameters: CCC.Tween.Parameters = {
    start: maxSize / 2,
    end: maxSize,
    easing: Easing.Out.createBack()
  };

  const create = (x: number, y: number): DotUnit => {
    const dot = {
      ...SimpleDynamics.createQuantity(x, y),
      alpha: 255,
      size: 0
    };

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

  const update = (dot: DotUnit) => {
    dot.fy = 0.05;
    SimpleDynamics.updateEuler(dot);
    dot.alpha -= 2;

    return dot.alpha <= 0 || dot.y >= habitableZoneBottomY;
  };

  const draw = (dot: DotUnit) => {
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
