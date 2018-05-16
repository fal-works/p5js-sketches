/**
 * Untitled. (2018-05-10)
 * Website => https://www.fal-works.com/
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

let canvas;
let canvasScaleFactor;
let drawingColor;

function addLine(position, velocity) {
	velocity.setMag(20 + random(60));
	position.add(velocity);
	vertex(position.x, position.y);
}

function addCurve(position, velocity) {
	const directionChange = (random(1) < 0.5 ? 1 : -1) * (random(1) < 0.7 ? HALF_PI : QUARTER_PI);
	const curveResolution = 50;
	velocity.setMag(0.5);
	for (let i = 0; i < curveResolution; i += 1) {
		velocity.rotate(directionChange / curveResolution);
		position.add(velocity);
		vertex(position.x, position.y);
	}
}

function drawSomething() {
	const position = createVector(random(0.3, 0.7) * width, random(0.3, 0.7) * height);
	const velocity = p5.Vector.fromAngle(Math.floor(random(8)) * QUARTER_PI);
	stroke(drawingColor);
	noFill();
	beginShape();
	vertex(position.x, position.y);
	addLine(position, velocity);
	for (let i = 0, len = Math.floor(random(4)); i < len; i += 1) {
		addCurve(position, velocity);
		addLine(position, velocity);
	}
	endShape();
}

function drawDot() {
  noStroke();
	fill(drawingColor);
	ellipse(random(0.3, 0.7) * width, random(0.3, 0.7) * height, 10, 10);
}

function setup() {
	const canvasSize = Math.min(windowWidth, windowHeight);
	canvas = createCanvas(canvasSize, canvasSize);
	canvasScaleFactor = canvasSize / 640;

	noLoop();
	drawingColor = color(80);
	strokeWeight(5);
}

function draw() {
	background(252, 255, 248);
	scale(canvasScaleFactor);

	for (let i = 0; i < 2; i += 1) drawSomething();
	
	drawDot();
}

function mouseClicked() {
	redraw();
}

function keyPressed() {
	if (keyCode === ENTER) {
		saveCanvas(canvas, 'something', 'png');
	}
}
