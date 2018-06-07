/**
 * Boolean Network.
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
/**
 * Multiplies the given matrix and array.
 * The number of matrix columns and the array length must be identical.
 * @param {number[][]} matrix - Any matrix.
 * @param {number[]} array - Any one-dimensional array of numbers.
 * @param {number[]} [target] - Target array for receiving the result.
 * @returns Product of the given values as an array.
 */
function multiplyMatrixAndArray(matrix, array, target) {
    const matrixRowCount = matrix.length;
    const matrixColumnCount = matrix[0].length;

    const resultArray = target || new Array(matrixRowCount);

    for (let row = 0; row < matrixRowCount; row += 1) {
        resultArray[row] = 0;
        for (let col = 0; col < matrixColumnCount; col += 1) {
            resultArray[row] += matrix[row][col] * array[col];
        }
    }
    return resultArray;
}
const TWO_PI = 2 * Math.PI;
/**
 * Calculates the direction angle from one vector to another.
 * @param referencePosition
 * @param targetPosition
 */
function getDirectionAngle(referencePosition, targetPosition) {
    return Math.atan2(targetPosition.y - referencePosition.y, targetPosition.x - referencePosition.x);
}
// Temporal vectors for calculation use in getClosestPositionOnLineSegment()
const tmpVectorAP = dummyP5.createVector();
const tmpVectorAB = dummyP5.createVector();
/**
 * Returns random integer from 0 up to (but not including) the max number.
 */
function randomInt(maxInt) {
    return Math.floor(Math.random() * maxInt);
}
/**
 * Returns and removes one array element randomly.
 * @param array
 */
function popRandom(array) {
    return array.splice(randomInt(array.length), 1)[0];
}
/**
 * easeOutQuad.
 * @param ratio
 */
function easeOutQuad(ratio) {
    return -Math.pow(ratio - 1, 2) + 1;
}

function createCielabToXyzFunc() {
    const delta = 6 / 29;
    const constantA = 16 / 116;
    const constantB = 3 * delta * delta;
    return (value) => {
        if (value > delta)
            return value * value * value;
        return (value - constantA) * constantB;
    };
}
const cielabToXyzFunc = createCielabToXyzFunc();
/**
 * Converts color values from CIELAB (D65) to XYZ.
 * @param {number[]} cielabValue - Value array of L*, a*, b* (D65).
 * @param {Illuminant} illuminant - Instance of Illuminant.
 * @param {number[]} [target] - Target array for receiving the result.
 * @returns {number[]} XYZ value array.
 */
function cielabValueToXyzValue(cielabValue, illuminant, target) {
    const yFactor = (cielabValue[0] + 16.0) / 116.0;
    const xFactor = yFactor + cielabValue[1] / 500.0;
    const zFactor = yFactor - cielabValue[2] / 200.0;
    if (target) {
        target[0] = illuminant.tristimulusValues[0] * cielabToXyzFunc(xFactor);
        target[1] = illuminant.tristimulusValues[1] * cielabToXyzFunc(yFactor);
        target[2] = illuminant.tristimulusValues[2] * cielabToXyzFunc(zFactor);
        return target;
    }
    return [
        illuminant.tristimulusValues[0] * cielabToXyzFunc(xFactor),
        illuminant.tristimulusValues[1] * cielabToXyzFunc(yFactor),
        illuminant.tristimulusValues[2] * cielabToXyzFunc(zFactor),
    ];
}

/**
 * Matrix for conversion color values from XYZ to linear RGB.
 * Values from "7. Conversion from XYZ (D65) to linear sRGB values" in
 * http://www.color.org/chardata/rgb/sRGB.pdf (April 2015)
 * @constant {number[][]} xyzToLinearRgbConversionMatrix
 * @ignore
 */
const xyzToLinearRgbConversionMatrix = [
    [3.2406255, -1.537208, -0.4986286],
    [-0.9689307, 1.8757561, 0.0415175],
    [0.0557101, -0.2040211, 1.0569959],
];
/**
 * Matrix for converting color values from linear RGB to XYZ.
 * This is an inversed matrix of xyzToLinearRgbConversionMatrix
 * which is pre-calculated by math.js.
 * @constant {number[][]} linearRgbToXyzConversionMatrix
 * @ignore
 */

/**
 * CIE standard illuminant.
 */
class Illuminant {
    constructor(name, tristimulusValues) {
        this.name = name;
        this.tristimulusValues = tristimulusValues;
    }
}

/**
 * Map of illuminants.
 */
const Illuminants = {
    D50: new Illuminant('D50', [0.9642, 1.0000, 0.8251]),
    D55: new Illuminant('D55', [0.9568, 1.0000, 0.9214]),
    D65: new Illuminant('D65', [0.95047, 1.00000, 1.08883]),
    E: new Illuminant('E', [1, 1, 1]),
};

