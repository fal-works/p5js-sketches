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

export class LifeGrid extends p5ex.Grid<LifeCell> {
  readonly cellPixelSize = new p5ex.NumberContainer(1);
  generationIntervalFrameCount = 1;
  generationPreparationFrameCount = 0;
  generationPreparationCellsPerFrame: number;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly data: LifePattern,
  ) {
    super(
      data.cellCountX,
      data.cellCountY,
      1,
      false,
      (neighborRange: number) => { return new LifeCell(p); },
      new LifeCell(p),
    );

    this.updateSize();

    for (let i = 0, len = data.initialCells.length; i < len; i += 2) {
      const cell = this.getCell(
        data.initialCells[i],
        data.initialCells[i + 1],
      );
      if (cell) cell.setAlive();
    }

    this.generationPreparationCellsPerFrame =
      Math.ceil(this.cell2DArray.length / this.generationIntervalFrameCount);
  }

  updateSize(): void {
    this.cellPixelSize.value = Math.floor(
      this.p.pixelDensity() * Math.min(
        this.p.width / this.data.cellCountX,
        this.p.height / this.data.cellCountY,
      ),
    );
  }

  step(): void {
    this.cell2DArray.loop(this.stepCell);

    this.prepareNextGeneration();
  }

  protected prepareNextGeneration(): void {
    for (
      let i = this.generationPreparationCellsPerFrame * this.generationPreparationFrameCount,
        len = Math.min(
        this.generationPreparationCellsPerFrame * (this.generationPreparationFrameCount + 1),
        this.cell2DArray.length,
      );
      i < len;
      i += 1
    ) {
      this.cell2DArray.get(i).determineNextState(this.data.rule);
    }

    this.generationPreparationFrameCount += 1;

    if (this.generationPreparationFrameCount >= this.generationIntervalFrameCount) {
      this.cell2DArray.loop(this.gotoNextState);
      this.generationPreparationFrameCount = 0;
    }
  }

  draw(): void {
    this.cell2DArray.loop(this.drawCell);
  }

  private stepCell(cell: LifeCell): void {
    cell.step();
  }

  drawCell = (cell: LifeCell) => {
    const index = this.getCellIndex(cell);
    cell.draw(
      index.x,
      index.y,
      this.cellPixelSize.value,
    );
  }

  private gotoNextState(cell: LifeCell): void {
    cell.gotoNextState();
  }
}

export class LifeCell extends p5ex.NaiveCell {
  readonly position: p5.Vector;
  readonly deathTimer: p5ex.NonLoopedFrameCounter;
  isAlive: boolean = false;
  protected willBeAlive: boolean = false;
  protected birthIndicator: boolean = false;

  constructor(
    protected readonly p: p5ex.p5exClass,
    afterImage: boolean = true,
  ) {
    super(1);
    this.position = p.createVector();
    this.deathTimer = new p5ex.NonLoopedFrameCounter(
      afterImage ? Math.floor(p.idealFrameRate / 3) : 1,
    ).off();
  }

  step(): void {
    this.deathTimer.step();
  }

  determineNextState(rule: LifeRule): void {
    const aliveNeighborsCount = this.countAliveNeighbors();

    if (!this.isAlive) {
      this.willBeAlive = rule.birth[aliveNeighborsCount];
    } else {
      this.willBeAlive = rule.survival[aliveNeighborsCount];
    }
  }

  gotoNextState(): void {
    if (this.willBeAlive) this.setAlive();
    else this.setDead();
  }

  draw(xIndex: number, yIndex: number, pixelSize: number): void {
    let colorValue: number[];

    if (this.birthIndicator) colorValue = [48, 48, 48];
    else if (this.deathTimer.isOn) {
      const ratio = this.deathTimer.getProgressRatio();
      colorValue = [
        224 + Math.floor(ratio * 28),
        224 + Math.floor(ratio * 28),
        255,
      ];
    }
    else return;

    setPixelRange(
      this.p,
      xIndex * pixelSize,
      yIndex * pixelSize,
      pixelSize,
      colorValue[0],
      colorValue[1],
      colorValue[2],
    );

    this.birthIndicator = false;
  }

  private countAliveNeighbors(): number {
    let aliveNeighborCells = 0;

    for (let i = 0, len = this.neighborCells.length; i < len; i += 1) {
      if (this.neighborCells.get(i) === this) continue;
      if ((this.neighborCells.get(i) as LifeCell).isAlive) aliveNeighborCells += 1;
    }

    return aliveNeighborCells;
  }

  setAlive(): void {
    if (this.isAlive) return;

    this.deathTimer.resetCount().off();
    this.isAlive = true;
    this.birthIndicator = true;
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
