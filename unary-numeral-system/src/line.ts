import { p, canvas, translate, undoTranslate } from "./common";
import * as Letter from "./letter";

export interface Unit {
  y: number;
  time: number;
  letter: Letter.Unit;
}

export const create = (y: number): Unit => ({
  y,
  time: Math.random() * 1024,
  letter: p.random(Letter.candidates),
});

export const update = (line: Unit): void => {
  line.time += 0.02;
};

export const cellSize = 36;
let maxCellCount = 1;

export const updateStatic = (): void => {
  maxCellCount = canvas.logicalSize.width / cellSize;
};

export const draw = (line: Unit): void => {
  const value = Math.floor(p.noise(line.time) * maxCellCount * 5);
  const fullCellCount = Math.floor(value / 5);
  const letter = line.letter;
  const letterDrawCount = letter.length;
  const finalCellValue = value % letterDrawCount;

  for (let i = 0; i < fullCellCount; i += 1) {
    translate(i * cellSize, line.y);
    letter.forEach((f) => f());
    undoTranslate();
  }

  translate(fullCellCount * cellSize, line.y);
  for (let k = 0; k < finalCellValue; k += 1) letter[k]();
  undoTranslate();
};
