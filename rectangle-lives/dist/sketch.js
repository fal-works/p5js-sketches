/**
 * Rectangle Lives.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

/**
 * Reused codes from:
 *   "ca-formats" v0.0.0
 *   © 2018 Jamen Marz
 *   MIT license
 *   https://github.com/jamen/ca-formats
 *
 * Modification by FAL.
 */

var rectangleLives = (function () {
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
 * An empty function.
 */
const EMPTY_FUNCTION = () => { };
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

/**
 * Container class of number.
 */
class NumberContainer {
    /**
     * @constructor
     * @param {number} value
     */
    constructor(value = 0) {
        this.value = value;
    }
    valueOf() {
        return this.value;
    }
}
/**
 * Null object of NumberContainer.
 * @static
 */
NumberContainer.NULL = new NumberContainer();

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
class TwoDimensionalArray extends LoopableArray {
    /**
     * (To be filled)
     * @param {number} xCount
     * @param {number} yCount
     * @param fillElement
     */
    constructor(xCount, yCount, fillElement) {
        super(xCount * yCount);
        this.xCount = xCount;
        this.yCount = yCount;
        if (fillElement) {
            for (let i = 0, len = xCount * yCount; i < len; i += 1) {
                this.push(fillElement);
            }
        }
    }
    /**
     * Returns the specified element.
     * @param x
     * @param y
     */
    get2D(x, y) {
        return this.array[x + this.xCount * y];
    }
    /**
     * (To be filled)
     * @param x
     * @param y
     * @param element
     */
    set2D(x, y, element) {
        this.array[x + this.xCount * y] = element;
    }
}

/**
 * (To be filled)
 */
class NullCell {
    getNeighborCell(relativeX, relativeY) {
        return this;
    }
    setNeighborCell(relativeX, relativeY, cell) { }
}
const NULL = new NullCell();
/**
 * (To be filled)
 */
class NaiveCell {
    /**
     *
     * @param neighborRange
     */
    constructor(neighborRange = 1) {
        this.neighborCells = new TwoDimensionalArray(2 * neighborRange + 1, 2 * neighborRange + 1, NULL);
    }
    /**
     * Returns the specified neighbor cell.
     * @param {number} relativeX
     * @param {number} relativeY
     */
    getNeighborCell(relativeX, relativeY) {
        const neighborRange = Math.floor(this.neighborCells.xCount / 2);
        if (relativeX < -neighborRange || relativeX > neighborRange ||
            relativeY < -neighborRange || relativeY > neighborRange)
            return NULL;
        return this.neighborCells.get2D(relativeX + neighborRange, relativeY + neighborRange);
    }
    /**
     * Sets the provided cell as a neighbor of this cell.
     * @param relativeX
     * @param relativeY
     * @param cell
     */
    setNeighborCell(relativeX, relativeY, cell) {
        const neighborRange = Math.floor(this.neighborCells.xCount / 2);
        this.neighborCells.set2D(relativeX + neighborRange, relativeY + neighborRange, cell);
    }
}
/**
 * (To be filled)
 */
class Grid {
    /**
     *
     * @param {number} xCount
     * @param {number} yCount
     * @param {number} neighborRange
     * @param {boolean} loopAtEndOfScreen
     */
    constructor(xCount, yCount, neighborRange, loopAtEndOfScreen, cellFactory, nullCell) {
        this.nullCell = nullCell;
        this.cell2DArray = new TwoDimensionalArray(xCount, yCount, nullCell);
        this.cellIndexMap = new Map();
        for (let yIndex = 0; yIndex < yCount; yIndex += 1) {
            for (let xIndex = 0; xIndex < xCount; xIndex += 1) {
                const cell = cellFactory(neighborRange);
                this.cell2DArray.set2D(xIndex, yIndex, cell);
                this.cellIndexMap.set(cell, { x: xIndex, y: yIndex });
            }
        }
        this.cell2DArray.loop((cell) => {
            this.setNeighborCells(cell, neighborRange, loopAtEndOfScreen);
        });
    }
    /**
     * Returns the specified cell.
     * @param {number} x - X index.
     * @param {number} y - Y index.
     */
    getCell(x, y) {
        return this.cell2DArray.get2D(x, y);
    }
    /**
     * Returns the x and y index of the given cell.
     * @param cell
     */
    getCellIndex(cell) {
        return this.cellIndexMap.get(cell) || { x: -1, y: -1 };
    }
    /**
     * (To be filled)
     * @param referenceCell
     * @param {number} relX
     * @param {number} relY
     * @param {boolean} loopAtEndOfScreen
     */
    getRelativePositionCell(referenceCell, relX, relY, loopAtEndOfScreen) {
        if (referenceCell === this.nullCell)
            return referenceCell;
        if (relX === 0 && relY === 0)
            return referenceCell;
        const referenceIndex = this.getCellIndex(referenceCell);
        const targetIndex = {
            x: referenceIndex.x + relX,
            y: referenceIndex.y + relY,
        };
        if (loopAtEndOfScreen) {
            if (targetIndex.x < 0)
                targetIndex.x += this.cell2DArray.xCount;
            else if (targetIndex.x >= this.cell2DArray.xCount)
                targetIndex.x -= this.cell2DArray.xCount;
            if (targetIndex.y < 0)
                targetIndex.y += this.cell2DArray.yCount;
            else if (targetIndex.y >= this.cell2DArray.yCount)
                targetIndex.y -= this.cell2DArray.yCount;
        }
        else {
            if (targetIndex.x < 0 || targetIndex.x >= this.cell2DArray.xCount ||
                targetIndex.y < 0 || targetIndex.y >= this.cell2DArray.yCount)
                return this.nullCell;
        }
        return this.cell2DArray.get2D(targetIndex.x, targetIndex.y);
    }
    setNeighborCells(referenceCell, neighborRange, loopAtEndOfScreen) {
        for (let relativeX = -neighborRange; relativeX <= neighborRange; relativeX += 1) {
            for (let relativeY = -neighborRange; relativeY <= neighborRange; relativeY += 1) {
                referenceCell.setNeighborCell(relativeX, relativeY, this.getRelativePositionCell(referenceCell, relativeX, relativeY, loopAtEndOfScreen));
            }
        }
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
 * (To be filled)
 */
class FrameCounter {
    constructor() {
        this.count = 0;
    }
    /**
     * Resets the counter.
     * @param count
     */
    resetCount(count = 0) {
        this.count = count;
        return this;
    }
    /**
     * Increments the frame count.
     */
    step() {
        this.count += 1;
    }
    /**
     * Returns the mod.
     * @param divisor
     */
    mod(divisor) {
        return this.count % divisor;
    }
}

/**
 * (To be filled)
 */
class TimedFrameCounter extends FrameCounter {
    /**
     * True if this counter is activated.
     */
    get isOn() { return this._isOn; }

    /**
     *
     * @param durationFrameCount
     * @param completeBehavior
     */
    constructor(durationFrameCount, completeBehavior = EMPTY_FUNCTION) {
        super();
        this._isOn = true;
        this.completeBehavior = completeBehavior;
        this.durationFrameCount = durationFrameCount;
    }
    /**
     * Activate this counter.
     * @param duration
     * @chainable
     */
    on(duration) {
        this._isOn = true;
        if (duration)
            this.durationFrameCount = duration;
        return this;
    }
    /**
     * Deactivate this counter.
     * @chainable
     */
    off() {
        this._isOn = false;
        return this;
    }
    /**
     * @override
     */
    step() {
        if (!this._isOn)
            return;
        this.count += 1;
        if (this.count > this.durationFrameCount) {
            this.completeCycle();
        }
    }
}

/**
 * (To be filled)
 */
class NonLoopedFrameCounter extends TimedFrameCounter {
    /**
     * True if the given frame count duration has ellapsed already.
     */
    get isCompleted() { return this._isCompleted; }

    /**
     *
     * @param durationFrameCount
     * @param completeBehavior
     */
    constructor(durationFrameCount, completeBehavior) {
        super(durationFrameCount, completeBehavior);
        this._isCompleted = false;
    }
    /**
     * @override
     * @chainable
     */
    on(duration) {
        super.on(duration);
        return this;
    }
    /**
     * @override
     * @chainable
     */
    off() {
        super.off();
        return this;
    }
    /**
     * @override
     */
    resetCount() {
        super.resetCount();
        this._isCompleted = false;
        return this;
    }
    /**
     * @override
     */
    getProgressRatio() {
        return this._isCompleted ? 1 : this.count / this.durationFrameCount;
    }
    /**
     * @override
     */
    completeCycle() {
        this._isCompleted = true;
        this._isOn = false;
        this.completeBehavior();
    }
}

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

/**
 * function parseRle()
 *
 * Original code:
 *   "ca-formats" v0.0.0
 *   © 2018 Jamen Marz
 *   MIT license
 *   https://github.com/jamen/ca-formats
 *
 * Modification by FAL.
 *
 * @param s - The string value to be parsed.
 */
function parseRle(s) {
    const str = s.replace(/^#.*$/g, '');
    const cells = [];
    let b = 0;
    let x = 0;
    let y = 0;
    for (let i = 0; i < str.length; i += 1) {
        const char = str[i];
        const rs = b < i && str.slice(b, i);
        const r = rs ? parseInt(rs, 10) : 1;
        if (char === 'o') {
            for (let p = 0; p < r; p += 1) {
                cells.push(x, y);
                x += 1;
            }
        }
        else if (char === 'b') {
            x += r;
        }
        else if (char === '$') {
            y += r;
            x = 0;
        }
        else if (char === 'x' || char === 'y') {
            i = str.indexOf('\n', i);
        }
        if (char === 'o' || char === 'b' || char === '$' || char === 'x' || char === 'y') {
            b = i + 1;
        }
    }
    return cells;
}

p5.disableFriendlyErrors = true;
function setPixelRange(graphics, x, y, size, red, green, blue) {
    const g = graphics;
    const w = g.width * g.pixelDensity();
    for (let i = 0; i < size; i += 1) {
        for (let j = 0; j < size; j += 1) {
            const idx = 4 * ((y + j) * w + (x + i));
            g.pixels[idx] = red;
            g.pixels[idx + 1] = green;
            g.pixels[idx + 2] = blue;
        }
    }
}
class LifeGrid extends Grid {
    constructor(p, cellsData, marginCellCount) {
        super(Math.max(...cellsData) + 1 + 2 * marginCellCount, Math.max(...cellsData) + 1 + 2 * marginCellCount, 1, false, (neighborRange) => { return new LifeCell(p); }, new LifeCell(p));
        this.p = p;
        this.cellPixelSize = new NumberContainer(1);
        this.generationIntervalFrameCount = 1;
        this.generationPreparationFrameCount = 0;
        this.drawCell = (cell) => {
            const index = this.getCellIndex(cell);
            cell.draw(index.x, index.y, this.cellPixelSize.value);
        };
        this.cellCountLevel = Math.max(...cellsData) + 1 + 2 * marginCellCount;
        this.updateSize();
        for (let i = 0, len = cellsData.length; i < len; i += 2) {
            const cell = this.getCell(cellsData[i] + marginCellCount, cellsData[i + 1] + marginCellCount);
            if (cell)
                cell.setAlive();
        }
        this.generationPreparationCellsPerFrame =
            Math.ceil(this.cell2DArray.length / this.generationIntervalFrameCount);
    }
    updateSize() {
        this.cellPixelSize.value = Math.floor(this.p.pixelDensity() * Math.min(this.p.width, this.p.height) / this.cellCountLevel);
    }
    step() {
        this.cell2DArray.loop(this.stepCell);
        this.prepareNextGeneration();
    }
    prepareNextGeneration() {
        for (let i = this.generationPreparationCellsPerFrame * this.generationPreparationFrameCount, len = Math.min(this.generationPreparationCellsPerFrame * (this.generationPreparationFrameCount + 1), this.cell2DArray.length); i < len; i += 1) {
            this.cell2DArray.get(i).determineNextState();
        }
        this.generationPreparationFrameCount += 1;
        if (this.generationPreparationFrameCount >= this.generationIntervalFrameCount) {
            this.cell2DArray.loop(this.gotoNextState);
            this.generationPreparationFrameCount = 0;
        }
    }
    draw() {
        this.cell2DArray.loop(this.drawCell);
    }
    stepCell(cell) {
        cell.step();
    }
    gotoNextState(cell) {
        cell.gotoNextState();
    }
}
class LifeCell extends NaiveCell {
    constructor(p) {
        super(1);
        this.p = p;
        this.birthIndicator = false;
        this.isAlive = false;
        this.willBeAlive = false;
        this.position = p.createVector();
        this.deathTimer = new NonLoopedFrameCounter(Math.floor(p.idealFrameRate / 3)).off();
    }
    step() {
        this.deathTimer.step();
    }
    determineNextState() {
        const aliveNeighborsCount = this.countAliveNeighbors();
        if (!this.isAlive) {
            this.willBeAlive = (aliveNeighborsCount === 3);
        }
        else {
            this.willBeAlive = (aliveNeighborsCount === 2 || aliveNeighborsCount === 3);
        }
    }
    gotoNextState() {
        if (this.willBeAlive)
            this.setAlive();
        else
            this.setDead();
    }
    draw(xIndex, yIndex, pixelSize) {
        let colorValue;
        if (this.birthIndicator)
            colorValue = [48, 48, 48];
        else if (this.deathTimer.isOn) {
            const ratio = this.deathTimer.getProgressRatio();
            colorValue = [
                224 + Math.floor(ratio * 28),
                224 + Math.floor(ratio * 28),
                255,
            ];
        }
        else
            return;
        setPixelRange(this.p, xIndex * pixelSize, yIndex * pixelSize, pixelSize, colorValue[0], colorValue[1], colorValue[2]);
        this.birthIndicator = false;
    }
    countAliveNeighbors() {
        let aliveNeighborCells = 0;
        for (let i = 0, len = this.neighborCells.length; i < len; i += 1) {
            if (this.neighborCells.get(i) === this)
                continue;
            if (this.neighborCells.get(i).isAlive)
                aliveNeighborCells += 1;
        }
        return aliveNeighborCells;
    }
    setAlive() {
        if (this.isAlive)
            return;
        this.deathTimer.resetCount().off();
        this.isAlive = true;
        this.birthIndicator = true;
    }
    setDead() {
        if (!this.isAlive)
            return;
        this.deathTimer.on();
        this.isAlive = false;
    }
}
const rectangleLives = (rlePath, marginCellCount = 1, htmlElementId = 'RectangleLives') => {
    // const SKETCH_NAME = 'RectangleLives';
    const OPENPROCESSING = true;
    if (OPENPROCESSING)
        new p5();
    const sketch = (p) => {
        // ---- constants
        // ---- variables
        let initialCellsData;
        let grid;
        // ---- functions
        function parse(strArray) {
            let rawData = '';
            for (const strLine of strArray) {
                const firstChar = strLine.charAt(0);
                if (firstChar === '#' || firstChar === 'x')
                    continue;
                rawData += strLine;
            }
            initialCellsData = parseRle(rawData);
        }
        // ---- Setup & Draw etc.
        p.preload = () => {
            console.log('Loading ' + rlePath + ' ...');
            p.loadStrings(rlePath, (strArray) => {
                console.log('Loaded.');
                console.log('Parsing ' + rlePath + ' ...');
                parse(strArray);
                console.log('Parsed.');
            });
        };
        p.setup = () => {
            if (OPENPROCESSING)
                window.noCanvas();
            p.createScalableCanvas(ScalableCanvasTypes.FULL);
            p.setFrameRate(30);
            p.noStroke();
            grid = new LifeGrid(p, initialCellsData, marginCellCount);
            p.background(252, 252, 255);
            p.loadPixels();
        };
        p.draw = () => {
            // p.scalableCanvas.scale();
            grid.step();
            grid.draw();
            p.updatePixels();
            // p.scalableCanvas.cancelScale();
        };
        p.windowResized = () => {
            // p.resizeScalableCanvas();
        };
        p.mousePressed = () => {
        };
        p.touchMoved = () => {
            // return false;
        };
    };
    new p5exClass(sketch, htmlElementId);
};

return rectangleLives;

}());
//# sourceMappingURL=sketch.js.map
