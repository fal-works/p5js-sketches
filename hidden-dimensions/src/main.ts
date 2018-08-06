import * as p5ex from 'p5ex';

const SKETCH_NAME = 'HiddenDimensions';

class NoiseArray implements p5ex.Steppable {
  public array: number[];
  private nextNoiseX: number;

  constructor(
    protected readonly p: p5,
    protected readonly noiseScale: number,
    public readonly length: number,
    protected readonly maxValue: number,
  ) {
    this.array = [];

    this.nextNoiseX = p.random(256);

    for (let i = 0; i < length; i += 1) {
      this.addNextValue();
    }
  }

  step() {
    this.array.shift();
    this.addNextValue();
  }

  slice(threshold: number): number[][] {
    const sliced: number[][] = [];
    let off = true;

    for (let x = 0; x < this.length; x += 1) {
      if (off) {
        if (this.array[x] >= threshold) {
          sliced.push([x]);
          off = false;
        }
      } else {
        if (this.array[x] < threshold) {
          sliced[sliced.length - 1].push(x - 1);
          off = true;
        }
      }
    }

    if (sliced.length >= 1 && sliced[sliced.length - 1].length === 1)
      sliced[sliced.length - 1].push(this.length - 1);

    return sliced;
  }

  private addNextValue(): void {
    this.array.push(this.p.noise(this.nextNoiseX) * this.maxValue);
    this.nextNoiseX += this.noiseScale;
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  let backgroundPixels: number[];
  let timeoutId: number = -1;

  const pointSize: number = 5;
  let firstNoiseArray: NoiseArray;
  let secondNoiseArray: NoiseArray;
  let lineColor: p5ex.ShapeColor;
  let fillColor: p5ex.ShapeColor;
  let guideLineColor: p5ex.ShapeColor;
  let level;

  // ---- functions
  function reset(): void {
    p.background(backgroundColor);

    p.loadPixels();
    backgroundPixels = p.pixels;

    firstNoiseArray = new NoiseArray(p, 0.015, 240, 240);
    secondNoiseArray = new NoiseArray(p, 0.03, 240, 240);

    level = 0;
  }


  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.rectMode(p.CORNERS);
    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('Verdana', 16);

    backgroundColor = p.color(248, 248, 248);

    lineColor = new p5ex.ShapeColor(p, p.color(32), null);
    fillColor = new p5ex.ShapeColor(p, null, p.color(48));
    guideLineColor = new p5ex.ShapeColor(p, p.color(224), null);

    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    p.scalableCanvas.scale();

    const threshold = firstNoiseArray.array[0];
    const sliced = secondNoiseArray.slice(threshold);
    const thresholdPositionY = 240 - threshold;

    // Area 0
    p.translate(40, 40);

    fillColor.applyColor();

    for (const lineSegment of sliced) {
      p.rect(lineSegment[0], 100, lineSegment[1], 140);
    }

    // Area 1
    p.translate(0, 240);

    if (level >= 1) {
      guideLineColor.applyColor();

      for (const lineSegment of sliced) {
        p.line(lineSegment[0], -240 + 140, lineSegment[0], thresholdPositionY);
        p.line(lineSegment[1] - 1, -240 + 140, lineSegment[1] - 1, thresholdPositionY);
      }

      lineColor.applyColor();
      p.line(-10, 240, 240, 240);
      p.line(0, 0, 0, 250);
      p.beginShape();

      for (let x = 0; x < secondNoiseArray.length; x += 1) {
        p.vertex(x, 240 - secondNoiseArray.array[x]);
      }

      p.endShape();

      if (level >= 2 && sliced.length >= 1) {
        guideLineColor.applyColor();
        p.line(0, thresholdPositionY, 320 - 1, thresholdPositionY);
      }

      lineColor.applyColor();

      for (const lineSegment of sliced) {
        p.line(lineSegment[0], thresholdPositionY, lineSegment[1], thresholdPositionY);
      }
    } else {
      fillColor.applyColor();
      p.text('Click!', 120, 120);
    }

    // Area 2
    p.translate(320, 0);

    if (level >= 2) {
      lineColor.applyColor();
      p.line(-10, 240, 240, 240);
      p.line(0, 0, 0, 250);
      p.beginShape();

      for (let x = 0; x < firstNoiseArray.length; x += 1) {
        p.vertex(x, 240 - firstNoiseArray.array[x]);
      }

      p.endShape();

      fillColor.applyColor();
      p.ellipse(0, 240 - firstNoiseArray.array[0], pointSize, pointSize);
    } else if (level === 1) {
      fillColor.applyColor();
      p.text('Click!', 120, 120);
    }

    // Area 3
    p.translate(0, -240);

    if (level === 2) {
      fillColor.applyColor();
      p.text('Click to reset.', 120, 120);
    }

    p.scalableCanvas.cancelScale();

    firstNoiseArray.step();
  };


  p.windowResized = () => {
    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(
      () => {
        p.resizeScalableCanvas();
        reset();
      },
      200,
    );
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    // if (p.mouseButton === p.RIGHT) p.noLoop();

    level += 1;

    if (level > 2) reset();
  };

  p.keyTyped = () => {
    // if (p.key === 's') p.saveCanvas('image', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
