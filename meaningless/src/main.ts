import * as p5ex from 'p5ex';

const SKETCH_NAME = 'Meaningless';

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let backgroundColor: p5.Color;
  // let backgroundPixels: number[];
  let timeoutId: number = -1;

  let currentX;
  let currentY;
  let currentWordLength;
  let currentParagraphLineCount;
  let completed = false;

  // ---- functions
  function reset(): void {
    p.background(backgroundColor);
    p5ex.applyRandomTexture(p, 32, true, 192, 128, 64);

    // p.loadPixels();
    // backgroundPixels = p.pixels;

    currentX = 80;
    currentY = 80;
    currentWordLength = 0;
    currentParagraphLineCount = 1;
    completed = false;
  }

  function drawComma() {
    p.translate(currentX, currentY);
    p.beginShape();
    p.curveVertex(2, 14);
    p.curveVertex(2, 14);
    p.curveVertex(2, 16);
    p.curveVertex(0, 18);
    p.curveVertex(0, 18);
    p.endShape();
    p.translate(-currentX, -currentY);

    currentX += 16;
  }

  function drawPeriod() {
    p.translate(currentX, currentY);
    p.ellipse(2, 14, 3, 3);
    p.translate(-currentX, -currentY);

    currentX += 24;
  }

  function drawSpace() {
    currentX += 12;
  }

  function drawLetter() {
    p.translate(currentX, currentY);

    p.beginShape();

    const vertexPositionArray: { x: number, y: number }[] = [];

    let minX = 16;
    let maxX = 0;

    p.curveVertex(p.random(16), p.random(16));

    const repetition = p5ex.randomIntBetween(3, 8);

    for (let i = 0; i < repetition; i += 1) {
      const x = p.random(16);
      const y = p.random(16);
      vertexPositionArray.push({ x, y });

      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
    }

    for (const pos of vertexPositionArray) {
      p.curveVertex(pos.x - minX, pos.y);
    }

    p.curveVertex(p.random(16), p.random(16));

    p.endShape();

    p.translate(-currentX, -currentY);

    currentX += 4 + maxX - minX;
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    backgroundColor = p.color(255, 255, 255);
    p.noFill();
    p.stroke(0, 0, 32);

    reset();
  };

  p.draw = () => {
    // p.pixels = backgroundPixels;
    // p.updatePixels();

    if (completed) return;

    p.scalableCanvas.scale();
    if (currentWordLength > 3 && p.random(1) < 0.2) {
      if (currentParagraphLineCount >= 3 && p.random(1) < 0.2) {
        drawPeriod();
        currentX = 80;
        currentY += 16 * 3;
        currentParagraphLineCount = 1;
        if (currentY > 500) completed = true;
      } else {
        if (p.random(1) < 0.1) drawPeriod(); else {
          if (p.random(1) < 0.2) drawComma(); else drawSpace();
        }
      }
      currentWordLength = 0;
    } else {
      drawLetter();
      currentWordLength += 1;
    }

    if (currentX >= 560) {
      currentX = 64;
      currentY += 16 * 1.7;
      currentWordLength = 0;
      currentParagraphLineCount += 1;
    }

    p.scalableCanvas.cancelScale();
  };


  p.windowResized = () => {
    p.resizeScalableCanvas();
    if (timeoutId !== -1) clearTimeout(timeoutId);
    timeoutId = setTimeout(reset, 200);
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;

    reset();
  };

  p.keyTyped = () => {
    if (p.key === 's') p.saveCanvas('meaningless', 'png');
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
