/**
 * -----------------------------------------------------------------------------
 * @module common/timer
 */

import { loop } from "./ds/array";
import { Mutable } from "./utility-types";

type Listener = (timerUnit: Unit) => void;

export interface Unit {
  readonly duration: number;
  readonly progressRatioChangeRate: number;
  readonly onProgress: Listener;
  readonly onComplete: Listener;
  count: number;
  progressRatio: number;
  isCompleted: boolean;
}

const emptyListener: Listener = () => {};

export const reset = (timerUnit: Unit) => {
  timerUnit.count = 0;
  timerUnit.progressRatio = 0;
  timerUnit.isCompleted = false;
};

export const step = (timerUnit: Unit) => {
  const { isCompleted, count, duration, progressRatioChangeRate } = timerUnit;

  if (isCompleted) return;

  if (count >= duration) {
    timerUnit.progressRatio = 1;
    timerUnit.onProgress(timerUnit);
    timerUnit.isCompleted = true;
    timerUnit.onComplete(timerUnit);
    return;
  }

  timerUnit.onProgress(timerUnit);
  timerUnit.count += 1;
  timerUnit.progressRatio += progressRatioChangeRate;
};

export const create = (
  duration: number,
  onProgress: Listener = emptyListener,
  onComplete: Listener = emptyListener
): Unit => {
  return {
    duration,
    progressRatioChangeRate: 1 / duration,
    onProgress,
    onComplete,
    count: 0,
    progressRatio: 0,
    isCompleted: false
  };
};

export const dummyUnit = create(0);

export const addOnComplete = (timerUnit: Unit, onComplete: Listener): Unit => {
  const newUnit: Mutable<Unit> = Object.assign({}, timerUnit);
  newUnit.onComplete = () => {
    timerUnit.onComplete(newUnit);
    onComplete(newUnit);
  };
  return newUnit;
};

export const setChainIndex = (chain: Chain, index: number) => {
  chain.index = index;
  chain.current = chain.units[index];
};

export const resetChain = (chain: Chain) => {
  loop(chain.units, reset);
  setChainIndex(chain, 0);
};

export const shiftChain = (chain: Chain) =>
  setChainIndex(chain, chain.index + 1);

export interface Chain {
  readonly units: readonly Unit[];
  current: Unit;
  index: number;
}

export const chain = (timers: Unit[], looped: boolean = false) => {
  // eslint-disable-next-line prefer-const
  let newChain: Chain;
  const newTimers: Unit[] = new Array(timers.length);

  const shift = () => shiftChain(newChain);
  const lastIndex = timers.length - 1;
  for (let i = 0; i < lastIndex; i += 1) {
    newTimers[i] = addOnComplete(timers[i], shift);
  }
  if (!looped) newTimers[lastIndex] = timers[lastIndex];
  else
    newTimers[lastIndex] = addOnComplete(timers[lastIndex], () =>
      resetChain(newChain)
    );

  newChain = {
    units: newTimers,
    current: newTimers[0],
    index: 0
  };

  return newChain;
};

export const dummyChain = chain([dummyUnit]);
