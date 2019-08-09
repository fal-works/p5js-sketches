import { createAngleArray } from "./common/math";
import { NumberRange } from "./common/dataTypes";

export const LINE_LIST_INITIAL_CAPACITY = 32;
export const STROKE_WEIGHT = 2;
export const BACKGROUND_COLOR_ARRAY = [248, 248, 252];

export const ANGLES = createAngleArray(8);
export const RIGHT_SEQUENCE_OFFSET: NumberRange = { start: 50, end: 150 };
export const SEQUENCE_WIDTH = 10;
export const DATA_UNIT_LENGTH: NumberRange = { start: 2, end: 15 };
export const DATA_UNIT_SHORT_INTERVAL: NumberRange = { start: 3, end: 20 };
export const DATA_UNIT_LONG_INTERVAL: NumberRange = { start: 40, end: 160 };
export const SHORT_INTERVAL_PROBABILITY = 0.8;

export const LINE_LENGTH: NumberRange = { start: 20, end: 600 };
export const LINE_CREATION_TRY_COUNT = 1000;
export const AREA_MARGIN = 80;
export const BIRTH_DEATH_DURATION_FACTOR = 1 / 15;
export const WAIT_DURATION = 30;

// https://colorhunt.co/palette/144426 +a
export const DATA_UNIT_COLOR_CODES: readonly string[] = [
  "#7189bf",
  "#df7599",
  "#ffc785",
  "#72d6c9",
  "#202020"
];
export const LINE_COLOR_CODE = "#202020";
