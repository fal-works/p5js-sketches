/**
 * ---- Common ----------------------------------------------------------------
 */

import p5 from "p5";
import * as Settings from "./settings";

export let container: HTMLElement;

export let p: p5;

export const initialize = (p5Instance: p5) => {
  container =
    document.getElementById(Settings.HTML_ELEMENT_ID) || document.body;
  p = p5Instance;
};
