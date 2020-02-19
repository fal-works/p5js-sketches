/**
 * ---- Sketch ----------------------------------------------------------------
 */

import { storePixels } from "@fal-works/p5-extension";
import { p, canvas, resetCommon } from "./common";
import { Letter, LetterUnit } from "./letter";
import { fontName, fontSize, lineHeight, letterInterval } from "./settings";

// ---- variables | functions ----
let drawBackground: () => void;
const letters: LetterUnit[] = [];
let x: number;
let y: number;
let initialized = false;
const minX = 30;
const minY = 30;

const resetLetters = () => {
  letters.length = 0;
};
const resetX = () => {
  x = minX;
};
const resetY = () => {
  y = minY;
};
const clearArea = () => {
  resetLetters();
  resetX();
  resetY();
};
const breakLine = () => {
  resetX();
  y += lineHeight;
};

const createLetter = (character: string) => {
  const letter = Letter.create(x, y, character);
  x += letter.width + letterInterval;
  if (x > 0.75 * canvas.logicalSize.width) {
    breakLine();
  }
  return letter;
};
const addLetter = (character: string) => {
  const newLetter = createLetter(character);
  letters.push(newLetter);
};
const addSentence = (sentence: string) => {
  if (sentence === "") return;

  const characters = sentence.split("");
  const newLetters = characters.map(createLetter);
  letters.push(...newLetters);

  breakLine();
};
const addInitialSentences = () => {
  addSentence("Type something!");
  addSentence("Everything turns");
  addSentence("into the Leet.");
};
const popLetter = () => {
  const lastLetter = letters.pop();
  if (!lastLetter) return;

  x = lastLetter.x;
  y = lastLetter.y;
};
const getSubsequentLetters = (letter: LetterUnit, letterList: LetterUnit[]) =>
  letterList.filter(
    cur => cur.targetY === letter.targetY && cur.targetX > letter.targetX
  );

// ---- reset & initialize ----
export const reset = () => {
  p.background(252);
  drawBackground = storePixels();

  resetCommon();
  clearArea();

  addInitialSentences();
};

export const initialize = (): void => {
  p.textFont(fontName, fontSize);
  const testString = "MMMMMMMMMM";
  const properTextWidth = 223;
  const initialTextWidth = p.textWidth(testString);
  if (Math.floor(initialTextWidth) === properTextWidth) {
    reset();
    initialized = true;
    return;
  }

  const timeout = setInterval(() => {
    const currentTextWidth = p.textWidth(testString);
    if (
      currentTextWidth !== initialTextWidth ||
      currentTextWidth === properTextWidth
    ) {
      reset();
      initialized = true;
      clearInterval(timeout);
    }
  }, 100);

  p.text("Loading...", 100, 100);
};

// ---- draw ----

const updateSketch = () => {
  letters.forEach(Letter.update);

  const pollutedList: {
    index: number;
    value: LetterUnit;
  }[] = [];
  for (let i = 0; i < letters.length; i += 1) {
    const currentLetter = letters[i];
    const polluted = Letter.pollute(currentLetter);
    if (!polluted) continue;

    const xDisplacement = polluted.width - currentLetter.width;
    if (y === polluted.y) x += xDisplacement;

    const shift = (letter: LetterUnit) => {
      letter.targetX += xDisplacement;
    };

    const pollutedLetters = pollutedList.map(element => element.value);
    getSubsequentLetters(currentLetter, letters).forEach(shift);
    getSubsequentLetters(currentLetter, pollutedLetters).forEach(shift);

    pollutedList.push({ index: i, value: polluted });
  }

  for (const polluted of pollutedList)
    letters.splice(polluted.index, 1, polluted.value);
};

const drawTextCursor = () => {
  p.stroke(0, 128 + 127 * Math.sin(p.frameCount * 0.1));
  p.strokeWeight(2);
  p.line(x, y, x, y + fontSize);
};

const drawSketch = () => {
  letters.forEach(Letter.draw);
  drawTextCursor();
};

const draw = (): void => {
  if (!initialized) return;

  updateSketch();

  drawBackground();
  canvas.drawScaled(drawSketch);
};

// ---- UI ----

const keyTyped = () => {
  if (!initialized) return;

  switch (p.keyCode) {
    case p.ENTER:
    case p.RETURN:
    case p.BACKSPACE:
      return false;
  }

  addLetter(p.key);

  return false;
};
const keyPressed = () => {
  if (!initialized) return;

  switch (p.keyCode) {
    case p.ENTER:
    case p.RETURN:
      breakLine();
      break;
    case p.BACKSPACE:
      popLetter();
      break;
    case p.ESCAPE:
      clearArea();
      break;
  }

  return false;
};

// ---- p5 methods ----

export const p5Methods = {
  draw,
  keyTyped,
  keyPressed
};
