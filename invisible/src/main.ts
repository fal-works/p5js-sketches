import * as p5ex from 'p5ex';
import NoiseShape from './NoiseShape';

const SKETCH_NAME = 'Invisible';

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundImage: p5.Image;
  let blurredImage: p5.Image;
  let shapeImage: p5.Image;
  let maskGraphics: p5.Graphics;
  let noiseShape: NoiseShape;

  // ---- functions
  function copyImage(from: p5.Image, to: p5.Image): void {
    to.copy(from, 0, 0, from.width, from.height, 0, 0, from.width, from.height);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
    backgroundImage = p.loadImage('assets/background-image.jpg');
    blurredImage = p.loadImage('assets/blurred-image.jpg');
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    shapeImage = p.createImage(640, 640);
    maskGraphics = p.createGraphics(640, 640);
    (maskGraphics as any).fill(p.color(255));
    (maskGraphics as any).noStroke();

    noiseShape = new NoiseShape(p, {
      shapeSize: 300,
      noiseMagnitudeFactor: 3,
    });
  };

  p.draw = () => {
    p.scalableCanvas.scale();
    p.image(backgroundImage, 0, 0);

    noiseShape.step();

    const m = maskGraphics as any;
    m.clear();
    m.translate(320, 320);

    p.currentRenderer = m;
    noiseShape.draw();
    p.currentRenderer = p;

    m.translate(-320, -320);

    const s = shapeImage as any;
    copyImage(blurredImage, shapeImage);
    s.mask(maskGraphics);

    p.image(s, 0, 0);

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;
    p.noLoop();
  };

  p.keyTyped = () => {
    if (p.keyCode === (p as any).ENTER) p.noLoop();
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
