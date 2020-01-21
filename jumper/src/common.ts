/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as CCC from "@fal-works/creative-coding-core";
import * as p5ex from "@fal-works/p5-extension";

export const {
  Arrays,
  Vector2D,
  RectangleRegion,
  Random,
  Kinematics,
  Bounce
} = CCC;

export const { onSetup, ShapeColor, Camera } = p5ex;

/**
 * Shared p5 instance.
 */
export let p: p5;

onSetup.push(p5Instance => {
  p = p5Instance;
});

/**
 * Shared canvas instance.
 */
export let canvas: p5ex.ScaledCanvas;

onSetup.push(() => {
  canvas = p5ex.canvas;
});

export let area: CCC.RectangleRegion.Unit;
export let boundary: CCC.RectangleRegion.Unit;
export let camera: p5ex.Camera.Unit;

export const resetCommon = () => {
  area = RectangleRegion.createScaled(
    canvas.logicalRegion,
    2,
    RectangleRegion.ScaleOriginType.Center
  );
  boundary = RectangleRegion.addMargin(area, -50);

  camera = Camera.create({
    displaySize: canvas.logicalSize,
    regionBoundary: RectangleRegion.addMargins(area, {
      left: canvas.logicalSize.width / 2,
      right: canvas.logicalSize.width / 2,
      top: canvas.logicalSize.height / 2,
      bottom: canvas.logicalSize.height / 2
    })
  });
  camera.zoomFactor = 1;
  camera.focusPointEasingFactor = 0.015;
};
