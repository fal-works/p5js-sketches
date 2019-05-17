/**
 * ------------------------------------------------------------------------
 *  Common environment utility
 * ------------------------------------------------------------------------
 */

import { RectangleSize } from "./dataTypes";

/**
 * Finds HTML element by `id`. If not found, returns `document.body`.
 * @param id
 */
export function getElementOrBody(id: string): HTMLElement {
  return document.getElementById(id) || document.body;
}

/**
 * Returns the width and height of `node`.
 * If `node === document.body`, returns the inner width and height of `window`.
 * @param node
 */
export function getElementSize(node: Element): RectangleSize {
  if (node === document.body)
    return {
      width: window.innerWidth,
      height: window.innerHeight
    };

  const boundingClientRect = node.getBoundingClientRect();

  return {
    width: boundingClientRect.width,
    height: boundingClientRect.height
  };
}
