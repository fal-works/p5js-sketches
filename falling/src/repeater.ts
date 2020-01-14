/**
 * ---- Repeater --------------------------------------------------------------
 */

export interface RepeaterUnit {
  callback: () => void;
  frequency: number;
  accumulation: number;
}

export const Repeater = (() => {
  /**
   * Creates a `Repeater` unit.
   * @param callback
   * @param frequency Frequency per frame for running `callback`.
   */
  const create = (callback: () => void, frequency = 1) => ({
    callback,
    frequency,
    accumulation: 0
  });

  const run = (repeater: RepeaterUnit) => {
    repeater.accumulation += repeater.frequency;
    while (repeater.accumulation >= 1) {
      repeater.accumulation -= 1;
      repeater.callback();
    }
  };

  return {
    create,
    run
  };
})();
