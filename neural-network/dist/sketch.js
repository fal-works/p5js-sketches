/**
 * Something Like Neural Network.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

(function () {
'use strict';

/**
 * Spatial region.
 */
class Region {
}
/**
 * Rectangle-shaped spatial region.
 */
class RectangleRegion extends Region {
    get width() { return this.rightPositionX - this.leftPositionX; }
    get height() { return this.bottomPositionY - this.topPositionY; }
    get area() { return this.width * this.height; }
    constructor(x1, y1, x2, y2, margin = 0) {
        super();
        this.leftPositionX = x1 - margin;
        this.topPositionY = y1 - margin;
        this.rightPositionX = x2 + margin;
        this.bottomPositionY = y2 + margin;
    }
    contains(position, margin = 0) {
        return (position.x >= this.leftPositionX - margin && position.x <= this.rightPositionX + margin &&
            position.y >= this.topPositionY - margin && position.y <= this.bottomPositionY + margin);
    }
    constrain(position, margin = 0) {
        if (position.x < this.leftPositionX - margin)
            position.x = this.leftPositionX - margin;
        else if (position.x > this.rightPositionX + margin)
            position.x = this.rightPositionX + margin;
        if (position.y < this.topPositionY - margin)
            position.y = this.topPositionY - margin;
        else if (position.y > this.bottomPositionY + margin)
            position.y = this.bottomPositionY + margin;
    }
}
// default region -> add

/**
 * (To be filled)
 * @hideConstructor
 */
class ScalableCanvas {
    constructor(p5Instance, parameter, node, rendererType) {
        this.p = p5Instance;
        this.canvasElement = p5Instance.createCanvas(parameter.scaledWidth, parameter.scaledHeight, rendererType);
        if (this.canvasElement && 'parent' in this.canvasElement) {
            this.canvasElement.parent(node);
        }
        this.region = new RectangleRegion(0, 0, 0, 0);
        this.nonScaledShortSideLength = parameter.nonScaledShortSideLength;
        this.updateSize();
    }

    /**
     * (To be filled)
     */
    get scaleFactor() {
        return this._scaleFactor;
    }
    /**
     * (To be filled)
     */
    get nonScaledWidth() {
        return this._nonScaledWidth;
    }
    /**
     * (To be filled)
     */
    get nonScaledHeight() {
        return this._nonScaledHeight;
    }
    /**
     * (To be filled)
     */
    get aspectRatio() {
        return this._aspectRatio;
    }
    /**
     * (To be filled)
     * @param parameter
     */
    resize(parameter) {
        this.p.resizeCanvas(parameter.scaledWidth, parameter.scaledHeight);
        this.nonScaledShortSideLength = parameter.nonScaledShortSideLength;
        this.updateSize();
    }
    /**
     * (To be filled)
     */
    updateSize() {
        const p = this.p;
        this._scaleFactor = Math.min(p.width, p.height) / this.nonScaledShortSideLength;
        this._inversedScaleFactor = 1 / this._scaleFactor;
        this._nonScaledWidth = p.width / this._scaleFactor;
        this._nonScaledHeight = p.height / this._scaleFactor;
        this._aspectRatio = p.width / p.height;
        this.region.rightPositionX = this._nonScaledWidth;
        this.region.bottomPositionY = this._nonScaledHeight;
    }
    /**
     * Runs scale() of the current p5 instance for fitting the sketch to the current canvas.
     * Should be called every frame before drawing objects on the canvas.
     */
    scale() {
        this.p.scale(this._scaleFactor);
    }
    /**
     * Runs scale() with the inversed scale factor.
     */
    cancelScale() {
        this.p.scale(this._inversedScaleFactor);
    }
    /**
     * Converts a length value on the scaled canvas to the non-scaled one.
     * Typically used for interpreting mouseX and mouseY.
     * @param {number} scaledLength - scaled length value
     */
    getNonScaledValueOf(scaledLength) {
        return scaledLength / this._scaleFactor;
    }
}
ScalableCanvas.DUMMY_PARAMETERS = {
    scaledWidth: 100,
    scaledHeight: 100,
    nonScaledShortSideLength: 100,
};