/**
 * Applies display gamma correction to the given number.
 * @param value - any number in a linear color space (0 - 1).
 * @ignore
 */
function degamma(value) {
    if (value <= 0.0031308)
        return 12.92 * value;
    return 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
}

let currentIlluminant = Illuminants.D50;
const temporalArray1 = [0, 0, 0];
const temporalArray2 = [0, 0, 0];
const temporalArray3 = [0, 0, 0];
const temporalArray4 = [0, 0, 0];
function assignArray(array, v0, v1, v2) {
    array[0] = v0;
    array[1] = v1;
    array[2] = v2;
    return array;
}
/**
 * Clips the given linear RGB factor to the valid range (0 - 1)
 * and converts it to an sRGB value (0 - 255).
 * @param factor - Factor of either red, green or blue in the linear RGB color space.
 * @returns sRGB value.
 * @ignore
 */
function linearRgbFactorToSrgbValue(factor) {
    return degamma(Math.min(Math.max(factor, 0), 1)) * 255;
}
/**
 * Converts CIELAB values to an array of RGB values (0 - 255).
 * @param {number} lValue - L*: Lightness (0 - 100)
 * @param {number} aValue - a* (0 - ca. 100)
 * @param {number} bValue - b* (0 - ca. 100)
 * @param {number} [alphaValue] - Alhpa value (0 - 255)
 * @returns New Array of sRGB values.
 */
function cielabColor(lValue, aValue, bValue, alphaValue) {
    const labValue = assignArray(temporalArray1, lValue, aValue, bValue);
    const xyzValue = cielabValueToXyzValue(labValue, currentIlluminant, temporalArray2);
    const rgbFactor = multiplyMatrixAndArray(xyzToLinearRgbConversionMatrix, xyzValue, temporalArray3);
    const srgbValue = assignArray(temporalArray4, linearRgbFactorToSrgbValue(rgbFactor[0]), linearRgbFactorToSrgbValue(rgbFactor[1]), linearRgbFactorToSrgbValue(rgbFactor[2]));
    return alphaValue ? [
        srgbValue[0],
        srgbValue[1],
        srgbValue[2],
        alphaValue,
    ] : [
        srgbValue[0],
        srgbValue[1],
        srgbValue[2],
    ];
}
/**
 * Converts CIELCh values to an array of RGB values (0 - 255).
 * @param {number} lValue - L*: Lightness (0 - 100)
 * @param {number} cValue - C*: Chroma (0 - ca. 100)
 * @param {number} hValue - h*: Hue (0 - 2PI)
 * @param {number} [alphaValue] - Alhpa value (0 - 255)
 */
function cielchColor(lValue, cValue, hValue, alphaValue) {
    return cielabColor(lValue, cValue * Math.cos(hValue), cValue * Math.sin(hValue), alphaValue);
}

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
/**
 * Fill the canvas or graphics (according to p.currentRenderer) with gradation.
 * @param p
 * @param backgroundColor
 * @param fromColor
 * @param toColor
 * @param lerpRatioExponent
 */
function gradationBackground(p, backgroundColor, fromColor, toColor, lerpRatioExponent = 1) {
    const g = p.currentRenderer;
    g.background(backgroundColor);
    g.strokeWeight(2);
    for (let y = 0; y < g.width; y += 1) {
        const lerpRatio = Math.pow(y / (g.height - 1), lerpRatioExponent);
        g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
        g.line(0, y, g.width - 1, y);
    }
}

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

p5.disableFriendlyErrors = true;
const SKETCH_NAME = 'BooleanNetwork';
const OPENPROCESSING = false;
if (OPENPROCESSING)
    new p5();
