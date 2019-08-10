/**
 * -----------------------------------------------------------------------------
 * @module common/environment
 */

import { RectangleSize } from "./data-types";

/**
 * Finds HTML element by `id`. If not found, returns `document.body`.
 * @param id
 */
export const getElementOrBody = (id: string): HTMLElement =>
  document.getElementById(id) || document.body;

/**
 * Returns the width and height of `node`.
 * If `node === document.body`, returns the inner width and height of `window`.
 * @param node
 */
export const getElementSize = (node: Element): RectangleSize =>
  node === document.body
    ? {
        width: window.innerWidth,
        height: window.innerHeight
      }
    : node.getBoundingClientRect();
