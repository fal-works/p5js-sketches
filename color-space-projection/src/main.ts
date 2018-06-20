import * as p5ex from 'p5ex';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'ColorSpaceProjection';

class CielchColor {
  lValue: number = 0;
  cValue: number = 0;
  hValue: number = 0;
  isChanged: boolean = true;
  private p5Color: p5.Color;

  constructor(protected readonly p: p5ex.p5exClass) {
    this.p5Color = p.color(0);
  }

  toP5Color(): p5.Color {
    if (this.isChanged) {
      this.p5Color = this.p.color(p5ex.cielchColor(this.lValue, this.cValue, this.hValue));
      this.isChanged = false;
    }

    return this.p5Color;
  }

  setRandomLC(): void {
    const p = this.p;
    const theta = p.random(-0.25 * p.HALF_PI, p.HALF_PI);
    this.lValue = 50 + 50 * Math.sin(theta);
    this.cValue = p.random(0.5, 1) * 120 * Math.cos(theta);
  }
}

class TransitionableCielchColor implements p5ex.Steppable {
  currentColor: CielchColor;
  targetColor: CielchColor;

  constructor(protected readonly p: p5ex.p5exClass) {
    this.currentColor = new CielchColor(p);
    this.targetColor = new CielchColor(p);
  }

  step(): void {
    this.currentColor.lValue += 0.05 * (this.targetColor.lValue - this.currentColor.lValue);
    this.currentColor.cValue += 0.05 * (this.targetColor.cValue - this.currentColor.cValue);
    this.currentColor.hValue += 0.05 * (this.targetColor.hValue - this.currentColor.hValue);
    this.currentColor.isChanged = true;
  }

  setTargetHue(hue: number): void {
    this.targetColor.hValue = (hue + this.p.TWO_PI) % this.p.TWO_PI;
  }
  setRandomTargetLC(): void {
    this.targetColor.setRandomLC();
  }
}

class ColorSet implements p5ex.Sprite
{
  colors: TransitionableCielchColor[] = [];
  lineColor: p5.Color;
  guideLineLightColor: p5ex.ShapeColor;
  guideLineDarkColor: p5ex.ShapeColor;
  guideFillColor: p5ex.ShapeColor;
  colorIndex: number = 0;
  textColor: p5.Color;
  autoChange = true;

  constructor(protected readonly p: p5ex.p5exClass) {
    for (let i = 0; i < 3; i += 1) {
      const newColor = new TransitionableCielchColor(p);
      newColor.setRandomTargetLC();
      newColor.setTargetHue(p5ex.randomInt(12) * p.TWO_PI / 12);
      this.colors.push(newColor);
    }

    this.lineColor = p.color(80);
    this.guideLineLightColor = new p5ex.ShapeColor(p, p.color(0, 24), null);
    this.guideLineDarkColor = new p5ex.ShapeColor(p, p.color(0, 48), null);
    this.guideFillColor = new p5ex.ShapeColor(p, null, p.color(0, 24), true);
    this.textColor = p.color(80);
  }

  addHue(): void {
    for (const c of this.colors) {
      c.setTargetHue(c.targetColor.hValue + this.p.radians(30));
    }
  }

  subtractHue(): void {
    for (const c of this.colors) {
      c.setTargetHue(c.targetColor.hValue - this.p.radians(30));
    }
  }

  setRandomLC(): void {
    for (const c of this.colors) {
      c.setRandomTargetLC();
    }
  }