/**
 * (To be filled)
 * (This is not implemented as an enum because it is not supported by rollup)
 */
const ScalableCanvasTypes = {
    SQUARE640x640: 'SQUARE640x640',
    RECT640x480: 'RECT640x480',
    FULL: 'FULL',
    CUSTOM: 'CUSTOM',
};

class NormalColorUnit {
    constructor(p, p5Color) {
        this.p = p;
        this.p5Color = p5Color;
    }
    stroke() {
        this.p.currentRenderer.stroke(this.p5Color);
    }
    fill() {
        this.p.currentRenderer.fill(this.p5Color);
    }
}
class NoColorUnit {
    constructor(p) {
        this.p = p;
    }
    stroke() {
        this.p.currentRenderer.noStroke();
    }
    fill() {
        this.p.currentRenderer.noFill();
    }
}
class UndefinedColorUnit {
    stroke() {
    }
    fill() {
    }
}
class AlphaColorUnit {
    constructor(p, c, alphaResolution = 256) {
        this.p = p;
        const array = [];
        for (let alphaFactor = 0; alphaFactor < alphaResolution; alphaFactor += 1) {
            array.push(p.color(p.red(c), p.green(c), p.blue(c), p.alpha(c) * alphaFactor / (alphaResolution - 1)));
        }
        this.colorArray = array;
        this.maxIndex = alphaResolution - 1;
    }
    stroke(alphaValue) {
        this.p.currentRenderer.stroke(this.getColor(alphaValue));
    }
    fill(alphaValue) {
        this.p.currentRenderer.fill(this.getColor(alphaValue));
    }
    getColor(alphaValue) {
        return this.colorArray[alphaValue ? Math.floor(this.p.map(alphaValue, 0, 255, 0, this.maxIndex)) : this.maxIndex];
    }
}
function colorUnit(p, p5Color, alphaEnabled, alphaResolution) {
    if (!p || p5Color === undefined)
        return new UndefinedColorUnit();
    if (p5Color === null)
        return new NoColorUnit(p);
    if (alphaEnabled)
        return new AlphaColorUnit(p, p5Color, alphaResolution);
    return new NormalColorUnit(p, p5Color);
}
/**
 * Composition of two p5.Color instances. One for stroke(), one for fill().
 */
class ShapeColor {
    /**
     *
     * @param p - p5ex instance.
     * @param {p5.Color | null | undefined} strokeColor - Color for stroke(). Null means noStroke().
     * @param {p5.Color | null | undefined} fillColor - Color for fill(). Null means noFill().
     * @param {boolean} [alphaEnabled]
     * @param {number} [alphaResolution]
     */
    constructor(p, strokeColor, fillColor, alphaEnabled, alphaResolution) {
        this.strokeColor = colorUnit(p, strokeColor, alphaEnabled, alphaResolution);
        this.fillColor = colorUnit(p, fillColor, alphaEnabled, alphaResolution);
    }
    /**
     * Applies colors to the current p5 renderer.
     * @param {number} alphaValue - Alpha channel value (0 - 255)
     */
    applyColor(alphaValue) {
        this.strokeColor.stroke(alphaValue);
        this.fillColor.fill(alphaValue);
    }
}
/**
 * Undefined object of p5ex.ShapeColor.
 * @static
 */
ShapeColor.UNDEFINED = new ShapeColor(undefined, undefined, undefined);
/**
 * 1.5 * PI
 */
const ONE_AND_HALF_PI = 1.5 * Math.PI;

