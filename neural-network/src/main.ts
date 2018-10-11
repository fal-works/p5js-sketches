import * as p5ex from 'p5ex';

// tslint:disable-next-line:prefer-template
const SKETCH_NAME = 'SomethingLikeNeuralNetwork';

class Actor implements p5ex.CleanableSprite {
  static sizeRatio: number = 1;

  static updateSizeRatio(frameCount: number): void {
    Actor.sizeRatio = 1 + 0.1 * Math.sin(2 * Math.PI * (frameCount % 60) / 60);
  }

  isToBeRemoved: boolean = false;
  position: p5.Vector;
  shapeColor: p5ex.ShapeColor;

  constructor(protected p: p5ex.p5exClass, protected width: number, protected height: number) {
  }

  step() {
  }

  clean() {
    if (this.position.y < -20) this.isToBeRemoved = true;
  }

  draw() {
    this.p.rectMode(this.p.CENTER);
    this.shapeColor.applyColor();
    this.p.rect(this.position.x, this.position.y, Actor.sizeRatio * this.width, Actor.sizeRatio * this.height, 2);
  }
}

class Enemy extends Actor {
  constructor(protected p: p5ex.p5exClass) {
    super(p, 32, 32);
    this.position = p.createVector(320 + p.random(-1, 1) * 160, 0);
    this.shapeColor = new p5ex.ShapeColor(p, null, p.color(32, 32, 160));
  }

  step() {
    super.step();
    this.position.y += 1;

    if (this.position.y > 280) this.isToBeRemoved = true;
  }
}

class Player extends Actor {
  velocityX: number = 0;

  constructor(protected p: p5ex.p5exClass) {
    super(p, 32, 32);
    this.position = p.createVector(320, 320);
    this.shapeColor = new p5ex.ShapeColor(p, null, p.color(32, 32, 48));
  }

  step() {
    super.step();
    // this.position.x = this.p.constrain(this.position.x + this.velocityX, 16, 624);
    this.position.x += this.velocityX;

    if (this.position.x < 16) {
      this.position.x = 16;
      this.velocityX *= -1;
    } else if (this.position.x > 624) {
      this.position.x = 624;
      this.velocityX *= -1;
    }

    this.velocityX *= 0.9;
  }

  applyForce(x: number) {
    this.velocityX = this.p.constrain(this.velocityX + 0.5 * x, -20, 20);
  }
}

class Bullet extends Actor {
  constructor(protected p: p5ex.p5exClass, x: number) {
    super(p, 8, 24);
    this.position = p.createVector(x, 320);
    this.shapeColor = new p5ex.ShapeColor(p, null, p.color(48, 48, 64));
  }

  step() {
    super.step();
    this.position.y -= 10;
  }
}

class Particle extends Actor {
  velocity: p5.Vector;

  constructor(protected p: p5ex.p5exClass, x: number, y: number) {
    super(p, 16, 16);
    this.position = p.createVector(x, y);
    this.velocity = p5.Vector.random2D().mult(Math.random() * 3);
    this.shapeColor = new p5ex.ShapeColor(p, null, p.color(192, 192, 255), false);
  }

  step() {
    super.step();
    this.position.add(this.velocity);
    this.width *= 0.95;
    this.height *= 0.95;
    this.velocity.y += 0.1;

    if (this.width < 1.5) this.isToBeRemoved = true;
  }
}

class Neuron {
  weight1: number;
  weight2: number;
  lastInput1: number = 0;
  lastInput2: number = 0;
  currentOutput: number = 0;
  idealInput1: number = 0;
  idealInput2: number = 0;
  position: p5.Vector;

  constructor(protected p: p5ex.p5exClass, x: number, y: number) {
    this.weight1 = p.random(-1, 1) * 0.7;
    this.weight2 = p.random(-1, 1) * 0.7;
    this.position = p.createVector(x, y);
  }

  feedForward(input1: number, input2: number): void {
    this.lastInput1 = input1;
    this.lastInput2 = input2;
    this.currentOutput = (input1 * this.weight1 + input2 * this.weight2) > 0 ? 1 : -1;
    // this.currentOutput = this.p.constrain(input1 * this.weight1 + input2 * this.weight2, -1, 1);
  }

  feedBack(idealOutput: number): void {
    const error = idealOutput - this.currentOutput;
    this.weight1 = this.p.constrain(this.weight1 + error * this.lastInput1 * 0.0005, -1, 1);
    this.weight2 = this.p.constrain(this.weight2 + error * this.lastInput2 * 0.0005, -1, 1);
    this.idealInput1 = idealOutput * this.weight1;
    this.idealInput2 = idealOutput * this.weight2;
  }
}

