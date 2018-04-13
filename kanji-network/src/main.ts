import * as p5ex from 'p5ex';
import KanjiGraph from './KanjiGraph';
import Camera from './Camera';

(p5 as any).disableFriendlyErrors = true;

const SKETCH_NAME = 'KanjiNetwork';
const ASSETS_VIA_NETWORK = true;

new (p5 as any)();

const sketch = (p: p5ex.p5exClass) => {
  // ---- constants
  const backgroundColor = p.color(248);
  const assetsPath = ASSETS_VIA_NETWORK ?
  'https://cdn.rawgit.com/fal-works/p5js-sketches/c0e40b5a/kanji-network/assets/' :
  './assets/';

  // ---- variables
  let currentFont: p5.Font;
  let kanjiData: string[];
  let camera: Camera;
  let kanjiGraph: KanjiGraph;


  // ---- Setup & Draw etc.
  p.preload = () => {
    // currentFont = p.loadFont('./assets/mplus-1p-regular.ttf');
    currentFont = p.loadFont(assetsPath + 'mplus-1p-light.ttf');
    kanjiData = p.loadStrings(assetsPath + 'kanji-data.txt');
  };

  p.setup = () => {
    (window as any).noCanvas();
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    camera = new Camera(p, 0.8);
    kanjiGraph = new KanjiGraph(p, kanjiData, currentFont, camera);

    p.rectMode(p.CENTER);
    p.textFont(currentFont, 20);
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(0, 0, 0);
    p.imageMode(p.CENTER);

    p.frameRate(30);
  };

  p.draw = () => {
    kanjiGraph.step();

    p.background(backgroundColor);
    p.scalableCanvas.scale();
    p.translate(0.5 * p.nonScaledWidth, 0.5 * p.nonScaledHeight);
    camera.apply();

    kanjiGraph.draw();

    camera.cancel();

    p.translate((-0.5 + 5 / 6) * p.nonScaledWidth, (-0.5 + 5 / 6) * p.nonScaledHeight);
    p.scale(1 / 3);
    kanjiGraph.drawHud();
  };

  p.windowResized = () => {
    p.resizeScalableCanvas();
    p.background(255);
  };

  p.mouseDragged = () => {
    camera.updatePosition();
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
