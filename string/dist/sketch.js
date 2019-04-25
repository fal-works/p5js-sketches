/**
 * String.
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

(function (p5ex) {
  'use strict';

  const SKETCH_NAME = "String";
  const sketch = (p) => {
      // ---- variables
      const THREAD_COUNT = 16;
      let backgroundPixels;
      let positionArrayList = [];
      let vertexCount = 0;
      let progress = 0;
      // ---- functions
      function createPositionArrayList() {
          const position = p.createVector();
          if (Math.random() < 0.5) {
              position.x = p.random(p.width);
              position.y = Math.random() < 0.5 ? -10 : p.height + 10;
          }
          else {
              position.x = Math.random() < 0.5 ? -10 : p.width + 10;
              position.y = p.random(p.height);
          }
          const region = new p5ex.RectangleRegion(0, 0, p.width, p.height);
          const centerPoint = p.createVector(0.5 * p.width, 0.5 * p.height);
          const velocity = p5.Vector.fromAngle(p5ex.getDirectionAngle(position, centerPoint));
          const positionArrayList = [];
          for (let i = 0; i < THREAD_COUNT; i++)
              positionArrayList.push([]);
          let angleVelocity = 0;
          let angleAcceleration = 0;
          const maxAngleSpeed = 0.01 * p.TWO_PI;
          const maxAngleAcceleration = 0.005 * p.TWO_PI;
          const maxAngleAccelerationChange = 0.0005 * p.TWO_PI;
          let count = 0;
          while (region.contains(position, 50)) {
              if (count % 20 == 0) {
                  for (let i = 0; i < THREAD_COUNT; i++) {
                      positionArrayList[i].push(position
                          .copy()
                          .add(p5.Vector.random2D().mult(10 * Math.pow(Math.random(), 1.5))));
                  }
              }
              position.add(velocity);
              angleAcceleration = p.constrain(angleAcceleration + p.random(-1, 1) * maxAngleAccelerationChange, -maxAngleAcceleration, maxAngleAcceleration);
              angleVelocity += angleAcceleration;
              if (angleVelocity < -maxAngleSpeed) {
                  angleVelocity = -maxAngleSpeed;
                  angleAcceleration *= -0.7;
              }
              else if (angleVelocity > maxAngleSpeed) {
                  angleVelocity = maxAngleSpeed;
                  angleAcceleration *= -0.7;
              }
              velocity.rotate(angleVelocity);
              count++;
          }
          return positionArrayList;
      }
      function initialize() {
          progress = 0;
          p.noFill();
          p.stroke(p5ex.cielchColor(p.random(10, 80), p.random(30, 100), p.random(p.TWO_PI), 32));
          let retryCount = 15;
          while (retryCount > 0) {
              positionArrayList = createPositionArrayList();
              vertexCount = positionArrayList[0].length;
              if (vertexCount > 100)
                  break;
              retryCount--;
          }
      }
      // ---- Setup & Draw etc.
      p.preload = () => { };
      p.setup = () => {
          p.createScalableCanvas(p5ex.ScalableCanvasTypes.FULL);
          p.frameRate(30);
          p.background(252);
          p.loadPixels();
          backgroundPixels = p.pixels;
          initialize();
      };
      p.draw = () => {
          p.pixels = backgroundPixels;
          p.updatePixels();
          if (progress < vertexCount)
              progress++;
          for (let i = 0; i < THREAD_COUNT; i++) {
              p.beginShape();
              const positionArray = positionArrayList[i];
              const len = progress;
              for (let k = 0; k < len; k++) {
                  const position = positionArray[k];
                  p.curveVertex(position.x + 3 * p.random(-1, 1), position.y + 3 * p.random(-1, 1));
              }
              p.endShape();
          }
      };
      p.mousePressed = () => {
          initialize();
      };
      p.keyTyped = () => {
          if (p.key === "p")
              p.noLoop();
          if (p.key === "s")
              p.save("string.png");
      };
  };
  new p5ex.p5exClass(sketch, SKETCH_NAME);

}(p5ex));
//# sourceMappingURL=sketch.js.map