const sketch = (p: p5ex.p5exClass) => {
  // ---- variables
  let player: Player;
  let enemies: p5ex.CleanableSpriteArray<Enemy>;
  let bullets: p5ex.CleanableSpriteArray<Bullet>;
  let particles: p5ex.CleanableSpriteArray<Particle>;

  let checkCollision: (bullet: Bullet, enemy: Enemy) => void;

  let inputNeuron1: Neuron;
  let inputNeuron2: Neuron;
  let hiddenNeuron1: Neuron;
  let hiddenNeuron2: Neuron;
  let outputNeuron1: Neuron;
  let outputNeuron2: Neuron;
  let neuronArray: Neuron[];

  let backgroundColor: p5.Color;
  let diagramColor: p5.Color;
  let neuronColor: p5ex.ShapeColor;
  let textColor: p5ex.ShapeColor;

  let differenceX: number = 0;

  // ---- functions

  function updateActors(): void {
    player.step();
    enemies.step();
    bullets.step();
    particles.step();
    bullets.clean();
    bullets.nestedLoopJoin(enemies, checkCollision);
    enemies.clean();
    particles.clean();
  }

  function drawActors(): void {
    Actor.updateSizeRatio(p.frameCount);

    particles.draw();
    player.draw();
    enemies.draw();
    bullets.draw();
  }

  function runNeurons(): void {
    const targetX = enemies.length === 0 ? 320 : enemies.get(0).position.x;
    differenceX = targetX - player.position.x;

    inputNeuron1.feedForward(differenceX, player.velocityX);
    inputNeuron2.feedForward(differenceX, player.velocityX);
    hiddenNeuron1.feedForward(inputNeuron1.currentOutput, inputNeuron2.currentOutput);
    hiddenNeuron2.feedForward(inputNeuron1.currentOutput, inputNeuron2.currentOutput);
    outputNeuron1.feedForward(hiddenNeuron1.currentOutput, hiddenNeuron2.currentOutput);
    outputNeuron2.feedForward(hiddenNeuron1.currentOutput, hiddenNeuron2.currentOutput);

    // if (outputNeuron1.currentOutput > 0) {
    //   player.applyForce(-1);
    // }
    // if (outputNeuron2.currentOutput > 0) {
    //   player.applyForce(1);
    // }

    // player.applyForce(-outputNeuron1.currentOutput);
    // player.applyForce(outputNeuron2.currentOutput);

    if (outputNeuron1.currentOutput > 0) {
      player.applyForce(-1);
    }
    if (outputNeuron2.currentOutput > 0) {
      player.applyForce(1);
    }

    const futureDifferenceX = differenceX - player.velocityX * 10;
    outputNeuron1.feedBack(futureDifferenceX < 0 ? 1 : -1);
    outputNeuron2.feedBack(futureDifferenceX > 0 ? 1 : -1);
    // hiddenNeuron1.feedBack((outputNeuron1.idealInput1 + outputNeuron2.idealInput1) / 2);
    // hiddenNeuron2.feedBack((outputNeuron1.idealInput2 + outputNeuron2.idealInput2) / 2);
    // inputNeuron1.feedBack((hiddenNeuron1.idealInput1 + hiddenNeuron2.idealInput1) / 2);
    // inputNeuron2.feedBack((hiddenNeuron1.idealInput2 + hiddenNeuron2.idealInput2) / 2);
    hiddenNeuron1.feedBack(outputNeuron1.idealInput1);
    hiddenNeuron1.feedBack(outputNeuron2.idealInput1);
    hiddenNeuron2.feedBack(outputNeuron1.idealInput2);
    hiddenNeuron2.feedBack(outputNeuron2.idealInput2);
    inputNeuron1.feedBack(hiddenNeuron1.idealInput1);
    inputNeuron1.feedBack(hiddenNeuron2.idealInput1);
    inputNeuron2.feedBack(hiddenNeuron1.idealInput2);
    inputNeuron2.feedBack(hiddenNeuron2.idealInput2);
  }

  function drawLine(neuron1: Neuron, neuron2: Neuron): void {
    p.line(neuron1.position.x, neuron1.position.y, neuron2.position.x, neuron2.position.y);
  }

  function drawNeurons(): void {
    p.stroke(diagramColor);
    drawLine(inputNeuron1, hiddenNeuron1);
    drawLine(inputNeuron1, hiddenNeuron2);
    drawLine(inputNeuron2, hiddenNeuron1);
    drawLine(inputNeuron2, hiddenNeuron2);
    drawLine(hiddenNeuron1, outputNeuron1);
    drawLine(hiddenNeuron1, outputNeuron2);
    drawLine(hiddenNeuron2, outputNeuron1);
    drawLine(hiddenNeuron2, outputNeuron2);

    for (const neuron of neuronArray) {
      neuronColor.applyColor();
      p.ellipse(neuron.position.x, neuron.position.y, 80, 80);

      textColor.applyColor();
      const v1 = Math.round(neuron.weight1 * 10000) / 10000;
      const v2 = Math.round(neuron.weight2 * 10000) / 10000;
      p.text(((v1 >= 0) ? ' ' : '') + p.nf(v1, 1, 4), neuron.position.x - 27, neuron.position.y - 8);
      p.text(((v2 >= 0) ? ' ' : '') + p.nf(v2, 1, 4), neuron.position.x - 27, neuron.position.y + 13);
    }

    textColor.applyColor();

    const positionDifference = Math.round(differenceX * 100) / 100;
    p.text(`Pos. diff.: ${((positionDifference >= 0) ? ' ' : '') + p.nf(positionDifference, 3, 2)}`, 20, (inputNeuron1.position.y + inputNeuron2.position.y) / 2 - 8);
    const velocityX = Math.round(player.velocityX * 100) / 100;
    p.text(`Velocity: ${((velocityX >= 0) ? ' ' : '') + p.nf(velocityX, 2, 2)}`, 20, (inputNeuron1.position.y + inputNeuron2.position.y) / 2 + 13);

    const goLeft: String = outputNeuron1.currentOutput > 0 ? 'Y' : 'N';
    p.text(`Go left: ${goLeft}`, outputNeuron1.position.x + 60, outputNeuron1.position.y);
    const goRight: String = outputNeuron2.currentOutput > 0 ? 'Y' : 'N';
    p.text(`Go right: ${goRight}`, outputNeuron2.position.x + 60, outputNeuron2.position.y);
  }

  function resetNeurons(): void {
    inputNeuron1 = new Neuron(p, 180, 430);
    inputNeuron2 = new Neuron(p, 180, 550);
    hiddenNeuron1 = new Neuron(p, 320, 430);
    hiddenNeuron2 = new Neuron(p, 320, 550);
    outputNeuron1 = new Neuron(p, 450, 430);
    outputNeuron2 = new Neuron(p, 450, 550);
    neuronArray = [inputNeuron1, inputNeuron2, hiddenNeuron1, hiddenNeuron2, outputNeuron1, outputNeuron2];
  }

  // ---- Setup & Draw etc.
  p.preload = () => {
  };

  p.setup = () => {
    p.createScalableCanvas(
      p5ex.ScalableCanvasTypes.SQUARE640x640,
    );

    player = new Player(p);
    enemies = new p5ex.CleanableSpriteArray<Enemy>();
    bullets = new p5ex.CleanableSpriteArray<Bullet>();
    particles = new p5ex.CleanableSpriteArray<Particle>();

    checkCollision = function (bullet: Bullet, enemy: Enemy): void {
      if (Math.abs(bullet.position.x - enemy.position.x) < 20 && Math.abs(bullet.position.y - enemy.position.y) < 32) {
        bullet .isToBeRemoved = true;
        enemy.isToBeRemoved = true;

        for (let i = 0; i < 16; i += 1) {
          particles.push(new Particle(p, enemy.position.x, enemy.position.y));
        }
      }
    };

    resetNeurons();

    p.textFont('Courier New', 12);
    p.textStyle(p.BOLD);

    diagramColor = p.color(96, 96, 128);
    backgroundColor = p.color(248, 248, 252);
    neuronColor = new p5ex.ShapeColor(p, diagramColor, backgroundColor);
    textColor = new p5ex.ShapeColor(p, null, diagramColor);
  };

  p.draw = () => {
    p.background(backgroundColor);

    p.scalableCanvas.scale();

    if (p.frameCount % 60 === 0) enemies.push(new Enemy(p));
    if (p.frameCount % 6 === 0) bullets.push(new Bullet(p, player.position.x));

    updateActors();
    drawActors();

    runNeurons();
    drawNeurons();

    p.scalableCanvas.cancelScale();
  };

  p.windowResized = () => {
  };

  p.mousePressed = () => {
    if (!p5ex.mouseIsInCanvas(p)) return;
    resetNeurons();
  };

  p.keyTyped = () => {
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
