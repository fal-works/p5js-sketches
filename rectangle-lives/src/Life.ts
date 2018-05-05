import * as p5ex from 'p5ex';
import { setPixelRange } from './functions';
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

const defaultLifeColor: LifeColor = {
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

export class LifeGrid extends p5ex.Grid<LifeCell> implements p5ex.Sprite {
  readonly cellPixelSize = new p5ex.NumberContainer(1);
  generationIntervalFrameCount = 1;
  generationPreparationFrameCount = 0;
  generationPreparationCellsPerFrame: number;
  cellsToChange: p5ex.LoopableArray<LifeCell>;
  bornCells: p5ex.LoopableArray<LifeCell>;
  dyingCells: p5ex.LoopableArray<LifeCell>;

  protected stepCell: (cell: LifeCell) => void;
  protected prepareNextGeneration: () => void;

  constructor(
    protected readonly p: p5ex.p5exClass,
    public readonly data: LifePattern,
    public readonly color: LifeColor = defaultLifeColor,
    afterImageFrameCount: number = 10,
    marginCells: number = 0,
    torusMode: boolean = false,
  ) {
    super(
      data.cellCountX + 2 * marginCells,
      data.cellCountY + 2 * marginCells,
      1,
      torusMode,
      (neighborRange: number) => { return new LifeCell(p, afterImageFrameCount); },
      new LifeCell(p),
    );

    this.cellsToChange = new p5ex.LoopableArray<LifeCell>(this.cell2DArray.length);
    this.bornCells = new p5ex.LoopableArray<LifeCell>(this.cell2DArray.length);
    this.dyingCells = new p5ex.LoopableArray<LifeCell>(this.cell2DArray.length);

    this.cell2DArray.loop((cell: LifeCell) => {
      cell.grid = this;
      const index = this.getCellIndex(cell);
      cell.xIndex = index.x;
      cell.yIndex = index.y;
    });

    this.updateSize();

    for (let i = 0, len = data.initialCells.length; i < len; i += 2) {
      const cell = this.getCell(
        data.initialCells[i] + marginCells,
        data.initialCells[i + 1] + marginCells,
      );
      if (cell) cell.setAlive();
    }

    this.generationPreparationCellsPerFrame =
      Math.ceil(this.cell2DArray.length / this.generationIntervalFrameCount);

    if (this.generationIntervalFrameCount > 1) {
      this.stepCell = (cell: LifeCell) => {
        cell.step();
      };

      this.prepareNextGeneration = () => {
        const cellArray = this.cell2DArray.array;
        const startIndex =
          this.generationPreparationCellsPerFrame * this.generationPreparationFrameCount;
        const endIndex =
          Math.min(
            this.generationPreparationCellsPerFrame *
            (this.generationPreparationFrameCount + 1),
            this.cell2DArray.length,
          );

        for (let i = startIndex; i < endIndex; i += 1) {
          cellArray[i].determineNextState();
        }

        this.generationPreparationFrameCount += 1;

        if (this.generationPreparationFrameCount >= this.generationIntervalFrameCount) {
          this.cellsToChange.loop(this.gotoNextState);
          this.cellsToChange.clear();
          this.generationPreparationFrameCount = 0;
        }
      };
    } else {
      this.stepCell = (cell: LifeCell) => {
        cell.step();
        cell.determineNextState();
      };

      this.prepareNextGeneration = () => {
        this.cellsToChange.loop(this.gotoNextState);
        this.cellsToChange.clear();
      };
    }
  }

  updateSize(): void {
    this.cellPixelSize.value = Math.floor(
      this.p.pixelDensity() * Math.min(
        this.p.width / this.cell2DArray.xCount,
        this.p.height / this.cell2DArray.yCount,
      ),
    );
  }

  step(): void {
    this.cell2DArray.loop(this.stepCell);
    this.prepareNextGeneration();
  }

  draw(): void {
    this.dyingCells.loop(this.drawDyingCell);
    this.dyingCells.clear();
    this.bornCells.loop(this.drawBornCell);
    this.bornCells.clear();
  }

  protected drawBornCell = (cell: LifeCell) => {
    const pixelSize = this.cellPixelSize.value;
    const color = this.color.alive;
    setPixelRange(
      this.p,
      cell.xIndex * pixelSize,
      cell.yIndex * pixelSize,
      pixelSize,
      color.red,
      color.green,
      color.blue,
    );
  }

  protected drawDyingCell = (cell: LifeCell) => {
    const pixelSize = this.cellPixelSize.value;
    const color = this.color.dying;
    const deathRatio = cell.deathTimer.getProgressRatio();
    setPixelRange(
      this.p,
      cell.xIndex * pixelSize,
      cell.yIndex * pixelSize,
      pixelSize,
      color.red(deathRatio, cell.yIndex, this.cell2DArray.yCount),
      color.green(deathRatio, cell.yIndex, this.cell2DArray.yCount),
      color.blue(deathRatio, cell.yIndex, this.cell2DArray.yCount),
    );
  }

  private gotoNextState(cell: LifeCell): void {
    cell.gotoNextState();
  }
}

export class LifeCell extends p5ex.NaiveCell implements p5ex.Steppable {
  readonly position: p5.Vector;
  readonly deathTimer: p5ex.NonLoopedFrameCounter;
  isAlive: boolean = false;
  protected willBeAlive: boolean = false;
  grid: LifeGrid;
  xIndex: number;
  yIndex: number;

  constructor(
    protected readonly p: p5ex.p5exClass,
    afterImageFrameCount: number = 10,
  ) {
    super(1);
    this.position = p.createVector();
    this.deathTimer = new p5ex.NonLoopedFrameCounter(afterImageFrameCount).off();
  }

  step(): void {
    if (!this.deathTimer.isOn) return;

    this.deathTimer.step();
    this.grid.dyingCells.push(this);
  }

  /**
   * Determines the state of this cell in the next generation.
   * @param rule
   */
  determineNextState(): void {
    // Check birth
    if (!this.isAlive) {
      this.willBeAlive = this.grid.data.rule.birth[this.countAliveNeighbors()];

      if (this.willBeAlive) this.grid.cellsToChange.push(this);

      return;
    }

    // Check survival
    this.willBeAlive = this.grid.data.rule.survival[this.countAliveNeighbors()];

    if (!this.willBeAlive) this.grid.cellsToChange.push(this);
  }

  gotoNextState(): void {
    if (this.willBeAlive) this.setAlive();
    else this.setDead();
  }

  private countAliveNeighbors(): number {
    let aliveNeighborCells = 0;
    const neighborCells = this.neighborCells.array;

    // for (let i = 0, len = this.neighborCells.length; i < len; i += 1) {
    for (let i = 0; i < 9; i += 1) {
      // if (neighborCells[i] === this) continue;
      if (i === 4) continue;
      if ((neighborCells[i] as LifeCell).isAlive) aliveNeighborCells += 1;
    }

    return aliveNeighborCells;
  }

  setAlive(): void {
    if (this.isAlive) return;

    this.deathTimer.resetCount().off();
    this.isAlive = true;
    this.grid.bornCells.push(this);
  }

  setDead(): void {
    if (!this.isAlive) return;

    this.deathTimer.on();
    this.isAlive = false;
  }
}

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
