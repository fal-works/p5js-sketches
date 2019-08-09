/**
 * ---- p5util main -----------------------------------------------------------
 */

import p5 from "p5";
import { getElementOrBody } from "../environment";
import { RectangleSize } from "../dataTypes";
import { loop } from "../ds/array";
import { setP5Instance, setCanvas } from "./shared";
import { createScaledCanvas } from "./canvas";
import { onSetup } from "./setup";

export interface SketchSettings {
  /**
   * The ID of the HTML element to which the canvas should belong.
   */
  htmlElementId: string;

  /**
   * The logical (i.e. non-scaled) size of the canvas, e.g. `{ width: 640, height: 480 }`;
   */
  logicalCanvasSize: RectangleSize;

  /**
   * Callback function that will be called in `p.setup()`.
   * The canvas will be automatically created and should not be manually created in this function.
   */
  initialize: () => void;

  /**
   * Callback function that sets several methods of `p5` instance, e.g. `p.draw()`.
   */
  setP5Methods: (p5Instance: p5) => void;
}

/**
 * Calls `new p5()` with the given settings information.
 * @param settings
 */
export const startSketch = (settings: SketchSettings): void => {
  const htmlElement = getElementOrBody(settings.htmlElementId);

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
