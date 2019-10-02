import { HtmlUtility, RectangleSize } from "@fal-works/creative-coding-core";

/**
 * The id of the HTML element to which the canvas should belong.
 */
export const HTML_ELEMENT_ID = "BezierShapes";

/**
 * The HTML element to which the canvas should belong.
 */
export const HTML_ELEMENT = HtmlUtility.getElementOrBody(HTML_ELEMENT_ID);

/**
 * The logical size of the canvas.
 */
export const LOGICAL_CANVAS_SIZE: RectangleSize.Unit = {
  width: 800,
  height: 800
};
