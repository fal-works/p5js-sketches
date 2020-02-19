import * as p5ex from "@fal-works/p5-extension";
import { p, Random, ShapeColor, setRenderer } from "./common";
import { fontName, fontSize } from "./settings";
import { Leet } from "./leet";

export type LetterUnit = {
  readonly value: string;
  readonly width: number;
  readonly isSpace: boolean;
  readonly polluted: boolean;
  readonly frequency: number;
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  draw: (x: number, y: number) => void;
  frameCount: number;
  shakeValue: number;
  isAlive: boolean;
};

export const Letter = (() => {
  const emptyFunction = () => {};

  const createLetterGraphics = (value: string, color: p5ex.ShapeColor.Unit) => {
    p.textFont(fontName, fontSize);
    const width = Math.max(fontSize, p.textWidth(value) + 10);
    const height = 1.3 * fontSize;

    const g = p.createGraphics(width, height);
    g.textFont(fontName, fontSize);

    setRenderer(g);
    ShapeColor.apply(color, 255);
    setRenderer(p);

    g.text(value, 0, fontSize);

    return g;
  };

  const defaultColor = ShapeColor.create(null, "#202020", 1);
  const pollutedColor = ShapeColor.create(null, "#ff0099", 1);

  const createDraw = (value: string, polluted: boolean): LetterUnit["draw"] => {
    const color = polluted ? pollutedColor : defaultColor;
    const graphics = createLetterGraphics(value, color);

    return (x, y) => p.image(graphics, x, y);
  };

  const create = (
    x: number,
    y: number,
    value: string,
    polluted = false
  ): LetterUnit => {
    const width = p.textWidth(value);
    const isSpace = value === " ";

    const draw: LetterUnit["draw"] = !isSpace
      ? createDraw(value, polluted)
      : emptyFunction;

    return {
      value,
      width,
      isSpace,
      polluted,
      frequency: Random.between(0.03, 0.07),
      x,
      y,
      targetX: x,
      targetY: y,
      draw,
      frameCount: 0,
      shakeValue: polluted ? 50 : 0,
      isAlive: true
    };
  };

  const pollute = (letter: LetterUnit) => {
    if (letter.polluted || letter.isSpace || letter.frameCount < 90)
      return undefined;

    if (Random.bool(0.999)) return undefined;

    const newValue = Leet.convertRandom(letter.value.toLowerCase());
    if (!newValue) return undefined;

    letter.isAlive = false;

    return create(letter.targetX, letter.targetY, newValue, true);
  };

  const update = (letter: LetterUnit) => {
    letter.frameCount += 1;
    letter.x += 0.1 * (letter.targetX - letter.x);
    letter.y += 0.1 * (letter.targetY - letter.y);
    letter.shakeValue *= 0.9;
  };

  const draw = (letter: LetterUnit) => {
    const { x, y, shakeValue, draw: drawAt, frequency, frameCount } = letter;
    const actualY = y + 5 * Math.sin(frameCount * frequency);

    if (shakeValue < 1) drawAt(x, actualY);
    else
      drawAt(
        x + Random.signed(shakeValue),
        actualY + Random.signed(shakeValue)
      );
  };

  const isAlive = (letter: LetterUnit) => letter.isAlive;

  const exists = (
    letter: LetterUnit | undefined | null
  ): letter is LetterUnit => !!letter;

  return {
    create,
    update,
    draw,
    pollute,
    isAlive,
    exists,
    defaultColor
  };
})();
