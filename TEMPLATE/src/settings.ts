/**
 * ---- Settings -------------------------------------------------------------
 */

import { getElementOrBody } from "./common/environment";
import { RectangleSize } from "./common/dataTypes";

/**
 * The id of the HTML element to which the canvas should belong.
 */
export const HTML_ELEMENT_ID = "Template";

/**
 * The HTML element to which the canvas should belong.
 */
export const HTML_ELEMENT = getElementOrBody(HTML_ELEMENT_ID);

/**
 * The logical size of the canvas.
 */
export const LOGICAL_CANVAS_SIZE: RectangleSize = {
  width: 800,
  height: 800
};
