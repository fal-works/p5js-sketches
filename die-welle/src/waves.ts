/**
 * ---- Waves -----------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import { ArrayList, Timer, Random, easeOutQuad, p, halfHeight } from "./common";
import * as Wave from "./wave";
import * as Vertices from "./vertices";

export interface Unit {
  list: CCC.ArrayList.Unit<Wave.Unit>;
  timer: CCC.Timer.Component.Unit;
}

const WAVE_COUNT = 40;
const NOISE_OFFSET_INTERVAL = 2 / WAVE_COUNT;
const HUE_INTERVAL = 120 / WAVE_COUNT;
const VERTEX_INTERVAL_DURATION = 30;

let positiveY = false;

const addNewVertex = (waveList: CCC.ArrayList.Unit<Wave.Unit>) => {
  const yFactor = (positiveY ? 1 : -1) * Random.valueCurved(easeOutQuad, 0.7);
  const y = yFactor * halfHeight;
  const noiseOffsetX = Random.value(4096);
  const noiseOffsetY = Random.value(4096);
  ArrayList.loop(waveList, (wave, index) => {
    const additionalOffset = index * NOISE_OFFSET_INTERVAL;
    Vertices.addNewVertex(
      wave.vertices,
      y,
      noiseOffsetX + additionalOffset,
      noiseOffsetY + additionalOffset
    );
  });
  positiveY = !positiveY;
};

export const create = (): Unit => {
  const list = ArrayList.createPopulated(WAVE_COUNT, index =>
    Wave.create(index * HUE_INTERVAL)
  );

  const timer = Timer.loop(
    Timer.create({
      duration: VERTEX_INTERVAL_DURATION,
      onProgress: () => ArrayList.loop(list, Wave.update),
      onComplete: () => addNewVertex(list)
    })
  );

  return { list, timer };
};

export const update = (waves: Unit) => waves.timer.step();

export const draw = (waves: Unit) => {
  p.push();
  p.blendMode(p.DIFFERENCE);
  p.noFill();
  ArrayList.loop(waves.list, Wave.draw);
  p.pop();
};

export const reset = (waves: Unit) => {
  ArrayList.loop(waves.list, Wave.reset);
  waves.timer.reset();
};
