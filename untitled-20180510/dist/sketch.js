/**
 * Untitled. (2018-05-10)
 * Website => https://www.fal-works.com/
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.1
 * @license CC-BY-SA-3.0
 */

const htmlElementId = 'Untitled';

const sketch = (p) => {
	const nonScaledCanvasSize = 640;
	let canvas;
	let canvasScaleFactor;
	let drawingColor;

	function addLine(position, velocity) {
		velocity.setMag(20 + p.random(60));
		position.add(velocity);
		p.vertex(position.x, position.y);
	}

	function addCurve(position, velocity) {
		const directionChange = (p.random(1) < 0.5 ? 1 : -1) * (p.random(1) < 0.7 ? p.HALF_PI : p.QUARTER_PI);
		const curveResolution = 50;
		velocity.setMag(0.5);
		for (let i = 0; i < curveResolution; i += 1) {
			velocity.rotate(directionChange / curveResolution);
			position.add(velocity);
			p.vertex(position.x, position.y);
		}
	}

	function drawSomething() {
		const position = p.createVector(p.random(0.3, 0.7) * nonScaledCanvasSize, p.random(0.3, 0.7) * nonScaledCanvasSize);
		const velocity = p5.Vector.fromAngle(Math.floor(p.random(8)) * p.QUARTER_PI);
		p.stroke(drawingColor);
		p.noFill();
		p.beginShape();
		p.vertex(position.x, position.y);
		addLine(position, velocity);
		for (let i = 0, len = Math.floor(p.random(4)); i < len; i += 1) {
			addCurve(position, velocity);
			addLine(position, velocity);
		}
		p.endShape();
	}

	function drawDot() {
		p.noStroke();
		p.fill(drawingColor);
		p.ellipse(p.random(0.3, 0.7) * nonScaledCanvasSize, p.random(0.3, 0.7) * nonScaledCanvasSize, 10, 10);
	}

	function getMaxCanvasRegion() {
		const maxCanvasRegion = {
			width: p.windowWidth,
			height: p.windowHeight
		};

		const node = document.getElementById(htmlElementId);

		if (!node) return maxCanvasRegion;

		const containerRect = node.getBoundingClientRect();
		maxCanvasRegion.width = containerRect.width;
		maxCanvasRegion.height = containerRect.height;

		return maxCanvasRegion;
	}

	p.setup = () => {
		const maxCanvasRegion = getMaxCanvasRegion();
		const canvasSize = Math.min(maxCanvasRegion.width, maxCanvasRegion.height);
		canvas = p.createCanvas(canvasSize, canvasSize);
		canvasScaleFactor = canvasSize / nonScaledCanvasSize;

		p.noLoop();
		drawingColor = p.color(80);
		p.strokeWeight(5);
	};

	p.draw = () => {
		p.background(252, 255, 248);
		p.scale(canvasScaleFactor);

		for (let i = 0; i < 2; i += 1) drawSomething();

		drawDot();
	};

	p.mouseClicked = () => {
		p.redraw();
	};

	p.keyPressed = () => {
		if (p.keyCode === p.ENTER) {
			p.saveCanvas(canvas, 'untitled-20180510', 'png');
		}
	};
}

new p5(sketch, htmlElementId);
