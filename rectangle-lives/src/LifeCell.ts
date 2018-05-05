import * as p5ex from 'p5ex';
import LifeGrid from './LifeGrid';

export default class LifeCell extends p5ex.NaiveCell implements p5ex.Steppable {
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
    this.grid.dyingCells.push(this);
  }
}
