/**
 * ---- p5.js pause utility --------------------------------------------------
 */

import { p } from "./shared";

let paused = false;

export const pauseOrResume = () => {
  if (paused) {
    p.loop();
    paused = false;
  } else {
    p.noLoop();
    paused = true;
  }
};
