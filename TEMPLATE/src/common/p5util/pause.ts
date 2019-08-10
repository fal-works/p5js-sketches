/**
 * ---- p5.js pause utility --------------------------------------------------
 */

import { p } from "./shared";

let paused = false;

/**
 * Pauses the sketch by `p.noLoop()`.
 * If already paused, resumes by `p.loop()`.
 */
export const pauseOrResume = (): void => {
  if (paused) {
    p.loop();
    paused = false;
  } else {
    p.noLoop();
    paused = true;
  }
};
