import { canvas, ArrayList, Random, ShapeColor, square } from "./common";
import { BodyUnit, Body } from "./body";

export const Bodies = (() => {
  const trailColor = ShapeColor.create([160, 0, 0], null, 1);
  const count = 16;
  const list = ArrayList.create<BodyUnit>(count);

  const reset = () => {
    ArrayList.clearReference(list);

    const maxBearing = 0.45 * canvas.logicalSize.height;
    for (let i = 0; i < count; i += 1) {
      const bearing = (1 - Random.Curved.ratio(square)) * maxBearing;
      ArrayList.add(list, Body.create(Random.vector(bearing)));
    }
  };

  const update = () => {
    ArrayList.loop(list, Body.preUpdate);

    ArrayList.roundRobin(list, Body.interact);

    ArrayList.loop(list, Body.postUpdate);
  };

  const draw = () => {
    ShapeColor.apply(trailColor, 255);
    ArrayList.loop(list, Body.drawTrail);

    ArrayList.loop(list, Body.draw);
  };

  return {
    reset,
    update,
    draw
  };
})();
