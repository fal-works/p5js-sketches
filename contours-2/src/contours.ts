import * as p5ex from "@fal-works/p5-extension";
import {
  p,
  onSetup,
  ArrayList,
  Gravitation,
  Mouse,
  ShapeColor
} from "./global";
import * as Contour from "./contour";
import * as NoiseVector from "./noise-vector";

let outlineColor: p5ex.ShapeColor.Unit;
onSetup.push(() => {
  outlineColor = ShapeColor.create(p.color(64), null, 256);
});

export const contours = ArrayList.create<Contour.Unit>(256);

export const reset = () => {
  ArrayList.clearReference(contours);
  for (let i = 0; i < 16; i += 1) ArrayList.add(contours, Contour.create());
};

const attractToMouse = Gravitation.attract.calculateSimple.bind(
  undefined,
  Mouse.logicalPosition
);
const applyForce = (contour: Contour.Unit) => {
  attractToMouse(contour);
  Contour.applyDrag(contour);
};

export const update = () => {
  ArrayList.loop(contours, Contour.update);
  ArrayList.loop(contours, applyForce);
  ArrayList.loop(contours, Contour.postUpdate);
};

export const draw = () => {
  p.blendMode(p.DIFFERENCE);
  p.noStroke();
  p.translate(NoiseVector.x, NoiseVector.y);
  ArrayList.loop(contours, Contour.drawShadow);
  p.translate(-NoiseVector.x, -NoiseVector.y);

  p.blendMode(p.BLEND);
  ShapeColor.apply(outlineColor, 256 - NoiseVector.alpha);
  p.strokeWeight(1);
  ArrayList.loop(contours, Contour.drawOutline);
};

export const gather = () => {
  Gravitation.setConstant(1000000);
  Contour.setMaxForceMagnitude(3);
};

export const release = () => {
  Gravitation.setConstant(100000);
  Contour.setMaxForceMagnitude(0.5);
  ArrayList.loop(contours, Contour.activate);
};
release();