const dummyP5 = new p5((p) => {
    p.setup = () => {
        p.noCanvas();
    };
});
const TWO_PI = 2 * Math.PI;
// Temporal vectors for calculation use in getClosestPositionOnLineSegment()
const tmpVectorAP = dummyP5.createVector();
const tmpVectorAB = dummyP5.createVector();

function loopArrayLimited(array, callback, arrayLength) {
    let i = 0;
    while (i < arrayLength) {
        callback(array[i], i, array);
        i += 1;
    }
}
function loopArrayBackwardsLimited(array, callback, arrayLength) {

    while (arrayLength--) {
        callback(array[arrayLength], arrayLength, array);
    }
}
/**
 * @callback loopArrayCallBack
 * @param {} currentValue
 * @param {number} [index]
 * @param {Array} [array]
 */

function roundRobinLimited(array, callback, arrayLength) {
    for (let i = 0, len = arrayLength - 1; i < len; i += 1) {
        for (let k = i + 1; k < arrayLength; k += 1) {
            callback(array[i], array[k]);
        }
    }
}
/**
 * @callback roundRobinCallBack
 * @param {} element
 * @param {} otherElement
 */

function nestedLoopJoinLimited(array, otherArray, callback, arrayLength, otherArrayLength) {
    for (let i = 0; i < arrayLength; i += 1) {
        for (let k = 0; k < otherArrayLength; k += 1) {
            callback(array[i], otherArray[k]);
        }
    }
}
/**
 * @callback nestedLoopJoinCallBack
 * @param {} element
 * @param {} otherElement
 */

/**
 * A class containing an array and several loop methods.
 */
class LoopableArray {
    /**
     * @param {number} initialCapacity
     */
    constructor(initialCapacity = 256) {

        this.array = new Array(initialCapacity);
        this.length = 0;
    }
    /**
     * Returns a specific element.
     * It is recommended to check that you are going to specify a valid index number
     * before calling this method.
     * @returns The specified element.
     */
    get(index) {
        return this.array[index];
    }
    /**
     * Returns the last element.
     * It is recommended to check that this array is not empty before calling this method.
     * @returns The last element.
     */
    getLast() {
        return this.array[this.length - 1];
    }
    /**
     * Adds one element to the end of the array and returns the new length of the array.
     * @param {} element - The element to add to the end of the array.
     */
    push(element) {
        this.array[this.length] = element;
        this.length += 1;
        return this.length;
    }
    /**
     * Adds elements to the end of the array and returns the new length of the array.
     * @param {Array} array - The elements to add to the end of the array.
     */
    pushRawArray(array, arrayLength = array.length) {
        for (let i = 0; i < arrayLength; i += 1) {
            this.array[this.length + i] = array[i];
        }
        this.length += arrayLength;
        return this.length;
    }
    /**
     * Adds all elements from another LoopableArray and returns the new length of the array.
     * @param {LoopableArray} otherLoopableArray
     */
    pushAll(otherLoopableArray) {
        return this.pushRawArray(otherLoopableArray.array, otherLoopableArray.length);
    }
    /**
     * Removes and returns the last element.
     * It is recommended to check that this array is not empty before calling this method.
     * @returns The last element.
     */
    pop() {
        this.length -= 1;
        return this.array[this.length];
    }
    /**
     * Clears the array.
     */
    clear() {
        this.length = 0;
    }
    /**
     * @callback loopArrayCallBack
     * @param {} currentValue
     * @param {number} [index]
     * @param {Array} [array]
     */
    /**
     * Executes a provided function once for each array element.
     * @param {loopArrayCallBack} callback
     */
    loop(callback) {
        loopArrayLimited(this.array, callback, this.length);
    }
    /**
     * Executes a provided function once for each array element in descending order.
     * @param {loopArrayCallBack} callback
     */
    loopBackwards(callback) {
        loopArrayBackwardsLimited(this.array, callback, this.length);
    }
    /**
     * @callback elementPairCallBack
     * @param {} element
     * @param {} otherElement
     */
    /**
     * Executes a provided function once for each pair within the array.
     * @param {elementPairCallback} callback
     */
    roundRobin(callback) {
        roundRobinLimited(this.array, callback, this.length);
    }
    /**
     * Joins two arrays and executes a provided function once for each joined pair.
     * @param {LoopableArray} otherArray
     * @param {elementPairCallback} callback
     */
    nestedLoopJoin(otherArray, callback) {
        nestedLoopJoinLimited(this.array, otherArray.array, callback, this.length, otherArray.length);
    }
}

