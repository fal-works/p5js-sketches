import * as p5ex from 'p5ex';
import * as Life from './Life';

(p5 as any).disableFriendlyErrors = true;

const rectangleLives = (
  param: {
    rlePath: string;
    htmlElementId?: string;
    color?: Life.LifeColor;
    afterImageFrameCount?: number;
    marginCells?: number;
    torusMode?: boolean;
  },
) => {
  const SKETCH_NAME = 'RectangleLives';
  const OPENPROCESSING = false;

  if (OPENPROCESSING) new (p5 as any)();

  const sketch = (p: p5ex.p5exClass) => {
    // ---- constants

    // ---- variables
    let lifeGameData: Life.LifePattern;
    let grid: Life.LifeGrid;

    // ---- Setup & Draw etc.
    p.preload = () => {
      console.log('Loading ' + param.rlePath + ' ...');

      p.loadStrings(param.rlePath, (strArray: string[]) => {
        console.log('Loaded.');
        console.log('Parsing ' + param.rlePath + ' ...');
        lifeGameData = Life.parseLifeRle(strArray);
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

      grid = new Life.LifeGrid(
        p,
        lifeGameData,
        param.color,
        param.afterImageFrameCount,
        param.marginCells,
        param.torusMode,
      );

      const backgrounColor = grid.color.background;
      p.background(backgrounColor[0], backgrounColor[1], backgrounColor[2]);
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

  new p5ex.p5exClass(sketch, param.htmlElementId || SKETCH_NAME);

};

export default rectangleLives;
