import { p, Random, Easing } from "./global";

export let x = 0;
export let y = 0;

/**
 * Scale factor between 0 and 1.
 */
export let scaleFactor = 1;

/**
 * Alpha value between 1 and 255.
 */
export let alpha = 255;

const magnitude = 320;
const tOffset = {
  x: Random.value(256),
  y: Random.value(256),
  s: Random.value(256),
  a: Random.value(256)
};
const ease = Easing.integrate(Easing.easeInCubic, Easing.easeOutCubic);

let t = 0;
let alphaT = 0;
export const update = () => {
  t += 0.005;
  alphaT += 0.02;

  x = magnitude * (-0.5 + p.noise(tOffset.x + t));
  y = magnitude * (-0.5 + p.noise(tOffset.y + t));
  scaleFactor = 0.5 + p.noise(tOffset.s + t);

  const alphaNoise = p.noise(tOffset.a + alphaT);
  alpha = 1 + 254 * ease(alphaNoise);
};