/**
 * (To be filled)
 */
class DrawableArray extends LoopableArray {
    static drawFunction(value) {
        value.draw();
    }
    /**
     * Draws all child elements.
     */
    draw() {
        this.loop(DrawableArray.drawFunction);
    }
}

/**
 * (To be filled)
 */
class SteppableArray extends LoopableArray {
    static stepFunction(value) {
        value.step();
    }
    /**
     * Steps all child elements.
     */
    step() {
        this.loop(SteppableArray.stepFunction);
    }
}

/**
 * (To be filled)
 */
class SpriteArray extends LoopableArray {
}
SpriteArray.prototype.step = SteppableArray.prototype.step;
SpriteArray.prototype.draw = DrawableArray.prototype.draw;

/**
 * (To be filled)
 */
class CleanableArray extends LoopableArray {
    /**
     *
     * @param initialCapacity
     */
    constructor(initialCapacity) {
        super(initialCapacity);
        this.recentRemovedElements = new LoopableArray(initialCapacity);
    }
    /**
     * Updates the variable 'isToBeRemoved'.
     * If it has cleanable child elements, calls clean() recursively and
     * removes the child elements which are to be removed.
     */
    clean() {
        this.recentRemovedElements.clear();
        let validElementCount = 0;
        for (let i = 0; i < this.length; i += 1) {
            this.array[i].clean();
            if (this.array[i].isToBeRemoved) {
                this.recentRemovedElements.push(this.array[i]);
                continue;
            }
            this.array[validElementCount] = this.array[i];
            validElementCount += 1;
        }
        this.length = validElementCount;
    }
}

/**
 * (To be filled)
 */
class CleanableSpriteArray extends CleanableArray {
}
CleanableSpriteArray.prototype.draw = SpriteArray.prototype.draw;
CleanableSpriteArray.prototype.step = SpriteArray.prototype.step;

// temporal vectors for use in QuadraticBezierCurve.
const tmpMidPoint1 = dummyP5.createVector();
const tmpMidPoint2 = dummyP5.createVector();

const temporalVector = dummyP5.createVector();

/**
 * Extension of p5 class.
 */

class p5exClass extends p5 {
    /**
     * Sets the current renderer object.
     * @param renderer
     */
    setCurrentRenderer(renderer) {
        this.currentRenderer = renderer;
    }
    /**
      * The non-scaled width of the canvas.
      */
    get nonScaledWidth() {
        return this.scalableCanvas.nonScaledWidth;
    }
    /**
     * The non-scaled height of the canvas.
     */
    get nonScaledHeight() {
        return this.scalableCanvas.nonScaledHeight;
    }