  changeColor(): void {
    const index = this.colorIndex;
    this.colors[index].setRandomTargetLC();

    const colorToChange = this.colors[index];
    const otherHue1 = this.colors[(index + 1) % 3].targetColor.hValue;
    const otherHue2 = this.colors[(index + 2) % 3].targetColor.hValue;

    let newHue: number = 0;
    const TWO_PI = this.p.TWO_PI;
    const rad = this.p.radians;

    for (let i = 0, maxRep = 1000; i < maxRep; i += 1) {
      const hueDifference = rad(this.p.random([30, 120, 150, 180]));
      newHue = (otherHue1 + p5ex.randomSign(hueDifference) + TWO_PI) % TWO_PI;

      if (Math.abs(newHue - otherHue2) < rad(15)) continue;

      if (Math.abs(newHue - otherHue2 + rad(60)) % TWO_PI < rad(15)) continue;

      if (Math.abs(newHue - otherHue2 - rad(60)) % TWO_PI < rad(15)) continue;

      if (Math.abs(newHue - colorToChange.targetColor.hValue) < rad(75)) continue;

      break;
    }

    colorToChange.setTargetHue(newHue);

    this.colorIndex = (index + 1) % 3;
  }

  step(): void {
    for (const c of this.colors) { c.step(); }

    if (this.autoChange && this.p.frameCount % 120 === 0) this.changeColor();
  }

  drawTimer(): void {
    const p = this.p;

    for (let i = 0, len = 60; i < len; i += 1) {
      const angle = p.TWO_PI * i / len - p.HALF_PI;
      const ratio = p.sq(1 - ((p.frameCount + (this.autoChange ? 1 * (len - i) : 0)) % 60) / 60);
      this.guideFillColor.applyColor((this.autoChange ? 1 : 0.5) * ratio * 255);
      const size = ratio * 8;
      p.ellipse(140 * Math.cos(angle), 140 * Math.sin(angle), size, size);
    }
  }

  drawColorInfo(): void {
    const p = this.p;
    let y = 200;

    p.noStroke();

    for (const c of this.colors) {
      const p5col = c.currentColor.toP5Color();
      p.fill(p5col);
      p.rect(-105, y - 8, 30, 30, 3);
      p.fill(0);
      const colorString = '#' +
        p.nf(Math.round(p.red(p5col)).toString(16), 2) +
        p.nf(Math.round(p.green(p5col)).toString(16), 2) +
        p.nf(Math.round(p.blue(p5col)).toString(16), 2);
      p.text(colorString, -80, y);

      y += 40;
    }
  }

  draw(): void {
    const p = this.p;
    p.strokeWeight(1);

    this.guideLineLightColor.applyColor();
    p.ellipse(0, 0, 240, 240);
    p.line(-120, 0, -120, -250);
    p.line(120, 0, 120, -250);
    p.line(-130, -150, 130, -150);

    p.line(150, -150, 280, -150);
    p.line(160, -250, 160, -140);
    p.arc(160, -200, 240, 100, -p.HALF_PI, p.HALF_PI);

    p.line(-5, 0, 5, 0);
    p.line(0, -5, 0, 5);

    this.drawTimer();

    this.guideLineDarkColor.applyColor();
    p.beginShape();

    for (const c of this.colors) {
      const col = c.currentColor;
      const angle = col.hValue;
      const cosine = Math.cos(angle);
      const sine = Math.sin(angle);
      const x = col.cValue * cosine;
      const y = col.cValue * sine;
      p.strokeWeight(1);
      // p.line(0, 0, x, y);
      p.line(x, y, x, -150 - col.lValue);
      p.line(x, -150 - col.lValue, 160 + col.cValue, -150 - col.lValue);
      p.vertex(x, y);

      p.strokeWeight(2);
      p.line(118 * cosine, 118 * sine, 128 * cosine, 128 * sine);
      p.line(-128, -150 - col.lValue, -118, -150 - col.lValue);
      p.line(152, -150 - col.lValue, 162, -150 - col.lValue);
      p.line(160 + col.cValue, -142, 160 + col.cValue, -152);
    }

    p.strokeWeight(1);
    p.stroke(this.lineColor);
    p.noFill();
    p.endShape(p.CLOSE);

    for (const c of this.colors) {
      const col = c.currentColor;
      const angle = col.hValue;
      const x = col.cValue * Math.cos(angle);
      const y = col.cValue * Math.sin(angle);
      p.fill(col.toP5Color());
      p.ellipse(x, y, 10, 10);
      p.ellipse(x, -150 - col.lValue, 10, 10);
      p.ellipse(160 + col.cValue, -150 - col.lValue, 10, 10);
    }

    this.drawColorInfo();
  }
}

