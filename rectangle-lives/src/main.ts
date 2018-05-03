import * as p5ex from 'p5ex';
import parseRle from './parseRle';

(p5 as any).disableFriendlyErrors = true;

function setPixelRange(
  graphics: p5 | p5.Graphics,
  x: number,
  y: number,
  size: number,
  red: number,
  green: number,
  blue: number,
) {
  const g = graphics as any;
  const w = g.width * g.pixelDensity();

  for (let i = 0; i < size; i += 1) {
    for (let j = 0; j < size; j += 1) {
      const idx = 4 * ((y + j) * w + (x + i));
      g.pixels[idx] = red;
      g.pixels[idx + 1] = green;
      g.pixels[idx + 2] = blue;
    }
  }
}

class LifeGrid extends p5ex.Grid<LifeCell> {
  readonly cellPixelSize = new p5ex.NumberContainer(1);
  generationIntervalFrameCount = 1;
  generationPreparationFrameCount = 0;
  generationPreparationCellsPerFrame: number;
  cellCountLevel: number;

  constructor(protected readonly p: p5ex.p5exClass, cellsData: number[], marginCellCount: number) {
    super(
      Math.max(...cellsData) + 1 + 2 * marginCellCount,
      Math.max(...cellsData) + 1 + 2 * marginCellCount,
      1,
      false,
      (neighborRange: number) => { return new LifeCell(p); },
      new LifeCell(p),
    );

    this.cellCountLevel = Math.max(...cellsData) + 1 + 2 * marginCellCount;
    this.updateSize();

    for (let i = 0, len = cellsData.length; i < len; i += 2) {
      const cell = this.getCell(
        cellsData[i] + marginCellCount,
        cellsData[i + 1] + marginCellCount,
      );
      if (cell) cell.setAlive();
    }

    this.generationPreparationCellsPerFrame =
      Math.ceil(this.cell2DArray.length / this.generationIntervalFrameCount);
  }

  updateSize(): void {
    this.cellPixelSize.value = Math.floor(
      this.p.pixelDensity() * Math.min(this.p.width, this.p.height) / this.cellCountLevel,
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
      this.cell2DArray.get(i).determineNextState();
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

class LifeCell extends p5ex.NaiveCell {
  readonly position: p5.Vector;
  readonly deathTimer: p5ex.NonLoopedFrameCounter;
  birthIndicator: boolean = false;
  isAlive: boolean = false;
  protected willBeAlive: boolean = false;

  constructor(
    protected readonly p: p5ex.p5exClass,
  ) {
    super(1);
    this.position = p.createVector();
    this.deathTimer = new p5ex.NonLoopedFrameCounter(Math.floor(p.idealFrameRate / 3)).off();
  }

  step(): void {
    this.deathTimer.step();
  }

  determineNextState(): void {
    const aliveNeighborsCount = this.countAliveNeighbors();

    if (!this.isAlive) {
      this.willBeAlive = (aliveNeighborsCount === 3);
    } else {
      this.willBeAlive = (aliveNeighborsCount === 2 || aliveNeighborsCount === 3);
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

const rectangleLives = (
  rlePath: string,
  marginCellCount: number = 1,
  htmlElementId: string = 'RectangleLives',
) => {
  // const SKETCH_NAME = 'RectangleLives';
  const OPENPROCESSING = true;

  if (OPENPROCESSING) new (p5 as any)();

  const sketch = (p: p5ex.p5exClass) => {
    // ---- constants

    // ---- variables
    let initialCellsData: number[];
    let grid: LifeGrid;

    // ---- functions
    function parse(strArray: string[]) {
      let rawData = '';

      for (const strLine of strArray) {
        const firstChar = strLine.charAt(0);

        if (firstChar === '#' || firstChar === 'x') continue;

        rawData += strLine;
      }

      initialCellsData = parseRle(rawData);
    }

    // ---- Setup & Draw etc.
    p.preload = () => {
      console.log('Loading ' + rlePath + ' ...');

      p.loadStrings(rlePath, (strArray: string[]) => {
        console.log('Loaded.');
        console.log('Parsing ' + rlePath + ' ...');
        parse(strArray);
        console.log('Parsed.');
      });
    };

    p.setup = () => {
      if (OPENPROCESSING) (window as any).noCanvas();
      p.createScalableCanvas(
        p5ex.ScalableCanvasTypes.FULL,
      );

      p.setFrameRate(30);

      p.noStroke();

      grid = new LifeGrid(p, initialCellsData, marginCellCount);

      p.background(252, 252, 255);
      p.loadPixels();
    };

    p.draw = () => {
      // p.scalableCanvas.scale();

      grid.step();
      grid.draw();
      p.updatePixels();

      // p.scalableCanvas.cancelScale();
    };

    p.windowResized = () => {
      // p.resizeScalableCanvas();
    };

    p.mousePressed = () => {
    };

    p.touchMoved = () => {
      // return false;
    };
  };

  new p5ex.p5exClass(sketch, htmlElementId);

};

export default rectangleLives;
