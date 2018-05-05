import * as p5ex from 'p5ex';
import LifeCell from './LifeCell';
import { LifePattern, LifeColor, defaultLifeColor } from './LifeUtility';
import { setPixelRange } from './functions';

export default class LifeGrid extends p5ex.Grid<LifeCell> implements p5ex.Sprite {
  readonly cellPixelSize = new p5ex.NumberContainer(1);
  cellsToChange: p5ex.LoopableArray<LifeCell>;
  bornCells: p5ex.LoopableArray<LifeCell>;
  dyingCells: p5ex.LoopableArray<LifeCell>;

  protected stepCell: (cell: LifeCell) => void;
  protected gotoNextGeneration: () => void;

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

    this.stepCell = (cell: LifeCell) => {
      cell.step();
      cell.determineNextState();
    };

    this.gotoNextGeneration = () => {
      this.cellsToChange.loop(this.gotoNextState);
      this.cellsToChange.clear();
    };
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
    this.gotoNextGeneration();
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