    /**
     * The ideal frame rate which was set by setFrameRate().
     */
    get idealFrameRate() { return this._idealFrameRate; }
    /**
     * Anglular displacement in radians per frame which corresponds to 1 cycle per second.
     * Set by setFrameRate().
     */
    get unitAngleSpeed() { return this._unitAngleSpeed; }
    /**
     * Positional displacement per frame which corresponds to 1 unit length per second.
     * Set by setFrameRate().
     */
    get unitSpeed() { return this._unitSpeed; }
    /**
     * Change of speed per frame which corresponds to 1 unit speed per second.
     * Set by setFrameRate().
     */
    get unitAccelerationMagnitude() { return this._unitAccelerationMagnitude; }
    /**
     * Constructor of class p5ex.
     * @param sketch
     * @param node
     * @param sync
     */
    constructor(sketch, node, sync) {
        super(sketch, typeof node === 'string' ? document.getElementById(node) || undefined : node, sync);
        if (!node || typeof node === 'boolean') {
            this.node = document.body;
        }
        else {
            this.node = typeof node === 'string' ? document.getElementById(node) || document.body : node;
        }
        this.currentRenderer = this;
        this.maxCanvasRegion = {
            width: 0,
            height: 0,
            getShortSideLength() { return Math.min(this.width, this.height); },
        };
        this.updateMaxCanvasRegion();
        this.setFrameRate();
    }
    /**
     * Calls frameRate() and sets variables related to the frame rate.
     * @param {number} [fps=60] - The ideal frame rate per second.
     */
    setFrameRate(fps = 60) {
        this.frameRate(fps);
        if (fps) {
            this._idealFrameRate = fps;
            this._unitAngleSpeed = 2 * Math.PI / this._idealFrameRate;
            this._unitSpeed = 1 / this._idealFrameRate;
            this._unitAccelerationMagnitude = this._unitSpeed / this._idealFrameRate;
        }
        return this;
    }
    /**
     * Updates the value of the variable maxCanvasRegion.
     */
    updateMaxCanvasRegion() {
        this.maxCanvasRegion.width = this.windowWidth;
        this.maxCanvasRegion.height = this.windowHeight;
        if (this.node === document.body)
            return;
        const containerRect = this.node.getBoundingClientRect();
        this.maxCanvasRegion.width = containerRect.width;
        this.maxCanvasRegion.height = containerRect.height;
    }
    /**
     * Create an instance of ScalableCanvas. This includes calling of createCanvas().
     * @param {ScalableCanvasType} type - Type chosen from p5ex.ScalableCanvasTypes.
     * @param {ScalableCanvasParameters} [parameters] - Parameters for type CUSTOM.
     * @param {string} [rendererType] - Either P2D or WEBGL.
     */
    createScalableCanvas(type, parameters, rendererType) {
        this.scalableCanvasType = type;
        this.scalableCanvas = new ScalableCanvas(this, this.createScalableCanvasParameter(type, parameters), this.node, rendererType);
    }
    /**
     * Resizes the ScalableCanvas. Does not work on OpenProcessing.
     * @param {ScalableCanvasType} [type] - Type chosen from p5ex.ScalableCanvasTypes.
     *     If undefined, the last used type will be used again.
     * @param {ScalableCanvasParameters} [parameters] - Parameters for type CUSTOM.
     */
    resizeScalableCanvas(type, parameters) {
        this.scalableCanvas.resize(this.createScalableCanvasParameter(type || this.scalableCanvasType, parameters));
    }
    createScalableCanvasParameter(type, parameters) {
        this.updateMaxCanvasRegion();
        const maxShortSide = this.maxCanvasRegion.getShortSideLength();
        switch (type) {
            case ScalableCanvasTypes.SQUARE640x640:
                return {
                    scaledWidth: maxShortSide,
                    scaledHeight: maxShortSide,
                    nonScaledShortSideLength: 640,
                };
            case ScalableCanvasTypes.RECT640x480:
                return {
                    scaledWidth: maxShortSide,
                    scaledHeight: 0.75 * maxShortSide,
                    nonScaledShortSideLength: 480,
                };
            case ScalableCanvasTypes.FULL:
                return {
                    scaledWidth: this.maxCanvasRegion.width,
                    scaledHeight: this.maxCanvasRegion.height,
                    nonScaledShortSideLength: 640,
                };
            default:
                return parameters || ScalableCanvas.DUMMY_PARAMETERS;
        }
    }
}

