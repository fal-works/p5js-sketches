/**
 * ---- Common timer utility ------------------------------------------------
 */

0;

export interface Timer {
  step: () => void;
  isCompleted: () => boolean;
  reset: () => void;
  getProgressRatio: () => number;
  getCount: () => number;
}

export const createTimer = (duration: number): Timer => {
  let count = 0;

  const step = () => {
    count += 1;
  };
  const isCompleted = () => count === duration;
  const reset = () => {
    count = 0;
  };
  const getProgressRatio = () => count / duration;
  const getCount = () => count;

  return {
    step,
    isCompleted,
    reset,
    getProgressRatio,
    getCount
  };
};

export interface TimerCallback {
  (timer: Timer): void;
}

export interface Phase {
  duration: number;
  callback: TimerCallback;
}

export interface TimerChain {
  step: () => void;
  runPhase: () => void;
}

export const createTimerChain = (
  phases: Phase[],
  loopCallback: () => void = () => {}
): TimerChain => {
  let phaseIndex = 0;
  let currentCallback = phases[0].callback;
  const phaseLength = phases.length;
  const timers: Timer[] = [];
  const callbacks: TimerCallback[] = [];
  for (let i = 0, len = phases.length; i < len; i += 1) {
    timers.push(createTimer(phases[i].duration));
    callbacks.push(phases[i].callback);
  }
  let currentTimer = timers[0];

  const step = () => {
    currentTimer.step();

    if (currentTimer.isCompleted()) {
      currentTimer.reset();
      phaseIndex += 1;

      if (phaseIndex >= phaseLength) {
        phaseIndex = 0;
        loopCallback();
      }

      currentTimer = timers[phaseIndex];
      currentCallback = phases[phaseIndex].callback;
    }
  };

  const runPhase = () => {
    currentCallback(currentTimer);
  };

  return {
    step,
    runPhase
  };
};
