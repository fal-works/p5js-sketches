import { p, ArrayList, Gravitation, Mouse } from "./global";
import * as Contour from "./contour";

export const contours = ArrayList.create<Contour.Unit>(256);

export const reset = () => {
  p.push();
  p.colorMode(p.HSB, 360, 1, 1, 1);
  ArrayList.clearReference(contours);
  for (let i = 0; i < 16; i += 1) ArrayList.add(contours, Contour.create());
  p.pop();
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
  p.stroke(192);
  p.strokeWeight(6);
  p.noFill();
  ArrayList.loop(contours, Contour.draw);
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