class Tile extends p5ex.PhysicsBody implements p5ex.Sprite {
  drawer: p5ex.Drawer;
  rotation: p5ex.AngleQuantity;
  borderColor: p5.Color;

  constructor(
    protected readonly p: p5ex.p5exClass,
    protected readonly color: CielchColor,
    protected readonly region: p5ex.RectangleRegion,
  ) {
    super();

    this.position.set(
      p.random(region.leftPositionX, region.rightPositionX),
      p.random(region.topPositionY, region.bottomPositionY),
    );
    this.velocity.set(70 * p.unitSpeed, 0).rotate(p.random(p.TWO_PI));
    this.setFriction(0);

    this.rotation = new p5ex.AngleQuantity(p.random(p.TWO_PI), p5ex.randomSign(p.unitAngleSpeed));
    this.drawer = new p5ex.Drawer(
      p,
      {
        draw() { p.rect(0, 0, 15, 15, 3); },
      },
      {
        positionRef: this.position,
        rotationAngleRef: this.rotation.angleReference,
      },
    );

    this.borderColor = p.color(32, 192);
  }

  step(): void {
    super.step();
    this.rotation.step();

    const region = this.region;
    if (this.x < region.leftPositionX || this.x > region.rightPositionX) this.velocity.x *= -1;
    if (this.y < region.topPositionY || this.y > region.bottomPositionY) this.velocity.y *= -1;
    region.constrain(this.position);
  }

  draw(): void {
    this.p.stroke(this.borderColor);
    this.p.fill(this.color.toP5Color());
    this.drawer.draw();
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundPixels: number[];
  let timeoutId = -1;
  let loop = true;
  let backgroundColor: p5.Color;
  let colorSet: ColorSet;
  let tiles: p5ex.SpriteArray<Tile>;
  let region: p5ex.RectangleRegion;
  let darkRegionColor: p5.Color;

  // ---- functions
  function reset() {
    p.background(backgroundColor);
    p.loadPixels();
    backgroundPixels = p.pixels;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    p.textFont('Courier', 18);
    p.rectMode(p.CENTER);
    backgroundColor = p.color(255);
    colorSet = new ColorSet(p);

    region = new p5ex.RectangleRegion(45, 180, 360, 285);
    tiles = new p5ex.SpriteArray<Tile>();

    for (let i = 0; i < 40; i += 1) {
      tiles.push(new Tile(p, p.random(colorSet.colors).currentColor, region));
    }

    darkRegionColor = p.color(32);

    reset();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();
    p.scalableCanvas.scale();

    p.translate(0.3 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);

    colorSet.step();
    colorSet.draw();

    p.strokeWeight(1);
    p.rectMode(p.CORNER);
    p.stroke(darkRegionColor);
    p.noFill();
    p.rect(
      region.leftPositionX, region.topPositionY,
      0.5 * region.width, region.height,
    );
    p.noStroke();
    p.fill(darkRegionColor);
    p.rect(
      region.leftPositionX + 0.5 * region.width, region.topPositionY,
      0.5 * region.width, region.height,
    );
    p.rectMode(p.CENTER);
    tiles.step();
    tiles.draw();

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
    if (loop) p.noLoop(); else p.loop();
    loop = !loop;
  };

  p.keyTyped = () => {
    switch (p.key) {
      case ' ':
        colorSet.autoChange = !colorSet.autoChange;
        return false;
      case 'a':
        colorSet.subtractHue();
        break;
      case 'd':
        colorSet.addHue();
        break;
      case 'w':
        colorSet.changeColor();
        return false;
      case 's':
        colorSet.setRandomLC();
        return false;
    }
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
