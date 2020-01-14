/**
 * ---- Dots ------------------------------------------------------------------
 */

import { DotUnit, Dot } from "./dot";
import { ArrayList } from "./common";

export const Dots = (() => {
  const list = ArrayList.create<DotUnit>(1024);

  const update = () => {
    Dot.timerSet.step();
    ArrayList.removeShiftAll(list, Dot.update);
  };
  const draw = () => ArrayList.loop(list, Dot.draw);

  const add = (x: number, y: number) => ArrayList.add(list, Dot.create(x, y));

  return { update, draw, add };
})();
