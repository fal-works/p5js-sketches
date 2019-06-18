// formulae from: https://how-to-build-du-e.tumblr.com/

const { sin, cos } = Math;

const next = v => {
  const { x, y, t } = v;
  return {
    x: -2.1 * sin(0.4 * x) + 1.4 * cos(1.1 * y) + 1.1 * sin(1.0 * t),
    y: 1.1 * cos(1.1 * x) + 1.2 * sin(1.0 * y) + 0.9 * cos(0.7 * t),
    t: t + 0.15
  };
};

const plot = v => point(100 * v.x, 100 * v.y);

let v = { x: 0, y: 0, t: 0 };

function setup() {
  createCanvas(800, 600);
  background(252);
  stroke(0, 0, 64, 32);
}

function draw() {
  translate(400, 250);

  for (let i = 0; i < 1000; i += 1) {
    v = next(v);
    plot(v);
  }
}
