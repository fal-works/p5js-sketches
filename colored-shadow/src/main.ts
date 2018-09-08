import * as p5ex from 'p5ex';
import NoiseShape from './NoiseShape';

const SKETCH_NAME = 'ColoredShadow';

class ColoredShape implements p5ex.Drawable {
  drawShape: (scaleFactor: number) => void;
  solidShapeColor: p5ex.ShapeColor;
  transparentShapeColor: p5ex.ShapeColor;
  position: p5.Vector;
  scaleFactor: number = 1;

  constructor(protected readonly p: p5ex.p5exClass, hue: number = p.random(p.TWO_PI)) {
    const size = p.random(100, 200);
    const shape = new NoiseShape(p, {
      shapeSize: size,
      noiseMagnitudeFactor: p.random(1.5, 3),
      noiseDistanceScale: p.random(0.5, 2) * size / 320,
    });
    this.drawShape = (scaleFactor: number) => {
      shape.shapeSizeScale = scaleFactor;
      shape.updateVerticesPosition();
      shape.draw();
    };

    this.solidShapeColor = new p5ex.ShapeColor(p, null, p.color(240, 240, 244));

    const baseColor = p5ex.subtractColor(p.color(255), p.color(p5ex.cielchColor(80, 128, hue)));
    this.transparentShapeColor = new p5ex.ShapeColor(p, null, baseColor, true);

    this.position = p.createVector(p.random(p.nonScaledWidth), p.random(p.nonScaledHeight));
  }

  draw(): void {
    this.p.push();
    this.p.translate(this.position.x, this.position.y);
    this.drawShape(this.scaleFactor);
    this.p.pop();
  }

  drawShadow(offset: number = 30): void {
    this.p.push();
    this.p.translate(offset, offset);
    this.transparentShapeColor.applyColor(64);
    this.scaleFactor = 1.1;
    this.draw();
    this.scaleFactor = 1;
    this.p.pop();
  }

  drawSolid(): void {
    this.solidShapeColor.applyColor();
    this.draw();
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let clearScreenIndicator = true;
  let message: p5.Element;

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    message = p.createP('Rendering...') as p5.Element;
    message.position(50, 50);
    message.style('z-index', 10);
    message.show();
  };

  p.draw = () => {
    if (clearScreenIndicator) {
      message.show();
      clearScreenIndicator = false;
      return;
    }

    p.blendMode(p.BLEND);
    p5ex.gradationBackground(p, p.color(255), p.color(248, 248, 252), p.color(236, 236, 244), 4);

    const shapeArray: ColoredShape[] = [];

    for (let i = 0; i < 10; i += 1) {
      shapeArray.push(new ColoredShape(p));
    }

    p.scalableCanvas.scale();
    p.blendMode(p.DIFFERENCE);

    shapeArray.forEach((shape) => { shape.drawShadow(10); });

    p.filter(p.BLUR, 10);

    p.blendMode(p.BLEND);
    shapeArray.forEach((shape) => { shape.drawSolid(); });

    p.scalableCanvas.cancelScale();

    clearScreenIndicator = true;
    message.hide();
    p.noLoop();
  };

  p.windowResized = () => {
    p.loop();
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    p.loop();
  };

  p.keyTyped = () => {
    if (p.key === 's') p.saveCanvas('colored-shadow', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
