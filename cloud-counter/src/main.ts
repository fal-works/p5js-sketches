/**
 * ---- Main sketch ----------------------------------------------------------
 */

import { getElementOrBody } from "./common/environment";

import { createScaledCanvas, ScaledCanvas } from "./p5util/canvas";
import { createPixels } from "./p5util/drawing";

import { drawTranslated } from "./p5util/transform";

const HTML_ELEMENT = getElementOrBody("CloudCounter");

interface Count {
  count: number;
}

const sketch = (p: p5): void => {
  // ---- variables
  const ANGLE_RESOLUTION = 12;
  const DEFAULT_SHAPE_SIZE = 100;
  let canvas: ScaledCanvas;
  let backgroundPixels: number[];
  let backgroundColor: p5.Color;
  const vertices: p5.Vector[] = [];
  let shapeColor: p5.Color;
  let reactionFactor = 0;
  let time = 0;
  let currentCount = -1;
  let shapeIsActive = false;
  let loaded = false;

  // ---- functions
  const sq = (v: number) => v * v;

  function mouseIsOver(scaledX: number, scaledY: number) {
    const mouseAngle = (p.atan2(scaledY, scaledX) + p.TWO_PI) % p.TWO_PI;
    const x = -canvas.nonScaledSize.width / 2 + scaledX / canvas.scaleFactor;
    const y = -canvas.nonScaledSize.height / 2 + scaledY / canvas.scaleFactor;
    const mouseDistanceSq = sq(x) + sq(y);
    const vertexIndex = Math.floor(mouseAngle / (p.TWO_PI / ANGLE_RESOLUTION));
    return mouseDistanceSq <= vertices[vertexIndex].magSq();
  }

  function updateShape(vertices: p5.Vector[], size: number) {
    for (let i = 0; i < ANGLE_RESOLUTION; i += 1) {
      const angle = (i * p.TWO_PI) / ANGLE_RESOLUTION;
      const distance = size * (1 + 1 * p.noise(i * 0.5, time));
      vertices[i].set(distance * Math.cos(angle), distance * Math.sin(angle));
    }
  }

  function drawShape(p: p5) {
    p.beginShape();

    const len = vertices.length;
    const maxI = len + 3;
    for (let i = 0; i < maxI; i += 1) {
      const index = i % len;
      const vertex = vertices[index];
      p.curveVertex(vertex.x, vertex.y);
    }

    p.endShape();
  }

  function drawText(p: p5) {
    p.text(currentCount, 0, 0);
  }

  function getCount() {
    const request = new XMLHttpRequest();

    request.open("GET", "https://cloud-counter.herokuapp.com/", true);
    request.responseType = "json";

    request.onload = function() {
      const data: Count = request.response;
      if (currentCount != data.count) {
        currentCount = data.count;
        reactionFactor = 1.0;
      }
      loaded = true;
    };

    request.send();
  }

  function incrementCount() {
    currentCount += 1;
    reactionFactor = 1.0;

    const request = new XMLHttpRequest();

    request.open("GET", "https://cloud-counter.herokuapp.com/increment", true);
    request.responseType = "json";

    request.onload = function() {
      const data: Count = request.response;
      if (data.count > currentCount) {
        reactionFactor = 1.0;
        currentCount = data.count;
      }
    };

    request.send();
  }

  // ---- initialize & reset
  function initializeStyle() {
    p.noStroke();
    p.fill(shapeColor);
    p.blendMode(p.DIFFERENCE);
    p.strokeWeight(2);
    p.textAlign(p.CENTER, p.CENTER);
  }

  function initializeData() {
    for (let i = 0; i < ANGLE_RESOLUTION; i += 1) {
      vertices.push(p.createVector());
    }
  }

  function reset() {}

  // ---- core drawing process
  function drawSketch(): void {
    // shake screen
    let shakeOffsetX = 0;
    let shakeOffsetY = 0;

    if (reactionFactor > 0.01) {
      shakeOffsetX =
        reactionFactor * p.random(-1, 1) * canvas.nonScaledSize.width * 0.1;
      shakeOffsetY =
        reactionFactor * p.random(-1, 1) * canvas.nonScaledSize.height * 0.1;
    }

    // draw text
    p.noStroke();
    p.fill(shapeColor);

    if (loaded) {
      p.textFont("Impact", 64);
      drawTranslated(
        p,
        drawText,
        reactionFactor * shakeOffsetX,
        reactionFactor * shakeOffsetY
      );
      p.textFont("Verdana", 24);
      p.text(
        `Clicked ${currentCount} times around the world.`,
        0,
        0.4 * canvas.nonScaledSize.height
      );
    } else {
      p.textFont("Verdana", 24);
      p.text("Connecting.\nPlease wait a few seconds...", 0, 0);
    }

    // draw shape
    if (!loaded) return;

    if (!shapeIsActive) {
      p.stroke(shapeColor);
      p.noFill();
    }

    drawTranslated(p, drawShape, shakeOffsetX, shakeOffsetY);
  }

  // ---- setup & draw etc.
  p.preload = () => {};

  p.setup = () => {
    const nonScaledSize = { width: 800, height: 800 };
    canvas = createScaledCanvas(p, HTML_ELEMENT, nonScaledSize);
    backgroundColor = p.color(252, 252, 255);
    backgroundPixels = createPixels(p, (p: p5) => {
      p.background(backgroundColor);
    });

    shapeColor = p.color(255, 255, 240);

    initializeStyle();
    initializeData();
    reset();

    getCount();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    updateShape(vertices, (1 + sq(reactionFactor)) * DEFAULT_SHAPE_SIZE);

    p.translate(0.5 * p.width, 0.45 * p.height);

    canvas.drawScaled(drawSketch);

    time += (1 + 16 * reactionFactor) * 0.01;
    reactionFactor *= 0.92;
  };

  p.mousePressed = () => {
    if (!loaded) return;

    if (shapeIsActive) {
      incrementCount();
      return;
    }
  };

  p.mouseMoved = () => {
    shapeIsActive = mouseIsOver(p.mouseX, p.mouseY);
  };

  p.touchStarted = () => {
    if (!loaded) return;

    if (mouseIsOver(p.mouseX, p.mouseY)) {
      shapeIsActive = true;
      incrementCount();
      return false;
    }
  };

  p.touchMoved = () => {};

  p.touchEnded = () => {
    shapeIsActive = false;
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();
    if (p.key === "s") p.save("image.png");
  };
};

new p5(sketch, HTML_ELEMENT);
