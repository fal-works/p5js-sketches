import { p } from "./common";

export type Unit = (() => void)[];

const syou: Unit = [
  () => p.line(2, 2, 30, 2),
  () => p.line(16, 2, 16, 30),
  () => p.line(16, 16, 30, 16),
  () => p.line(8, 16, 8, 30),
  () => p.line(2, 30, 30, 30),
];

const tally: Unit = [
  () => p.line(6, 2, 6, 30),
  () => p.line(13, 2, 13, 30),
  () => p.line(19, 2, 19, 30),
  () => p.line(26, 2, 26, 30),
  () => p.line(2, 2, 30, 30),
];

const truco: Unit = [
  () => p.line(2, 2, 2, 30),
  () => p.line(2, 2, 30, 2),
  () => p.line(30, 2, 30, 30),
  () => p.line(2, 30, 30, 30),
  () => p.line(2, 2, 30, 30),
];

export const candidates = [syou, tally, truco];