const SKETCH_NAME = 'SomethingLikeNeuralNetwork';
class Actor {
    constructor(p, width, height) {
        this.p = p;
        this.width = width;
        this.height = height;
        this.isToBeRemoved = false;
    }
    static updateSizeRatio(frameCount) {
        Actor.sizeRatio = 1 + 0.1 * Math.sin(2 * Math.PI * (frameCount % 60) / 60);
    }
    step() {
    }
    clean() {
        if (this.position.y < -20)
            this.isToBeRemoved = true;
    }
    draw() {
        this.p.rectMode(this.p.CENTER);
        this.shapeColor.applyColor();
        this.p.rect(this.position.x, this.position.y, Actor.sizeRatio * this.width, Actor.sizeRatio * this.height, 2);
    }
}
Actor.sizeRatio = 1;
class Enemy extends Actor {
    constructor(p) {
        super(p, 32, 32);
        this.p = p;
        this.position = p.createVector(320 + p.random(-1, 1) * 160, 0);
        this.shapeColor = new ShapeColor(p, null, p.color(32, 32, 160));
    }
    step() {
        super.step();
        this.position.y += 1;
        if (this.position.y > 280)
            this.isToBeRemoved = true;
    }
}
class Player extends Actor {
    constructor(p) {
        super(p, 32, 32);
        this.p = p;
        this.velocityX = 0;
        this.position = p.createVector(320, 320);
        this.shapeColor = new ShapeColor(p, null, p.color(32, 32, 48));
    }
    step() {
        super.step();
        // this.position.x = this.p.constrain(this.position.x + this.velocityX, 16, 624);
        this.position.x += this.velocityX;
        if (this.position.x < 16) {
            this.position.x = 16;
            this.velocityX *= -1;
        }
        else if (this.position.x > 624) {
            this.position.x = 624;
            this.velocityX *= -1;
        }
        this.velocityX *= 0.9;
    }
    applyForce(x) {
        this.velocityX = this.p.constrain(this.velocityX + 0.5 * x, -20, 20);
    }
}
class Bullet extends Actor {
    constructor(p, x) {
        super(p, 8, 24);
        this.p = p;
        this.position = p.createVector(x, 320);
        this.shapeColor = new ShapeColor(p, null, p.color(48, 48, 64));
    }
    step() {
        super.step();
        this.position.y -= 10;
    }
}
class Particle extends Actor {
    constructor(p, x, y) {
        super(p, 16, 16);
        this.p = p;
        this.position = p.createVector(x, y);
        this.velocity = p5.Vector.random2D().mult(Math.random() * 3);
        this.shapeColor = new ShapeColor(p, null, p.color(192, 192, 255), false);
    }
    step() {
        super.step();
        this.position.add(this.velocity);
        this.width *= 0.95;
        this.height *= 0.95;
        this.velocity.y += 0.1;
        if (this.width < 1.5)
            this.isToBeRemoved = true;
    }
}
class Neuron {
    constructor(p, x, y) {
        this.p = p;
        this.lastInput1 = 0;
        this.lastInput2 = 0;
        this.currentOutput = 0;
        this.idealInput1 = 0;
        this.idealInput2 = 0;
        this.weight1 = p.random(-1, 1);
        this.weight2 = p.random(-1, 1);
        this.position = p.createVector(x, y);
    }
    feedForward(input1, input2) {
        this.lastInput1 = input1;
        this.lastInput2 = input2;
        this.currentOutput = (input1 * this.weight1 + input2 * this.weight2) > 0 ? 1 : -1;
        // this.currentOutput = this.p.constrain(input1 * this.weight1 + input2 * this.weight2, -1, 1);
    }
    feedBack(idealOutput) {
        const error = idealOutput - this.currentOutput;
        this.weight1 = this.p.constrain(this.weight1 + error * this.lastInput1 * 0.0005, -1, 1);
        this.weight2 = this.p.constrain(this.weight2 + error * this.lastInput2 * 0.0005, -1, 1);
        this.idealInput1 = idealOutput * this.weight1;
        this.idealInput2 = idealOutput * this.weight2;
    }
}
const sketch = (p) => {
    // ---- variables
    let player;
    let enemies;
    let bullets;
    let particles;
    let checkCollision;
    let inputNeuron1;
    let inputNeuron2;
    let hiddenNeuron1;
    let hiddenNeuron2;
    let outputNeuron1;
    let outputNeuron2;
    let neuronArray;
    let backgroundColor;
    let diagramColor;
    let neuronColor;
    let textColor;
    let differenceX = 0;
    // ---- functions
    function updateActors() {
        player.step();
        enemies.step();
        bullets.step();
        particles.step();
        bullets.clean();
        bullets.nestedLoopJoin(enemies, checkCollision);
        enemies.clean();
        particles.clean();
    }
    function drawActors() {
        Actor.updateSizeRatio(p.frameCount);
        particles.draw();
        player.draw();
        enemies.draw();
        bullets.draw();
    }
    function runNeurons() {
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
    function drawLine(neuron1, neuron2) {
        p.line(neuron1.position.x, neuron1.position.y, neuron2.position.x, neuron2.position.y);
    }
    function drawNeurons() {
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
        const goLeft = outputNeuron1.currentOutput > 0 ? 'Y' : 'N';
        p.text(`Go left: ${goLeft}`, outputNeuron1.position.x + 60, outputNeuron1.position.y);
        const goRight = outputNeuron2.currentOutput > 0 ? 'Y' : 'N';
        p.text(`Go right: ${goRight}`, outputNeuron2.position.x + 60, outputNeuron2.position.y);
    }
    // ---- Setup & Draw etc.
    p.preload = () => {
    };
    p.setup = () => {
        p.createScalableCanvas(ScalableCanvasTypes.SQUARE640x640);
        player = new Player(p);
        enemies = new CleanableSpriteArray();
        bullets = new CleanableSpriteArray();
        particles = new CleanableSpriteArray();
        checkCollision = function (bullet, enemy) {
            if (Math.abs(bullet.position.x - enemy.position.x) < 20 && Math.abs(bullet.position.y - enemy.position.y) < 32) {
                bullet.isToBeRemoved = true;
                enemy.isToBeRemoved = true;
                for (let i = 0; i < 16; i += 1) {
                    particles.push(new Particle(p, enemy.position.x, enemy.position.y));
                }
            }
        };
        inputNeuron1 = new Neuron(p, 180, 430);
        inputNeuron2 = new Neuron(p, 180, 550);
        hiddenNeuron1 = new Neuron(p, 320, 430);
        hiddenNeuron2 = new Neuron(p, 320, 550);
        outputNeuron1 = new Neuron(p, 450, 430);
        outputNeuron2 = new Neuron(p, 450, 550);
        neuronArray = [inputNeuron1, inputNeuron2, hiddenNeuron1, hiddenNeuron2, outputNeuron1, outputNeuron2];
        p.textFont('Courier New', 12);
        p.textStyle(p.BOLD);
        diagramColor = p.color(96, 96, 128);
        backgroundColor = p.color(248, 248, 252);
        neuronColor = new ShapeColor(p, diagramColor, backgroundColor);
        textColor = new ShapeColor(p, null, diagramColor);
    };
    p.draw = () => {
        p.background(backgroundColor);
        p.scalableCanvas.scale();
        if (p.frameCount % 60 === 0)
            enemies.push(new Enemy(p));
        if (p.frameCount % 6 === 0)
            bullets.push(new Bullet(p, player.position.x));
        updateActors();
        drawActors();
        runNeurons();
        drawNeurons();
        p.scalableCanvas.cancelScale();
    };
    p.windowResized = () => {
    };
    p.mousePressed = () => {
        // if (!p5ex.mouseIsInCanvas(p)) return;
        p.noLoop();
    };
    p.keyTyped = () => {
    };
};
new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