/*
function easeOutInQuad(ratio: number): number {
  return ratio < 0.5 ? p5ex.easeOutQuad(2 * ratio) / 2 : 0.5 + Math.pow(2 * (ratio - 0.5), 2) / 2;
}
*/
function easeInOutQuad(ratio) {
    return ratio < 0.5 ? Math.pow(2 * ratio, 2) / 2 : 0.5 + easeOutQuad(2 * (ratio - 0.5)) / 2;
}
// boolean functions
const copyFunction = (input) => { return input[0]; };
const notFunction = (input) => { return !input[0]; }; // not
const andFunction = (input) => { return input[0] && input[1]; }; // and
const orFunction = (input) => { return input[0] || input[1]; }; // or
const nandFunction = (input) => { return !andFunction(input); }; // nand
const norFunction = (input) => { return !orFunction(input); }; // nor
const xorFunction = (input) => { return input[0] ^ input[1]; }; // xor
const xnorFunction = (input) => { return !xorFunction(input); }; // xnor
const andFunction3 = (input) => { return input[0] && input[1] && input[2]; }; // and
const orFunction3 = (input) => { return input[0] || input[1] || input[2]; }; // or
const nandFunction3 = (input) => { return !andFunction3(input); }; // nand
const norFunction3 = (input) => { return !orFunction3(input); }; // nor
class BooleanNode {
    constructor(p) {
        this.p = p;
        this.isNull = false;
        this.state = true; // Math.random() < 0.5 ? true : false;
        this.predecessorNodes = [];
        this.previousState = this.state;
        this.booleanFunction = (input) => { return true; };
        this.markScaleFactor = 1;
        this.position = p.createVector();
        this.nodeColor = new ShapeColor(p, null, p.color(cielchColor(70, 80, p.random(p.TWO_PI))));
        this.markColor = new ShapeColor(p, p.color(32), null);
    }
    step() {
        const currentCycleFrameCount = this.p.frameCount % this.p.idealFrameRate;
        const progressRatio = currentCycleFrameCount / this.p.idealFrameRate;
        this.markScaleFactor = easeOutQuad(Math.min(Math.min(progressRatio, 1 - progressRatio) * 5, 1));
        switch (currentCycleFrameCount) {
            case 0:
                const input = [];
                for (const predecessor of this.predecessorNodes) {
                    input.push(predecessor.state);
                }
                this.state = this.booleanFunction(input);
                break;
            case 1:
                this.previousState = this.state;
                break;
        }
    }
    draw() {
        const p = this.p;
        const position = this.position;
        // this.nodeColor.applyColor();
        // p.ellipse(position.x, position.y, 40, 40);
        this.markColor.applyColor();
        if (this.state) {
            p.strokeWeight(4.5);
            const halfLength = this.markScaleFactor * 12;
            p.line(position.x, position.y - halfLength, position.x, position.y + halfLength);
        }
        else {
            p.strokeWeight(4);
            const diameter = this.markScaleFactor * 20;
            p.ellipse(position.x, position.y, diameter, diameter);
        }
    }
    setPosition(position) {
        this.position.set(position);
    }
    receivesFrom(otherNode) {
        for (const predecessor of this.predecessorNodes) {
            if (predecessor === otherNode)
                return true;
        }
        return false;
    }
    setBooleanFunction() {
        switch (this.predecessorNodes.length) {
            case 0:
                throw 'Found no predecessor nodes.';
            case 1:
                this.booleanFunction = this.p.random([
                    copyFunction,
                    notFunction,
                ]);
                break;
            case 2:
                this.booleanFunction = this.p.random([
                    andFunction,
                    orFunction,
                    nandFunction,
                    norFunction,
                    xorFunction,
                    xorFunction,
                    xnorFunction,
                    xnorFunction,
                ]);
                break;
            default:
                this.booleanFunction = this.p.random([
                    andFunction3,
                    orFunction3,
                    nandFunction3,
                    norFunction3,
                ]);
                break;
        }
    }
}
class BooleanEdge {
    constructor(p, nodeA, nodeB) {
        this.p = p;
        this.nodeA = nodeA;
        this.nodeB = nodeB;
        this.lineColor = p.color(32);
        this.onColor = new ShapeColor(p, null, p.color(96, 192, 96));
        this.offColor = new ShapeColor(p, null, p.color(128, 128, 192));
        this.startPoint = p.createVector();
        this.endPoint = p.createVector();
    }
    updatePosition() {
        const A = this.nodeA.position;
        const B = this.nodeB.position;
        const angle = getDirectionAngle(A, B);
        const offset = 35;
        this.startPoint.set(A.x + offset * Math.cos(angle), A.y + offset * Math.sin(angle));
        this.endPoint.set(B.x - offset * Math.cos(angle), B.y - offset * Math.sin(angle));
    }
    step() {
    }
    draw() {
        this.p.stroke(this.lineColor);
        this.p.strokeWeight(1);
        this.p.line(this.startPoint.x, this.startPoint.y, this.endPoint.x, this.endPoint.y);
        const currentCycleFrameCount = this.p.frameCount % this.p.idealFrameRate;
        if (currentCycleFrameCount === 0)
            return;
        const progressRatio = currentCycleFrameCount / this.p.idealFrameRate;
        const easingRatio = easeInOutQuad(progressRatio);
        const alphaRatio = Math.sin(Math.PI * progressRatio);
        const size = alphaRatio * 8;
        const x = this.p.lerp(this.startPoint.x, this.endPoint.x, easingRatio);
        const y = this.p.lerp(this.startPoint.y, this.endPoint.y, easingRatio);
        if (this.nodeA.state)
            this.onColor.applyColor();
        else
            this.offColor.applyColor();
        this.p.ellipse(x, y, size, size);
    }
}
const sketch = (p) => {
    // ---- variables
    let backgroundPixels;
    let timeoutId = -1;
    const booleanNodes = new SpriteArray(16);
    const booleanEdges = new SpriteArray();
    function getNearestNode(booleanNodes, xIndex, yIndex, xIndexChange, yIndexChange, shallow = false) {
        let result = null;
        let currentXIndex = xIndex;
        let currentYIndex = yIndex;
        while (result === null) {
            currentXIndex += xIndexChange;
            if (currentXIndex < 0 || currentXIndex >= booleanNodes.xCount)
                break;
            currentYIndex += yIndexChange;
            if (currentYIndex < 0 || currentYIndex >= booleanNodes.yCount)
                break;
            const currentNode = booleanNodes.get2D(currentXIndex, currentYIndex);
            if (currentNode.isNull)
                continue;
            result = currentNode;
        }
        return result;
    }
    function getNearestNodes(booleanNodes, xIndex, yIndex) {
        const result = [];
        const indexSet = [
            [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1],
        ];
        for (const index of indexSet) {
            const nearestNode = getNearestNode(booleanNodes, xIndex, yIndex, index[0], index[1]);
            if (nearestNode)
                result.push(nearestNode);
        }
        return result;
    }
    function createNetwork(xCount = 5, yCount = 5, nullCount = 7) {
        booleanNodes.clear();
        booleanEdges.clear();
        const nodeCandidates = new TwoDimensionalArray(xCount, yCount, new BooleanNode(p));
        for (let i = 0; i < nodeCandidates.length; i += 1) {
            nodeCandidates.array[i] = new BooleanNode(p);
        }
        const nullNodeCandidates = nodeCandidates.array.slice(0, nodeCandidates.length);
        for (let i = 0; i < nullCount; i += 1) {
            popRandom(nullNodeCandidates).isNull = true;
        }
        for (let i = 0; i < xCount; i += 1) {
            const x = (1 + i) * (p.nonScaledWidth / (xCount + 1));
            for (let k = 0; k < yCount; k += 1) {
                const currentNode = nodeCandidates.get2D(i, k);
                if (currentNode.isNull)
                    continue;
                const y = (1 + k) * (p.nonScaledHeight / (yCount + 1));
                currentNode.setPosition(p.createVector(x, y));
                const predecessorCandidates = getNearestNodes(nodeCandidates, i, k);
                const requiredPredecessorCount = Math.min(p.random([1, 2, 3]), predecessorCandidates.length);
                while (currentNode.predecessorNodes.length < requiredPredecessorCount) {
                    if (predecessorCandidates.length <= 0)
                        return false; // for safety; not necessary
                    const predecessor = popRandom(predecessorCandidates);
                    const newEdge = new BooleanEdge(p, predecessor, currentNode);
                    if (predecessor.receivesFrom(currentNode))
                        continue;
                    currentNode.predecessorNodes.push(predecessor);
                    booleanEdges.push(newEdge);
                }
                booleanNodes.push(currentNode);
            }
        }
        return true;
    }
    function resetNetwork() {
        let retryCount = 0;
        while (!createNetwork()) {
            retryCount += 1;
            if (retryCount > 1000)
                throw 'Could not create a valid boolean network.';
        }
        booleanNodes.loop((n) => { n.setBooleanFunction(); });
        booleanEdges.loop((e) => { e.updatePosition(); });
    }
    function reset() {
        p.background(255);
        gradationBackground(p, p.color(255), p.color(255), p.color(248, 248, 252), 2);
        p.loadPixels();
        backgroundPixels = p.pixels;
        resetNetwork();
    }
    // ---- Setup & Draw etc.
    p.preload = () => {
    };
    p.setup = () => {
        if (OPENPROCESSING)
            window.noCanvas();
        p.createScalableCanvas(ScalableCanvasTypes.SQUARE640x640);
        p.setFrameRate(60);
        p.rectMode(p.CENTER);
        reset();
    };
    p.draw = () => {
        p.pixels = backgroundPixels;
        p.updatePixels();
        p.scalableCanvas.scale();
        booleanNodes.step();
        booleanEdges.step();
        booleanEdges.draw();
        booleanNodes.draw();
        p.scalableCanvas.cancelScale();
    };
    p.windowResized = () => {
        p.resizeScalableCanvas();
        if (timeoutId !== -1)
            clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { reset(); }, 200);
    };
    p.mouseClicked = () => {
        resetNetwork();
    };
};
new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
