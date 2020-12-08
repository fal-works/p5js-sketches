/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { container, p } from "./common";
import { Element, createElement, updateElement } from "./element";

// ---- variables & functions ----
let rootElement: Element;

// ---- setup & draw ----
export const setup = (): void => {
  p.noCanvas();

  const wrapper = p.createDiv();
  wrapper.style("margin: 10px");
  if (container) container.appendChild(wrapper.elt); // null check for OpenProcessing

  rootElement = createElement();
  const rootP5Element = rootElement;
  wrapper.child(rootP5Element.mainDiv);
  wrapper.child(rootP5Element.childrenDiv);
};

export const draw = () => {
  updateElement(rootElement);
};
