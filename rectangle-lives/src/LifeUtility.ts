import parseRle from './parseRle';

export interface LifePattern {
  initialCells: number[];
  cellCountX: number;
  cellCountY: number;
  rule: LifeRule;
}

export interface LifeRule {
  birth: boolean[];
  survival: boolean[];
}

export interface LifeAliveColor {
  red: number;
  green: number;
  blue: number;
}

export interface LifeDyingColor {
  red: (deathRatio: number, yIndex: number, yIndexMax: number) => number;
  green: (deathRatio: number, yIndex: number, yIndexMax: number) => number;
  blue: (deathRatio: number, yIndex: number, yIndexMax: number) => number;
}

export interface LifeColor {
  alive: LifeAliveColor;
  dying: LifeDyingColor;
  background: [number, number, number];
}

export const defaultLifeColor: LifeColor = {
  alive: {
    red: 48,
    green: 48,
    blue: 48,
  },
  dying: {
    red: (deathRatio: number) => { return 192 + deathRatio * 60; },
    green: (deathRatio: number) => { return 192 + deathRatio * 60; },
    blue: (deathRatio: number) => { return 255; },
  },
  background: [252, 252, 255],
};

function parseDigitArray(str: string): number[] {
  return str.replace(/[^\d]/g, '').split('').map(Number);
}

function digitArrayToBooleanArray(digitArray: number[], maxInt: number): boolean[] {
  const booleanArray: boolean[] = Array(maxInt);

  for (let i = 0; i <= maxInt; i += 1) {
    booleanArray[i] = digitArray.indexOf(i) >= 0;
  }

  return booleanArray;
}

export function parseLifeRle(strArray: string[]): LifePattern {
  let rawData = '';

  let headerIsParsed = false;
  let xValue = 100;
  let yValue = 100;
  const ruleValue: LifeRule = {
    birth: digitArrayToBooleanArray([3], 8),
    survival: digitArrayToBooleanArray([2, 3], 8),
  };

  for (let i = 0, len = strArray.length; i < len; i += 1) {
    const strLine = strArray[i];

    if (strLine.charAt(0) === '#') continue;

    if (headerIsParsed) {
      rawData += strLine;
      continue;
    }

    const xExpression = strLine.match(/x\s*=\s*\d+/);
    if (xExpression) {
      const matchedValue = xExpression[0].match(/\d+/);
      if (matchedValue) xValue = parseInt(matchedValue[0], 10);
    }

    const yExpression = strLine.match(/y\s*=\s*\d+/);
    if (yExpression) {
      const matchedValue = yExpression[0].match(/\d+/);
      if (matchedValue) yValue = parseInt(matchedValue[0], 10);
    }

    const ruleExpression = strLine.match(/rule\s*=.*/);
    if (ruleExpression) {
      const birth = ruleExpression[0].match(/B[\s\d]+/);
      if (birth) {
        ruleValue.birth = digitArrayToBooleanArray(parseDigitArray(birth[0]), 8);
      }
      const survival = ruleExpression[0].match(/S[\s\d]+/);
      if (survival) {
        ruleValue.survival = digitArrayToBooleanArray(parseDigitArray(survival[0]), 8);
      }
    }

    headerIsParsed = true;
  }

  return {
    initialCells: parseRle(rawData),
    cellCountX: xValue,
    cellCountY: yValue,
    rule: ruleValue,
  };
}
