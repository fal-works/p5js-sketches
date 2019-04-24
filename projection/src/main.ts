import * as p5ex from "p5ex";

const SKETCH_NAME = "Projection";

class Particle extends p5ex.PhysicsBody {
  public constructor(
    public particleColor: p5.Color,
    public darkLineColor: p5.Color
  ) {
    super();
  }
}

const sketch = (p: p5ex.p5exClass): void => {
  // ---- variables
  const PARTICLE_COUNT = 24;
  const PARTICLE_SIZE = 6;
  let backgroundPixels: number[];
  let particles: p5ex.LoopableArray<Particle>;
  let mousePosition: p5.Vector;
  let lineColor: p5.Color;
  let axisColor: p5.Color;
  let cursorColor: p5.Color;
  let showYAxis = false;
  let showGuideLines = true;
  let phase = 0;

  // ---- functions
  function constrainPosition(particle: Particle): void {
    const pos = particle.position;
    const x = pos.x;
    if (x < 40) {
      pos.x = 40 + 1;
      particle.velocity.x *= -0.5;
    } else if (x > 640) {
      pos.x = 640 - 1;
      particle.velocity.x *= -0.5;
    }
    const y = pos.y;
    if (y < 0) {
      pos.y = 0 + 1;
      particle.velocity.y *= -0.5;
    } else if (y > 600) {
      pos.y = 600 - 1;
      particle.velocity.y *= -0.5;
    }
  }
  function stepParticle(particle: Particle): void {
    particle.attractToPoint(mousePosition, 10000, 0.1, 1);
    constrainPosition(particle);
    particle.step();
  }
  function drawParticle(particle: Particle): void {
    p.fill(particle.particleColor);
    const pos = particle.position;
    p.ellipse(pos.x, pos.y, PARTICLE_SIZE, PARTICLE_SIZE);
  }
  function projectParticle(particle: Particle): void {
    const pos = particle.position;
    p.strokeWeight(4);
    p.stroke(particle.darkLineColor);
    p.line(pos.x, 610, pos.x, 590);
    if (showYAxis) p.line(30, pos.y, 50, pos.y);

    if (!showGuideLines) return;
    p.strokeWeight(1);
    p.stroke(lineColor);
    p.line(pos.x, 590, pos.x, pos.y);
    if (showYAxis) p.line(50, pos.y, pos.x, pos.y);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.SQUARE640x640);

    p.background(p.color(248, 248, 252));
    p.loadPixels();
    backgroundPixels = p.pixels;

    p.strokeCap(p.SQUARE);

    const particleColor = p.color(64);
    lineColor = p.color(0, 16);
    const darkLineColor = p.color(0, 32);
    axisColor = p.color(128);
    cursorColor = p.color(64);

    particles = new p5ex.LoopableArray<Particle>(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const body = new Particle(particleColor, darkLineColor);
      body.position.set(
        p.random(0.2, 1) * p.nonScaledWidth,
        p.random(0, 0.8) * p.nonScaledHeight
      );
      body.velocity.set(p5.Vector.random2D().mult(4));
      particles.push(body);
    }

    const redBody = new Particle(p.color(255, 0, 64), p.color(255, 0, 64));
    redBody.position.set(
      p.random(0.2, 1) * p.nonScaledWidth,
      p.random(0, 0.8) * p.nonScaledHeight
    );
    redBody.velocity.set(p5.Vector.random2D().mult(4));
    particles.push(redBody);

    mousePosition = p.createVector();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    const canvas = p.scalableCanvas;

    mousePosition.set(
      canvas.getNonScaledValueOf(p.mouseX),
      canvas.getNonScaledValueOf(p.mouseY)
    );
    particles.loop(stepParticle);

    canvas.scale();

    // draw axis
    p.strokeWeight(1);
    p.stroke(axisColor);
    p.line(0, 600, 640, 600);
    if (showYAxis) p.line(40, 0, 40, 640);

    // draw projection lines
    particles.loop(projectParticle);

    // draw particles
    p.noStroke();
    particles.loop(drawParticle);

    // draw cursor
    p.strokeWeight(2);
    p.stroke(cursorColor);
    p.line(
      mousePosition.x - 10,
      mousePosition.y,
      mousePosition.x + 10,
      mousePosition.y
    );
    p.line(
      mousePosition.x,
      mousePosition.y - 10,
      mousePosition.x,
      mousePosition.y + 10
    );

    canvas.cancelScale();
  };

  p.mousePressed = () => {
    phase = (phase + 1) % 4;

    switch (phase) {
      case 0:
        showYAxis = false;
        showGuideLines = true;
        break;
      case 1:
        showYAxis = true;
        showGuideLines = true;
        break;
      case 2:
        showYAxis = false;
        showGuideLines = false;
        break;
      case 3:
        showYAxis = true;
        showGuideLines = false;
        break;
    }
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    // if (p.key === "s") p.save("image.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
