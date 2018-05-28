import * as p5ex from 'p5ex';
import Attractor from './Attractor';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'DeJongAttractor';
const OPENPROCESSING = false;

if (OPENPROCESSING) new (p5 as any)();

const createDeJongAttractor = (
  pieceCountLevel: number,
  htmlElementId?: string,
) => {

  const sketch = (p: p5ex.p5exClass) => {
    // ---- variables
    let backgroundPixels: number[];
    const attractors = new p5ex.DrawableArray<Attractor>();
    let timeoutId = -1;

    function reset() {
      p.blendMode(p.BLEND);
      p.background(255);
      p.setCurrentRenderer(p);
      p5ex.gradationBackground(p, p.color(255), p.color(255), p.color(248, 248, 252), 2);
      p.loadPixels();
      backgroundPixels = p.pixels;
      p.blendMode(p.DIFFERENCE);

      attractors.clear();

      for (let xIndex = 0; xIndex < pieceCountLevel; xIndex += 1) {
        for (let yIndex = 0; yIndex < pieceCountLevel; yIndex += 1) {
          attractors.push(
            new Attractor(
              p,
              xIndex * p.width / pieceCountLevel,
              yIndex * p.height / pieceCountLevel,
              p.width / pieceCountLevel,
            ),
          );
        }
      }
    }

    // ---- Setup & Draw etc.
    p.preload = () => {
    };

    p.setup = () => {
      if (OPENPROCESSING) (window as any).noCanvas();

      p.createScalableCanvas(
        p5ex.ScalableCanvasTypes.SQUARE640x640,
      );

      p.setFrameRate(30);
      Attractor.pieceCountLevel = pieceCountLevel;

      reset();
    };

    p.draw = () => {
      p.pixels = backgroundPixels;
      p.updatePixels();
      attractors.draw();
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
      p.saveCanvas('de-jong-attractor', 'png');
    };
  };

  new p5ex.p5exClass(sketch, htmlElementId || SKETCH_NAME);
};

if (OPENPROCESSING) {
  createDeJongAttractor(2);
}

export default createDeJongAttractor;
