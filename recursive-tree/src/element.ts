/**
 * ---- Element ---------------------------------------------------------------
 */

import p5 from "p5";
import { p } from "./common";

const randomColor = (): string => {
  // p.colorMode(p.HSB, 1, 1, 1, 1);
  // const hue = (0.001 * p.frameCount + 0.3 * Math.random()) % 1;
  // const color = p.color(hue, 0.7, 0.95);
  // const r = p.hex(Math.floor(p.red(color)), 2);
  // const g = p.hex(Math.floor(p.green(color)), 2);
  // const b = p.hex(Math.floor(p.blue(color)), 2);
  // const colorCode = `#${r}${g}${b}`;
  // return colorCode;

  return "#" + p.random(["ffcfdf", "fefdca", "e0f9b5", "a5dee5"]);
};

export interface Element {
  mainDiv: p5.Element;
  childrenDiv: p5.Element;
  level: number;
  children: Element[];
  phase: number;
}

const indentWidth = 64;

export const createElement = (parent?: Element, level = 0): Element => {
  const mainDiv = p.createDiv();
  mainDiv.style(`background-color: ${randomColor()}`);
  mainDiv.addClass("line");
  mainDiv.addClass("new-line");
  mainDiv.addClass("item");
  const childrenDiv = p.createDiv();
  childrenDiv.style(`margin-left: ${indentWidth}px`);
  childrenDiv.addClass("item");
  if (parent) {
    parent.mainDiv.child(mainDiv);
    parent.mainDiv.child(childrenDiv);
  }
  const newElement: Element = {
    mainDiv,
    level,
    children: [],
    childrenDiv,
    phase: 0,
  };
  setTimeout(() => {
    mainDiv.removeClass("new-line");
    mainDiv.addClass("alive-line");
    newElement.phase = 1;
    setTimeout(() => {
      newElement.phase = 2;
    }, 1000);
  }, 1);
  return newElement;
};

const addChild = (_this: Element): void => {
  const born = createElement(_this, _this.level + 1);
  _this.children.push(born);
  _this.childrenDiv.child(born.mainDiv);
  _this.childrenDiv.child(born.childrenDiv);
};

const remove = (_this: Element): void => {
  _this.phase = 3;
  _this.mainDiv.removeClass("alive-line");
  _this.mainDiv.addClass("dead-line");
  setTimeout(() => {
    _this.mainDiv.remove();
    _this.childrenDiv.remove();
  }, 1000);
  for (const child of _this.children) remove(child);
};

const popRandomChild = (_this: Element): Element | undefined => {
  const { children } = _this;
  if (children.length === 0) return undefined;
  const deadIndex = Math.floor(Math.random() * children.length);
  const dead = children.splice(deadIndex, 1)[0];
  if (dead.phase === 3) return undefined;
  else return dead;
};

export const updateElement = (_this: Element): void => {
  if (_this.children.length < 2 && Math.random() < 0.03) addChild(_this);
  else if (1 < _this.children.length && Math.random() < 0.005) {
    const dead = popRandomChild(_this);
    if (dead) remove(dead);
  } else if (_this.level < 2)
    for (const child of _this.children) updateElement(child);
};
