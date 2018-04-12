import * as p5ex from 'p5ex';
import KanjiGraph from './KanjiGraph';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'KanjiNetwork';

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const backgroundColor = p.color(248);

  // ---- variables
  let currentFont: p5.Font;
  const mousePosition = p.createVector();
  let kanjiData: string[];
  let kanjiGraph: KanjiGraph;


  // ---- Setup & Draw etc.
  p.preload = () => {
    // currentFont = p.loadFont('./assets/mplus-1p-regular.ttf');
    currentFont = p.loadFont('./assets/mplus-1p-light.ttf');
    kanjiData = p.loadStrings('./assets/kanji-data.txt');
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    kanjiGraph = new KanjiGraph(p, kanjiData, currentFont);

    p.rectMode(p.CENTER);
    p.textFont(currentFont, 20);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0, 0, 0);
    p.imageMode(p.CENTER);

    p.frameRate(30);
  };

  p.draw = () => {
    p.background(backgroundColor);
    p.scalableCanvas.scale();
    p.translate(0.5 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);
    p.scale(0.5);

    kanjiGraph.step();
    kanjiGraph.draw();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
    p.background(255);
  };

  p.mouseMoved = () => {
    if (!p.scalableCanvas) return;

    mousePosition.set(
      p.scalableCanvas.getNonScaledValueOf(p.mouseX),
      p.scalableCanvas.getNonScaledValueOf(p.mouseY),
    );
  };

  p.mousePressed = () => {
  };

  p.touchMoved = () => {
    if (p.mouseX < 0) return;
    if (p.mouseY > p.width) return;
    if (p.mouseY < 0) return;
    if (p.mouseY > p.height) return;

    return false;
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
