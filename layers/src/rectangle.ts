/**
 * ---- Rectangle -------------------------------------------------------------
 */

import p5 from "p5";
import { colorWithAlpha } from "@fal-works/p5-extension";
import { p } from "./common";
import chroma from "chroma-js";

interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const enum RectangleType {
  Horizontal,
  Vertical,
}

export interface Rectangle {
  bounds: Bounds;
  targetBounds: Bounds;
  color: p5.Color;
  alpha: number;
  targetAlpha: number;
  type: RectangleType;
}

const maxAlpha = 160;

export const createRectangle = (
  x: number,
  y: number,
  width: number,
  height: number,
  type: RectangleType
): Rectangle => {
  let bounds: Bounds;
  switch (type) {
    case RectangleType.Horizontal:
      bounds = { x, y, width, height: 0 };
      break;
    case RectangleType.Vertical:
      bounds = { x, y, width: 0, height };
      break;
  }
  const c = chroma.lch(95, 120, Math.random() * 360).rgb();
  return {
    bounds,
    targetBounds: { x, y, width, height },
    color: p.color(c[0], c[1], c[2]),
    alpha: 1,
    targetAlpha: maxAlpha,
    type,
  };
};

const easeFactor = 0.05;

export const updateRectangle = (rectangle: Rectangle): boolean => {
  const { bounds, targetBounds, type } = rectangle;
  bounds.x += easeFactor * (targetBounds.x - bounds.x);
  bounds.y += easeFactor * (targetBounds.y - bounds.y);
  bounds.width += easeFactor * (targetBounds.width - bounds.width);
  bounds.height += easeFactor * (targetBounds.height - bounds.height);

  rectangle.alpha += easeFactor * (rectangle.targetAlpha - rectangle.alpha);

  if (maxAlpha - 1 < rectangle.alpha) {
    switch (type) {
      case RectangleType.Horizontal:
        targetBounds.y = bounds.y + bounds.height;
        targetBounds.height = 0;
        break;
      case RectangleType.Vertical:
        targetBounds.x = bounds.x + bounds.width;
        targetBounds.width = 0;
        break;
    }
    rectangle.targetAlpha = 0;
  }

  return 1 <= rectangle.alpha;
};

export const drawRectangle = (rectangle: Rectangle): void => {
  const { bounds, color, alpha } = rectangle;
  p.fill(colorWithAlpha(color, alpha));
  p.rect(bounds.x, bounds.y, bounds.width, bounds.height);
};
