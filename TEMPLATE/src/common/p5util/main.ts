/**
 * -----------------------------------------------------------------------------
 * @module common/p5util/main
 */

import p5 from "p5";
import { getElementOrBody } from "../environment";
import { RectangleSize } from "../data-types";
import { loop } from "../ds/array";
import { setP5Instance, setCanvas } from "./shared";
import { createScaledCanvas } from "./canvas";
import { onSetup } from "./setup";

/**
 * Settings data that should be passed to `startSketch()`.
 */
export interface SketchSettings {
  /**
   * The HTML element (or its ID) to which the canvas should belong.
   */
  htmlElement: HTMLElement | string;

  /**
   * The logical (i.e. non-scaled) size of the canvas, e.g. `{ width: 640, height: 480 }`;
   */
  logicalCanvasSize: RectangleSize;

  /**
   * Function that will be called in `p.setup()` just after creating the canvas.
   * The canvas will be automatically created and should not be manually created in this function.
   */
  initialize: () => void;

  /**
   * Function that should set several methods of `p5` instance, e.g. `p.draw()`.
   */
  setP5Methods: (p5Instance: p5) => void;
}

/**
 * Calls `new p5()` with the given settings information.
 * @param settings
 */
export const startSketch = (settings: SketchSettings): void => {
  const htmlElement =
    typeof settings.htmlElement === "string"
      ? getElementOrBody(settings.htmlElement)
      : settings.htmlElement;

  new p5((p: p5): void => {
    setP5Instance(p);
    p.setup = (): void => {
      setCanvas(createScaledCanvas(htmlElement, settings.logicalCanvasSize));
      settings.initialize();
      loop(onSetup, listener => listener(p));
      onSetup.length = 0;
    };
    settings.setP5Methods(p);
  }, htmlElement);
};
