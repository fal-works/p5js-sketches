import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'BooleanNetwork';
const OPENPROCESSING = false;

if (OPENPROCESSING) new (p5 as any)();

/*
function easeOutInQuad(ratio: number): number {
  return ratio < 0.5 ? p5ex.easeOutQuad(2 * ratio) / 2 : 0.5 + Math.pow(2 * (ratio - 0.5), 2) / 2;
}
*/

function easeInOutQuad(ratio: number): number {
  return ratio < 0.5 ? Math.pow(2 * ratio, 2) / 2 : 0.5 + p5ex.easeOutQuad(2 * (ratio - 0.5)) / 2;
}

// boolean functions

const copyFunction = (input) => { return input[0]; };
const notFunction = (input) => { return !input[0]; }; // not
const andFunction = (input) => { return input[0] && input[1]; };  // and
const orFunction = (input) => { return input[0] || input[1]; };  // or
const nandFunction = (input) => { return !andFunction(input); }; // nand
const norFunction = (input) => { return !orFunction(input); }; // nor
const xorFunction = (input) => { return input[0] ^ input[1]; }; // xor
const xnorFunction = (input) => { return !xorFunction(input); };  // xnor
const andFunction3 = (input) => { return input[0] && input[1] && input[2]; };  // and
const orFunction3 = (input) => { return input[0] || input[1] || input[2]; };  // or
const nandFunction3 = (input) => { return !andFunction3(input); }; // nand
const norFunction3 = (input) => { return !orFunction3(input); }; // nor


class BooleanNode implements p5ex.Sprite {
  public isNull = false;
  public state: boolean = true; // Math.random() < 0.5 ? true : false;
  public readonly predecessorNodes: BooleanNode[] = [];
  public readonly position: p5.Vector;
  protected readonly nodeColor: p5ex.ShapeColor;
  protected readonly markColor: p5ex.ShapeColor;
  protected previousState: boolean = this.state;
  protected booleanFunction = (input: boolean[]) => { return true; };
  protected markScaleFactor = 1;

  constructor(protected readonly p: p5ex.p5exClass) {
    this.position = p.createVector();
    this.nodeColor = new p5ex.ShapeColor(
      p, null, p.color(p5ex.cielchColor(70, 80, p.random(p.TWO_PI))),
    );
    this.markColor = new p5ex.ShapeColor(p, p.color(32), null);
  }

  step(): void {
    const currentCycleFrameCount = this.p.frameCount % this.p.idealFrameRate;
    const progressRatio = currentCycleFrameCount / this.p.idealFrameRate;
    this.markScaleFactor = p5ex.easeOutQuad(
      Math.min(Math.min(progressRatio, 1 - progressRatio) * 5, 1),
    );

    switch (currentCycleFrameCount) {
      case 0:
        const input: boolean[] = [];

        for (const predecessor of this.predecessorNodes) {
          input.push(predecessor.state);
        }

        this.state = this.booleanFunction(input);

        break;
      case 1:
        this.previousState = this.state;
        break;
    }
  }

  draw(): void {
    const p = this.p;
    const position = this.position;

    // this.nodeColor.applyColor();
    // p.ellipse(position.x, position.y, 40, 40);

    this.markColor.applyColor();

    if (this.state) {
      p.strokeWeight(4.5);
      const halfLength = this.markScaleFactor * 12;
      p.line(
        position.x, position.y - halfLength,
        position.x, position.y + halfLength,
      );
    } else {
      p.strokeWeight(4);
      const diameter = this.markScaleFactor * 20;
      p.ellipse(
        position.x, position.y, diameter, diameter,
      );
    }
  }

  setPosition(position: p5.Vector): void {
    this.position.set(position);
  }

  receivesFrom(otherNode: BooleanNode): boolean {
    for (const predecessor of this.predecessorNodes) {
      if (predecessor === otherNode) return true;
    }

    return false;
  }

  setBooleanFunction(): void {
    switch (this.predecessorNodes.length) {
      case 0:
        throw 'Found no predecessor nodes.';
      case 1:
        this.booleanFunction = this.p.random([
          copyFunction,
          notFunction,
        ]);
        break;
      case 2:
        this.booleanFunction = this.p.random([
          andFunction,
          orFunction,
          nandFunction,
          norFunction,
          xorFunction,
          xorFunction,
          xnorFunction,
          xnorFunction,
        ]);
        break;
      default:
        this.booleanFunction = this.p.random([
          andFunction3,
          orFunction3,
          nandFunction3,
          norFunction3,
        ]);
        break;
    }
  }
}

