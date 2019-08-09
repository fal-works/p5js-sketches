/**
 * ---- Line -----------------------------------------------------------------
 */

import p5 from "p5";

import { MutableRange } from "./common/dataTypes";
import { Vector2D, addPolar } from "./common/ds/vector-2d";
import { lazy } from "./common/lazy";
import { nearlyEqual } from "./common/math";
import * as random from "./common/random";
import * as easing from "./common/easing";
import * as Timer from "./common/timer";
import { containsPoint } from "./common/boundingBox";
import { Sweepable } from "./common/ds/sweepable";

import { p, canvas } from "./common/p5util/shared";
import { drawTranslatedAndRotated } from "./common/p5util/transform";

import * as constants from "./constants";

const colorCandidates = lazy(() =>
  constants.DATA_UNIT_COLOR_CODES.map(code => p.color(code))
);
const lineColor = lazy(() => p.color(constants.LINE_COLOR_CODE));

interface DataUnit {
  readonly color: p5.Color;
  readonly start: number;
  readonly end: number;
}

const createSequence = (
  length: number,
  offset: number
): readonly DataUnit[] => {
  const sequence: DataUnit[] = [];
  let x = offset;
  while (x < length) {
    const nextX = Math.min(
      length,
      x + random.inRangePow(constants.DATA_UNIT_LENGTH, 3)
    );
    sequence.push({
      color: random.fromArray(colorCandidates.get()),
      start: x,
      end: nextX
    });
    x = nextX;
    x += random.inRangePow(
      random.bool(constants.SHORT_INTERVAL_PROBABILITY)
        ? constants.DATA_UNIT_SHORT_INTERVAL
        : constants.DATA_UNIT_LONG_INTERVAL,
      2
    );
  }
  return sequence;
};

const drawSequence = (
  sequence: readonly DataUnit[],
  startX: number,
  endX: number,
  left: boolean
) => {
  const unitCount = sequence.length;
  const height = (left ? -1 : 1) * constants.SEQUENCE_WIDTH;
  for (let i = 0; i < unitCount; i += 1) {
    const { color, start, end } = sequence[i];
    if (end < startX) continue;
    if (endX < start) continue;
    p.fill(color);
    p.rect(Math.max(startX, start), 0, Math.min(endX, end), height);
  }
};

interface LineData {
  readonly length: number;
  readonly leftSequence: readonly DataUnit[];
  readonly rightSequence: readonly DataUnit[];
}

const createLineData = (length: number): LineData => {
  return {
    length,
    leftSequence: createSequence(length, 0),
    rightSequence: createSequence(
      length,
      random.inRange(constants.RIGHT_SEQUENCE_OFFSET)
    )
  };
};

interface LineGraphics {
  data: LineData;
  trimRatio: MutableRange;
  draw: () => void;
}

const createLineGraphics = (data: LineData) => {
  const trimRatio = {
    start: 0,
    end: 0
  };
  const length = data.length;
  const draw = () => {
    const startX = trimRatio.start * length;
    const endX = trimRatio.end * length;
    drawSequence(data.leftSequence, startX, endX, true);
    drawSequence(data.rightSequence, startX, endX, false);
    p.stroke(lineColor.get());
    p.line(startX, 0, endX, 0);
    p.noStroke();
  };

  return {
    data,
    trimRatio,
    draw
  };
};

export interface Line extends Sweepable {
  readonly startPoint: Vector2D;
  readonly angle: number;
  readonly graphics: LineGraphics;
  readonly timers: Timer.Chain;
  readonly onCreate: (line: Line) => void;
}

export const drawLine = (line: Line) => {
  const { x, y } = line.startPoint;
  drawTranslatedAndRotated(line.graphics.draw, x, y, line.angle);
};

export const updateLine = (line: Line) => Timer.step(line.timers.current);

export const createLine = (
  startPoint: Vector2D,
  angle: number,
  length: number,
  onCreate: (line: Line) => void
): Line => {
  const graphics = createLineGraphics(createLineData(length));
  const { data, trimRatio } = graphics;

  // eslint-disable-next-line prefer-const
  let newLine: Line;
  const birthDeathDuration = Math.ceil(
    constants.BIRTH_DEATH_DURATION_FACTOR * data.length
  );
  const waitDuration = constants.WAIT_DURATION;

  const onProgressBirth = (timer: Timer.Unit) => {
    trimRatio.end = easing.easeOutCubic(timer.progressRatio);
  };
  const onCompleteBirth = () => {
    for (let i = 0; i < constants.LINE_CREATION_TRY_COUNT; i += 1) {
      const nextStartPoint = addPolar(startPoint, angle, length);
      const nextAngle = random.fromArray(constants.ANGLES);
      if (
        angle === nextAngle ||
        nearlyEqual(Math.abs(angle - nextAngle), Math.PI)
      ) {
        continue;
      }
      const nextLength = random.inRange(constants.LINE_LENGTH);
      const nextEndPoint = addPolar(nextStartPoint, nextAngle, nextLength);

      if (
        !containsPoint(canvas.logicalSize, nextEndPoint, constants.AREA_MARGIN)
      )
        continue;

      createLine(nextStartPoint, nextAngle, nextLength, onCreate);
      break;
    }
  };
  const onProgressDeath = (timer: Timer.Unit) => {
    trimRatio.start = easing.easeInQuad(timer.progressRatio);
  };
  const onCompleteDeath = () => {
    newLine.needsSweep = true;
  };

  const birthTimer = Timer.create(
    birthDeathDuration,
    onProgressBirth,
    onCompleteBirth
  );
  const waitTimer = Timer.create(waitDuration);
  const deathTimer = Timer.create(
    birthDeathDuration,
    onProgressDeath,
    onCompleteDeath
  );
  const timers = Timer.chain([birthTimer, waitTimer, deathTimer]);

  newLine = {
    startPoint,
    angle,
    graphics,
    timers,
    onCreate,
    needsSweep: false
  };

  onCreate(newLine);

  return newLine;
};