class BooleanEdge implements p5ex.Sprite {
  protected readonly lineColor: p5.Color;
  protected readonly onColor: p5ex.ShapeColor;
  protected readonly offColor: p5ex.ShapeColor;
  protected readonly startPoint: p5.Vector;
  protected readonly endPoint: p5.Vector;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly nodeA: BooleanNode,
    protected readonly nodeB: BooleanNode,
  ) {
    this.lineColor = p.color(32);
    this.onColor = new p5ex.ShapeColor(p, null, p.color(96, 192, 96));
    this.offColor = new p5ex.ShapeColor(p, null, p.color(128, 128, 192));
    this.startPoint = p.createVector();
    this.endPoint = p.createVector();
  }

  updatePosition(): void {
    const A = this.nodeA.position;
    const B = this.nodeB.position;
    const angle = p5ex.getDirectionAngle(A, B);
    const offset = 35;
    this.startPoint.set(
      A.x + offset * Math.cos(angle),
      A.y + offset * Math.sin(angle),
    );
    this.endPoint.set(
      B.x - offset * Math.cos(angle),
      B.y - offset * Math.sin(angle),
    );
  }

  step(): void {
  }

  draw(): void {
    this.p.stroke(this.lineColor);
    this.p.strokeWeight(1);
    this.p.line(
      this.startPoint.x, this.startPoint.y,
      this.endPoint.x, this.endPoint.y,
    );

    const currentCycleFrameCount = this.p.frameCount % this.p.idealFrameRate;

    if (currentCycleFrameCount === 0) return;

    const progressRatio = currentCycleFrameCount / this.p.idealFrameRate;
    const easingRatio = easeInOutQuad(progressRatio);
    const alphaRatio = Math.sin(Math.PI * progressRatio);
    const size = alphaRatio * 8;

    const x = this.p.lerp(this.startPoint.x, this.endPoint.x, easingRatio);
    const y = this.p.lerp(this.startPoint.y, this.endPoint.y, easingRatio);

    if (this.nodeA.state) this.onColor.applyColor(); else this.offColor.applyColor();

    this.p.ellipse(x, y, size, size);
  }
}



const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundPixels: number[];
  let timeoutId = -1;
  const booleanNodes = new p5ex.SpriteArray<BooleanNode>(16);
  const booleanEdges = new p5ex.SpriteArray<BooleanEdge>();

  function getNearestNode(
    booleanNodes: p5ex.TwoDimensionalArray<BooleanNode>, xIndex: number, yIndex: number,
    xIndexChange: 1 | 0 | -1, yIndexChange: 1 | 0 | -1, shallow: boolean = false,
  ): BooleanNode | null {
    let result: BooleanNode | null = null;
    let currentXIndex = xIndex;
    let currentYIndex = yIndex;

    while (result === null) {
      currentXIndex += xIndexChange;

      if (currentXIndex < 0 || currentXIndex >= booleanNodes.xCount) break;

      currentYIndex += yIndexChange;

      if (currentYIndex < 0 || currentYIndex >= booleanNodes.yCount) break;

      const currentNode = booleanNodes.get2D(currentXIndex, currentYIndex);

      if (currentNode.isNull) continue;

      result = currentNode;
    }

    return result;
  }

  function getNearestNodes(
    booleanNodes: p5ex.TwoDimensionalArray<BooleanNode>, xIndex: number, yIndex: number,
  ): BooleanNode[] {
    const result: BooleanNode[] = [];

    const indexSet: [1 | 0 | -1, 1 | 0 | -1][] = [
      [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
    ];

    for (const index of indexSet) {
      const nearestNode = getNearestNode(booleanNodes, xIndex, yIndex, index[0], index[1]);
      if (nearestNode) result.push(nearestNode);
    }

    return result;
  }

  function createNetwork(xCount = 5, yCount = 5, nullCount = 7): boolean {
    booleanNodes.clear();
    booleanEdges.clear();

    const nodeCandidates = new p5ex.TwoDimensionalArray<BooleanNode>(
      xCount, yCount, new BooleanNode(p),
    );

    for (let i = 0; i < nodeCandidates.length; i += 1) {
      nodeCandidates.array[i] = new BooleanNode(p);
    }

    const nullNodeCandidates = nodeCandidates.array.slice(0, nodeCandidates.length);

    for (let i = 0; i < nullCount; i += 1) {
      p5ex.popRandom(nullNodeCandidates).isNull = true;
    }

    for (let i = 0; i < xCount; i += 1) {
      const x = (1 + i) * (p.nonScaledWidth / (xCount + 1));

      for (let k = 0; k < yCount; k += 1) {
        const currentNode = nodeCandidates.get2D(i, k);

        if (currentNode.isNull) continue;

        const y = (1 + k) * (p.nonScaledHeight / (yCount + 1));
        currentNode.setPosition(p.createVector(x, y));

        const predecessorCandidates = getNearestNodes(nodeCandidates, i, k);

        const requiredPredecessorCount = Math.min(
          p.random([1, 2, 3]),
          predecessorCandidates.length,
        );

        while (currentNode.predecessorNodes.length < requiredPredecessorCount) {
          if (predecessorCandidates.length <= 0) return false;  // for safety; not necessary

          const predecessor = p5ex.popRandom(predecessorCandidates);
          const newEdge = new BooleanEdge(p, predecessor, currentNode);

          if (predecessor.receivesFrom(currentNode)) continue;

          currentNode.predecessorNodes.push(predecessor);
          booleanEdges.push(newEdge);
        }

        booleanNodes.push(currentNode);
      }
    }

    return true;
  }

  function resetNetwork(): void {
    let retryCount = 0;

    while (!createNetwork()) {
      retryCount += 1;
      if (retryCount > 1000) throw 'Could not create a valid boolean network.';
    }

    booleanNodes.loop((n) => { n.setBooleanFunction(); });
    booleanEdges.loop((e) => { e.updatePosition(); });
  }

  function reset(): void {
    p.background(255);
    p5ex.gradationBackground(p, p.color(255), p.color(255), p.color(248, 248, 252), 2);
    p.loadPixels();
    backgroundPixels = p.pixels;

    resetNetwork();
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    if (OPENPROCESSING) (window as any).noCanvas();

    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.setFrameRate(60);
    p.rectMode(p.CENTER);

    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    booleanNodes.step();
    booleanEdges.step();
    booleanEdges.draw();
    booleanNodes.draw();

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();

    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => { reset(); },
      200,
    );
  };

  p.mouseClicked = () => {
    resetNetwork();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
