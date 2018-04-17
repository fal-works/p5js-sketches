/**
 * Koenigsberk.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

/**
 * CAUTION: Super dirty codes!!!
 */

(function () {
'use strict';

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

/**
 * Calculates the squared value of the Euclidean distance between
 * two points (considering a point as a vector object).
 */
function distSq(v1, v2) {
    return Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2) + Math.pow(v2.z - v1.z, 2);
}
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
 * Calculates the difference between two angles in range of -PI to PI.
 * @param angleA - the angle to subtract from
 * @param angleB - the angle to subtract
 */
function angleDifference(angleA, angleB) {
    let diff = (angleA - angleB) % TWO_PI;
    if (diff < -Math.PI)
        diff += TWO_PI;
    else if (diff > Math.PI)
        diff -= TWO_PI;
    return diff;
}
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
 * Returns random integer from the min number up to (but not including) the max number.
 */
function randomIntBetween(minInt, maxInt) {
    return minInt + randomInt(maxInt - minInt);
}

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
/**
 * easeOutQuart.
 * @param ratio
 */
function easeOutQuart(ratio) {
    return -Math.pow(ratio - 1, 4) + 1;
}

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
    contains(position) {
        return (position.x >= this.leftPositionX && position.x <= this.rightPositionX &&
            position.y >= this.topPositionY && position.y <= this.bottomPositionY);
    }
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
 * A Naive implementation of an edge between two objects.
 */
class NaiveEdge {
    /**
     *
     * @param nodeA
     * @param nodeB
     */
    constructor(nodeA, nodeB) {
        this.nodeA = nodeA;
        this.nodeB = nodeB;
    }
    /**
     * Returns true if the provided node is incident to this edge.
     * @param node
     */
    isIncidentTo(node) {
        return node === this.nodeA || node === this.nodeB;
    }
    /**
     * Returns the adjacent node of the given node via this edge.
     * If this edge is not incident to the given node, returns always the end point node.
     * @param {T} node - any node which is incident to this edge
     */
    getAdjacentNode(node) {
        if (node === this.nodeB)
            return this.nodeA;
        return this.nodeB;
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
 * Trimmable quadratic bezier curve.
 */
class QuadraticBezierCurve {
    /**
     *
     * @param p
     * @param startPoint
     * @param controlPoint
     * @param endPoint
     * @param resolution
     * @param startRatioRef
     * @param endRatioRef
     */
    constructor(p, startPoint, controlPoint, endPoint, resolution, startRatioRef, endRatioRef) {

        this.pointList = new Array(resolution + 1);
        this.resolution = resolution;
        this.startRatio = startRatioRef;
        this.endRatio = endRatioRef;
        this.p = p;
        for (let i = 0; i <= resolution; i += 1) {
            const ratio2 = i / resolution;
            const ratio1 = 1 - ratio2;
            tmpMidPoint1.set(ratio1 * startPoint.x + ratio2 * controlPoint.x, ratio1 * startPoint.y + ratio2 * controlPoint.y);
            tmpMidPoint2.set(ratio1 * controlPoint.x + ratio2 * endPoint.x, ratio1 * controlPoint.y + ratio2 * endPoint.y);
            this.pointList[i] = p.createVector(ratio1 * tmpMidPoint1.x + ratio2 * tmpMidPoint2.x, ratio1 * tmpMidPoint1.y + ratio2 * tmpMidPoint2.y);
        }
    }
    /**
     * Returns true if the provided control point candidate is valid.
     * @param controlPoint - The control point candidate to be checked.
     * @param startPoint - The start point of the bezier curve.
     * @param endPoint - The start point of the bezier curve.
     * @param minDistance - Minimum distance between the control point and the start/end point.
     * @param minAngle - Minimum angle of the control point.
     * @param maxAngle - Maximum angle of the control point.
     * @static
     */
    static checkControlPoint(controlPoint, startPoint, endPoint, minDistance, minAngle, maxAngle) {
        const minDistanceSquared = minDistance * minDistance;
        if (distSq(controlPoint, startPoint) < minDistanceSquared)
            return false;
        if (distSq(controlPoint, endPoint) < minDistanceSquared)
            return false;
        const angle = Math.abs(angleDifference(getDirectionAngle(controlPoint, startPoint), getDirectionAngle(controlPoint, endPoint)));
        if (angle < minAngle)
            return false;
        if (angle > maxAngle)
            return false;
        return true;
    }
    draw() {
        const startIndex = Math.floor(this.startRatio.value * this.resolution);
        const endIndex = Math.floor(this.endRatio.value * this.resolution);
        const indexRemainder = this.endRatio.value * this.resolution - endIndex;
        const renderer = this.p.currentRenderer;
        const points = this.pointList;
        renderer.beginShape();
        for (let i = startIndex; i <= endIndex; i += 1) {
            renderer.vertex(points[i].x, points[i].y);
        }
        if (indexRemainder > 0) {
            renderer.vertex(points[endIndex].x + indexRemainder * (points[endIndex + 1].x - points[endIndex].x), points[endIndex].y + indexRemainder * (points[endIndex + 1].y - points[endIndex].y));
        }
        renderer.endShape();
    }
}

/**
 * (To be filled)
 */
class KinematicQuantity {
    constructor() {
        this.position = new p5.Vector();
        this.velocity = new p5.Vector();
    }
    /**
     * Updates the position.
     */
    step() {
        this.position.add(this.velocity);
    }
    /**
     * Returns the current speed.
     */
    getSpeed() {
        return this.velocity.mag();
    }
    /**
     * Returns the current direction angle.
     */
    getDirection() {
        return this.velocity.heading();
    }
    /**
     * Adds the given value to the current speed.
     * @param speedChange
     */
    addSpeed(speedChange) {
        this.velocity.setMag(Math.max(0, this.velocity.mag() + speedChange));
    }
}

const temporalVector = dummyP5.createVector();
/**
 * (To be filled)
 */
class PhysicsBody {
    constructor() {
        this.kinematicQuantity = new KinematicQuantity();
        this.position = this.kinematicQuantity.position;
        this.velocity = this.kinematicQuantity.velocity;
        this.mass = 1;
        this.collisionRadius = 0;
        this.hasFriction = false;
        this.decelerationFactor = 1;
    }
    /**
     * X position.
     */
    get x() {
        return this.position.x;
    }
    /**
     * Y position.
     */
    get y() {
        return this.position.y;
    }
    /**
     * Z position.
     */
    get z() {
        return this.position.z;
    }
    /**
     * X velocity.
     */
    get vx() {
        return this.velocity.x;
    }
    /**
     * Y velocity.
     */
    get vy() {
        return this.velocity.y;
    }
    /**
     * Z velocity.
     */
    get vz() {
        return this.velocity.z;
    }
    /**
     * Returns the current speed.
     */
    getSpeed() {
        return this.kinematicQuantity.getSpeed();
    }
    /**
     * Returns the current direction angle.
     */
    getDirection() {
        return this.kinematicQuantity.getDirection();
    }
    /**
     * Sets the friction of the body.
     * @param constant
     */
    setFriction(constant) {
        if (constant === 0) {
            this.hasFriction = false;
            return;
        }
        this.hasFriction = true;
        this.decelerationFactor = 1 - constant;
    }
    /**
     * Constrains the current speed. Should be called every time if needed.
     * @param maxSpeed
     */
    constrainSpeed(maxSpeed) {
        if (this.velocity.magSq() > maxSpeed * maxSpeed)
            this.velocity.setMag(maxSpeed);
    }
    /**
     * Updates the body.
     */
    step() {
        this.kinematicQuantity.step();
        if (this.hasFriction) {
            this.kinematicQuantity.velocity.mult(this.decelerationFactor);
        }
    }
    /**
     * Accelerates the body.
     * @param x
     * @param y
     * @param z
     */
    accelerate(x, y, z) {
        this.kinematicQuantity.velocity.add(x, y, z);
    }
    /**
     * Apply the provided force to the body.
     * @param force
     */
    applyForce(force) {
        this.accelerate(force.x / this.mass, force.y / this.mass, force.z / this.mass);
    }
    /**
     * Add the provided value to the speed of the body.
     * @param speedChange
     */
    addSpeed(speedChange) {
        this.kinematicQuantity.addSpeed(speedChange);
    }
    /**
     * Returns true if the body collides the provided body.
     * @param other
     */
    collides(other) {
        return (distSq(this.position, other.position) <
            this.collisionRadius * this.collisionRadius + other.collisionRadius * other.collisionRadius);
    }
    /**
     * (To be filled)
     * @param normalUnitVector
     * @param restitution
     */
    bounce(normalUnitVector, restitution = 1) {
        this.velocity.add(p5.Vector.mult(normalUnitVector, (1 + restitution) * p5.Vector.dot(this.velocity, p5.Vector.mult(normalUnitVector, -1))));
    }
    /**
     * Applies attraction force to both this and the target body.
     * @param {PhysicsBody} other - the other body to interact with
     * @param {number} magnitudeFactor - the factor of magnitude other than the distance
     * @param {number} minMag - the minimum magnitude
     * @param {number} maxMag - the maximum magnitude
     * @param {number} cutoffMag - does not apply force if magnitude is smaller than this
     */
    attractEachOther(other, magnitudeFactor, minMag = 0, maxMag, cutoffMag) {
        const force = this.calculateAttractionForce(other.position, magnitudeFactor, minMag, maxMag, cutoffMag);
        if (!force)
            return;
        this.applyForce(force);
        force.mult(-1);
        other.applyForce(force);
    }
    /**
     * Applies attraction force to this body.
     * @param {p5.Vector} targetPosition - the target position
     * @param {number} magnitudeFactor - the factor of magnitude other than the distance
     * @param {number} minMag - the minimum magnitude
     * @param {number} maxMag - the maximum magnitude
     * @param {number} cutoffMag - does not apply force if magnitude is smaller than this
     */
    attractToPoint(targetPosition, magnitudeFactor, minMag = 0, maxMag, cutoffMag) {
        const force = this.calculateAttractionForce(targetPosition, magnitudeFactor, minMag, maxMag, cutoffMag);
        if (!force)
            return;
        this.applyForce(force);
    }
    calculateAttractionForce(targetPosition, magnitudeFactor, minMag = 0, maxMag, cutoffMag) {
        const tmpVec = temporalVector;
        p5.Vector.sub(targetPosition, this.position, tmpVec); // set relative position
        const distanceSquared = tmpVec.magSq();
        let magnitude = Math.abs(magnitudeFactor) / distanceSquared;
        if (cutoffMag && magnitude < cutoffMag)
            return null;
        if (maxMag)
            magnitude = Math.min(Math.max(magnitude, minMag), maxMag);
        else
            magnitude = Math.max(magnitude, minMag);
        tmpVec.setMag(magnitude); // set force
        if (magnitudeFactor < 0)
            tmpVec.mult(-1);
        return tmpVec;
    }
}

/**
 * Returns the 2D force vector which is to be applied to the load.
 * @param loadDirectionAngle - the direction angle from the fulcrum to the load
 * @param loadDistance - the distance between the fulcrum and the load
 * @param effortDistance - the distance between the fulcrum and the effort
 * @param effortForceMagnitude - the effort force magnitude
 * @param rotateClockwise - true if the load is to be rotated clockwise, otherwise false
 * @param target - the vector to receive the result. Will be newly created if not specified
 */
function calculateLeverageForce(loadDirectionAngle, loadDistance, effortDistance, effortForceMagnitude, rotateClockwise, target) {
    const force = target || dummyP5.createVector();
    const forceDirectionAngle = loadDirectionAngle + (rotateClockwise ? -dummyP5.HALF_PI : dummyP5.HALF_PI);
    force.set(Math.cos(forceDirectionAngle), Math.sin(forceDirectionAngle));
    force.setMag(effortForceMagnitude * effortDistance / loadDistance); // load force
    return force;
}

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

class GraphNode extends PhysicsBody {
    constructor(p) {
        super();
        this.p = p;
        if (!GraphNode.isInitialized) {
            GraphNode.effectColor = new ShapeColor(p, p.color(0, 192), null, true);
            GraphNode.isInitialized = true;
        }
        this.nodeNumber = GraphNode.nextNodeNumber;
        GraphNode.nextNodeNumber += 1;
        this.position.set(p.random(0.25 * p.nonScaledWidth, 0.75 * p.nonScaledWidth), p.random(0.25 * p.nonScaledHeight, 0.75 * p.nonScaledHeight));
        this.setFriction(0.1);
        this.shapeColor = new ShapeColor(p, p.color(64), p.color(cielchColor(80, 50, p.random(p.TWO_PI))));
        this.effectTimer = new NonLoopedFrameCounter(0.5 * p.idealFrameRate).off();
        this.effectPosition = p.createVector();
    }
    step() {
        super.step();
        this.effectTimer.step();
        // if (this.velocity.magSq() < 10000) this.position.sub(this.velocity);
    }
    draw() {
        this.shapeColor.applyColor();
        this.p.strokeWeight(1.5);
        this.p.ellipse(this.position.x, this.position.y, 30, 30);
        if (this.effectTimer.isOn) {
            const ratio = this.effectTimer.getProgressRatio();
            GraphNode.effectColor.applyColor((1 - ratio) * 255);
            this.p.strokeWeight(4 * (1 - ratio));
            const diameter = 30 + 40 * easeOutQuart(ratio);
            this.p.ellipse(this.effectPosition.x, this.effectPosition.y, diameter, diameter);
        }
    }
    fireEffect() {
        this.effectPosition.set(this.position);
        this.effectTimer.resetCount().on();
    }
    toString() {
        return this.nodeNumber;
    }
}
GraphNode.nextNodeNumber = 0;
GraphNode.isInitialized = false;

class PhysicsBodyEdge extends NaiveEdge {
    constructor(p, nodeA, nodeB) {
        super(nodeA, nodeB);
        this.p = p;
        this.relativePositionA = p.createVector();
        this.relativePositionB = p.createVector();
        this.update();
    }
    step() {
        this.update();
    }
    update() {
        this.relativePositionA.set(this.nodeA.position.x - this.nodeB.position.x, this.nodeA.position.y - this.nodeB.position.y);
        this.relativePositionB.set(this.nodeB.position.x - this.nodeA.position.x, this.nodeB.position.y - this.nodeA.position.y);
        this.directionAngleA = this.relativePositionA.heading();
        this.directionAngleB = this.directionAngleA + this.p.PI;
        if (this.directionAngleB > this.p.TWO_PI)
            this.directionAngleB -= this.p.TWO_PI;
        this.distanceSquared = distSq(this.nodeA.position, this.nodeB.position);
    }
    getRelativePosition(referenceNode) {
        if (referenceNode === this.nodeB)
            return this.relativePositionA;
        return this.relativePositionB;
    }
    getDirectionAngle(referenceNode) {
        if (referenceNode === this.nodeB)
            return this.directionAngleA;
        return this.directionAngleB;
    }
}

class PhysicsSpring extends PhysicsBodyEdge {
    constructor(p, nodeA, nodeB, equilibriumLength = 100, springConstant = 0.005) {
        super(p, nodeA, nodeB);
        if (!PhysicsSpring.isInitialized) {
            PhysicsSpring.temporalVector = p.createVector();
            PhysicsSpring.isInitialized = true;
        }
        this.equilibriumLength = equilibriumLength;
        this.springConstant = springConstant;
    }
    step() {
        super.step();
        const bodyA = this.nodeA;
        const bodyB = this.nodeB;
        const stretchLength = this.p.sqrt(this.distanceSquared) - this.equilibriumLength;
        const tmpVec = PhysicsSpring.temporalVector;
        tmpVec.set(this.relativePositionB);
        tmpVec.setMag(this.springConstant * stretchLength); // set spring force to be applied to A
        bodyA.applyForce(tmpVec);
        tmpVec.mult(-1); // set spring force to be applied to B
        bodyB.applyForce(tmpVec);
    }
}
PhysicsSpring.isInitialized = false;

// function drawNoiseLine(
//   p: p5ex.p5exClass,
//   distance: number,
//   amplitude: number,
//   noiseScale: number,
//   noiseOffset: number,
//   noiseTime: number,
//   startRatio: number = 0,
//   endRatio: number = 1,
//   resolution: number = 100,
// ): void {
//   p.beginShape();
//   for (let i = 0; i <= resolution; i += 1) {
//     const currentRatio = i / resolution;
//     if (currentRatio < startRatio || currentRatio > endRatio) continue;
//     const noiseValue = p.sq(p.noise(noiseScale * i + noiseOffset + noiseTime));
//     const y = amplitude * p.map(noiseValue, 0, 1, -1, 1);
//     const yFactor = Math.sin(p.map(i, 0, resolution, 0, p.PI));
//     p.vertex(
//       i * distance / resolution,
//       yFactor * y,
//     );
//   }
//   p.endShape();
// }
class GraphEdge extends PhysicsSpring {
    constructor(p, nodeA, nodeB) {
        super(p, nodeA, nodeB, 200, 0.00001);
        this.startRatio = new NumberContainer(0);
        this.endRatio = new NumberContainer(1);
        if (!GraphEdge.graphEdgeInitialized) {
            GraphEdge.initialColor = new ShapeColor(p, p.color(0, 128), null);
            GraphEdge.finalColor = new ShapeColor(p, p.color(0, 224), null);
            GraphEdge.graphEdgeInitialized = true;
        }
        this.startPointTimer = new NonLoopedFrameCounter(0.5 * p.idealFrameRate, () => {
            if (this.nextEdge) {
                this.nextEdge.fire(this.nodeA);
            }
        }).off();
        this.endPointTimer = new NonLoopedFrameCounter(0.5 * p.idealFrameRate, () => {
            if (this.nextEdge) {
                this.nextEdge.fire(this.nodeB);
            }
        }).off();
        this.midPoint = new PhysicsBody();
        this.midPoint.position.set(0.5 * (nodeA.x + nodeB.x) + p.random(-10, 10), 0.5 * (nodeA.y + nodeB.y) + p.random(-10, 10));
        this.midPoint.mass = 0.2;
        this.midPoint.setFriction(0.1);
        this.springA = new PhysicsSpring(p, nodeA, this.midPoint, 0.4 * this.equilibriumLength, 0.005);
        this.springB = new PhysicsSpring(p, nodeB, this.midPoint, 0.4 * this.equilibriumLength, 0.005);
        this.nextEdge = null;
    }
    step() {
        super.step();
        this.startPointTimer.step();
        this.endPointTimer.step();
        this.midPoint.step();
        const distance = p5.Vector.dist(this.nodeA.position, this.nodeB.position);
        this.springA.equilibriumLength = 0.4 * distance;
        this.springA.step();
        this.springB.equilibriumLength = 0.4 * distance;
        this.springB.step();
    }
    draw() {
        const curve = new QuadraticBezierCurve(this.p, this.nodeA.position, this.midPoint.position, this.nodeB.position, 90, this.startRatio, this.endRatio);
        GraphEdge.initialColor.applyColor();
        this.p.strokeWeight(1);
        this.startRatio.value = 0;
        this.endRatio.value = 1;
        curve.draw();
        GraphEdge.finalColor.applyColor();
        this.p.strokeWeight(2);
        if (this.endPointTimer.isOn || this.endPointTimer.isCompleted) {
            this.startRatio.value = 0;
            this.endRatio.value = this.endPointTimer.getProgressRatio();
            curve.draw();
        }
        else if (this.startPointTimer.isOn || this.startPointTimer.isCompleted) {
            this.startRatio.value = 1 - this.startPointTimer.getProgressRatio();
            this.endRatio.value = 1;
            curve.draw();
        }
    }
    fire(node) {
        if (node === this.nodeA) {
            this.endPointTimer.on();
        }
        else if (node === this.nodeB) {
            this.startPointTimer.on();
        }
        node.fireEffect();
    }
    toString() {
        return this.nodeA + '-' + this.nodeB;
    }
    isIncidentToEdge(edge) {
        return this.isIncidentTo(edge.nodeA) || this.isIncidentTo(edge.nodeB);
    }
}
GraphEdge.graphEdgeInitialized = false;

function log$1(s) {
    // console.log(s);
}
function subtractArray(arrayA, arrayB) {
    return arrayA.filter((av) => {
        return arrayB.findIndex((bv) => { return av === bv; }) === -1;
    });
}
function arrayProduct(arrayA, arrayB) {
    return arrayA.filter((av) => {
        return arrayB.findIndex((bv) => { return av === bv; }) !== -1;
    });
}
function remove(array, element) {
    return array.splice(array.findIndex((value) => { return value === element; }), 1)[0];
}
function toArray(loopableArray) {
    const array = [];
    for (let i = 0; i < loopableArray.length; i += 1) {
        array.push(loopableArray.get(i));
    }
    return array;
}
function containNode(edges, node) {
    for (const edge of edges) {
        if (edge.isIncidentTo(node))
            return true;
    }
    return false;
}
function isIncident(edge, otherEdges) {
    for (const otherEdge of otherEdges) {
        if (edge.isIncidentToEdge(otherEdge))
            return true;
    }
    return false;
}
function keepIn(region, body, restitution = 1) {
    const bodyRadius = body.collisionRadius;
    if (body.x < region.leftPositionX + bodyRadius) {
        body.position.x = region.leftPositionX + bodyRadius;
        body.velocity.x = -restitution * body.velocity.x;
    }
    else if (body.x > region.rightPositionX - bodyRadius) {
        body.position.x = region.rightPositionX - bodyRadius;
        body.velocity.x = -restitution * body.velocity.x;
    }
    if (body.y < region.topPositionY + bodyRadius) {
        body.position.y = region.topPositionY + bodyRadius;
        body.velocity.y = -restitution * body.velocity.y;
    }
    else if (body.y > region.bottomPositionY - bodyRadius) {
        body.position.y = region.bottomPositionY - bodyRadius;
        body.velocity.y = -restitution * body.velocity.y;
    }
}
class Graph {
    constructor(p) {
        this.p = p;
        this.nodes = new SpriteArray();
        this.edges = new SpriteArray();
        this.incidentEdgesMap = new Map();
        this.midPoints = new LoopableArray();
        this.applyRepulsion = (element, otherElement) => {
            // May not be correct, but works for now
            element.attractEachOther(otherElement, -10000000 * this.p.unitAccelerationMagnitude, 0, 10000 * this.p.unitAccelerationMagnitude);
        };
        this.applyMidPointsRepulsion = (element, otherElement) => {
            // May not be correct, but works for now
            element.attractEachOther(otherElement, -1000000 * this.p.unitAccelerationMagnitude, 0, 1000 * this.p.unitAccelerationMagnitude);
        };
        this.keepInScreen = (body) => {
            keepIn(this.region, body, 0.7);
        };
        this.keepAwayEdgePair = (node, edgeA, edgeB, magnitudeFactor) => {
            const directionAngleA = edgeA.getDirectionAngle(node);
            const directionAngleB = edgeB.getDirectionAngle(node);
            const angleDifferenceAB = angleDifference(directionAngleB, directionAngleA);
            const angleDifferenceRatio = this.p.abs(angleDifferenceAB) / this.p.PI;
            const effortForceMagnitude = magnitudeFactor / this.p.sq(Math.max(angleDifferenceRatio, 0.05));
            const tmpVec = Graph.temporalVector;
            const aIsLeft = angleDifferenceAB > 0;
            const edgeADistanceSquared = edgeA.distanceSquared;
            if (edgeADistanceSquared > 1) {
                const forceA = calculateLeverageForce(directionAngleA, this.p.sqrt(edgeADistanceSquared), 1, effortForceMagnitude, aIsLeft, tmpVec);
                edgeA.getAdjacentNode(node).applyForce(forceA);
            }
            const edgeBDistanceSquared = edgeB.distanceSquared;
            if (edgeBDistanceSquared > 1) {
                const forceB = calculateLeverageForce(directionAngleB, this.p.sqrt(edgeBDistanceSquared), 1, effortForceMagnitude, !aIsLeft, tmpVec);
                edgeB.getAdjacentNode(node).applyForce(forceB);
            }
        };
        this.keepAwayIncidentEdges = (node) => {
            const edges = Graph.temporalEdgeArray;
            edges.clear();
            edges.pushAll(this.getIncidentEdges(node));
            const edgeCount = edges.length;
            for (let i = 0; i < edgeCount; i += 1) {
                const nextIndex = (i + 1) % edgeCount;
                this.keepAwayEdgePair(node, edges.get(i), edges.get(nextIndex), 0.3);
            }
        };
        if (!Graph.isInitialized) {
            Graph.temporalVector = p.createVector();
            Graph.isInitialized = true;
        }
        this.region = new RectangleRegion(0, 0, p.nonScaledWidth, p.nonScaledHeight, -80);
        this.oneStrokeDelayTimer = new NonLoopedFrameCounter(1 * p.idealFrameRate, () => {
            this.firstEdge.fire(this.firstNode);
        });
        this.reset();
    }
    reset() {
        const retryCount = 1000;
        for (let i = 0; i < retryCount; i += 1) {
            try {
                this.generate(randomIntBetween(6, 10));
                this.setOneStroke();
                break;
            }
            catch (e) {
                if (i === retryCount - 1)
                    throw 'Failed to generate graph.';
            }
        }
        this.oneStrokeDelayTimer.resetCount().on();
        this.resetTimer = new NonLoopedFrameCounter((1 + this.edges.length * 0.5 + 1) * this.p.idealFrameRate, () => {
            this.reset();
        });
    }
    step() {
        this.oneStrokeDelayTimer.step();
        this.resetTimer.step();
        this.edges.step();
        this.nodes.step();
        // this.nodes.loop(this.keepAwayIncidentEdges);
        this.nodes.loop(this.keepInScreen);
        this.nodes.roundRobin(this.applyRepulsion);
        this.midPoints.roundRobin(this.applyMidPointsRepulsion);
        this.nodes.nestedLoopJoin(this.midPoints, this.applyMidPointsRepulsion);
    }
    draw() {
        this.edges.draw();
        this.nodes.draw();
    }
    addEdge(nodeA, nodeB, directed = false, onlyIfAbsent = false) {
        // Check if already added
        if (onlyIfAbsent && nodeA && nodeB) {
            for (let i = 0; i < this.edges.length; i += 1) {
                const copmaringEdge = this.edges.get(i);
                if (nodeA === copmaringEdge.nodeA && nodeB === copmaringEdge.nodeB) {
                    return null;
                }
                if (directed && nodeA === copmaringEdge.nodeB && nodeB === copmaringEdge.nodeA) {
                    return null;
                }
            }
        }
        const predecessorNode = nodeA || this.addNode();
        const successorNode = nodeB || this.addNode();
        const newEdge = new GraphEdge(this.p, predecessorNode, successorNode);
        this.edges.push(newEdge);
        this.getIncidentEdges(predecessorNode).push(newEdge);
        this.getIncidentEdges(successorNode).push(newEdge);
        return newEdge;
    }
    getIncidentEdges(node) {
        const edges = this.incidentEdgesMap.get(node);
        if (!edges)
            throw 'Passed unregistered node to getIncidentEdges().';
        return edges;
    }
    getDegrees(node) {
        return this.getIncidentEdges(node).length;
    }
    addNode() {
        const newNode = new GraphNode(this.p);
        this.nodes.push(newNode);
        this.incidentEdgesMap.set(newNode, new SpriteArray());
        return newNode;
    }
    generate(nodeCount) {
        this.nodes.clear();
        this.incidentEdgesMap.clear();
        for (let i = 0; i < nodeCount; i += 1) {
            this.addNode();
        }
        this.edges.clear();
        this.midPoints.clear();
        while (true) {
            const nodeCandidates = toArray(this.nodes).filter((node) => {
                const degrees = this.getDegrees(node);
                if (degrees === 0 || degrees % 2 === 1)
                    return true;
                if (degrees === 2 && Math.random() < 0.5)
                    return true;
                return false;
            });
            if (nodeCandidates.length === 0)
                break;
            const currentNode = remove(nodeCandidates, this.p.random(nodeCandidates));
            const adjacentNode = remove(nodeCandidates, this.p.random(nodeCandidates));
            const newEdge = this.addEdge(currentNode, adjacentNode);
            if (newEdge)
                this.midPoints.push(newEdge.midPoint);
        }
    }
    setOneStroke() {
        const allEdges = toArray(this.edges);
        const beginningEdge = remove(allEdges, this.p.random(allEdges));
        const beginningNode = this.p.random([beginningEdge.nodeA, beginningEdge.nodeB]);
        const loop = this.createLoop(allEdges, beginningEdge, beginningNode);
        while (loop.length !== this.edges.length) {
            const remainingEdges = subtractArray(allEdges, loop);
            const beginningEdgeCandidates = remainingEdges.filter((e) => { return isIncident(e, loop); });
            const beginningEdge = remove(remainingEdges, this.p.random(beginningEdgeCandidates));
            const beginningNode = containNode(loop, beginningEdge.nodeA) ?
                beginningEdge.nodeA : beginningEdge.nodeB;
            log$1('Creating other loop starting at ' + beginningNode.toString());
            const otherLoop = this.createLoop(remainingEdges, beginningEdge, beginningNode);
            const insertingIndex = loop.findIndex((cur, i, array) => {
                const prev = (i === 0) ? array[array.length - 1] : array[i - 1];
                const commonNode = prev.isIncidentTo(cur.nodeA) ? cur.nodeA : cur.nodeB;
                return beginningNode === commonNode;
            });
            if (insertingIndex === -1)
                throw 'error.';
            loop.splice(insertingIndex, 0, ...otherLoop);
            log$1('inserted -> ' + loop.toString());
        }
        for (let i = 0; i < loop.length - 1; i += 1) {
            loop[i].nextEdge = loop[i + 1];
        }
        this.firstEdge = loop[0];
        this.firstNode = loop[1].isIncidentTo(this.firstEdge.nodeA) ?
            (loop[1].isIncidentTo(this.firstEdge.nodeB) ?
                (loop[2].isIncidentTo(this.firstEdge.nodeA) ?
                    this.firstEdge.nodeA : this.firstEdge.nodeB) :
                this.firstEdge.nodeB) :
            this.firstEdge.nodeA;
    }
    createLoop(baseEdges, firstEdge, firstNode) {
        log$1('Base edges: ' + baseEdges.toString());
        log$1('Fisrt edge: ' + firstEdge.toString());
        log$1('Fisrt node: ' + firstNode.toString());
        const loop = [];
        const retryCount = 100;
        for (let i = 0; i < retryCount; i += 1) {
            const remainingEdges = baseEdges.slice();
            loop.length = 0;
            loop.push(firstEdge);
            let completed = false;
            let currentNode = firstNode;
            let nextNode = firstEdge.getAdjacentNode(currentNode);
            while (true) {
                if (nextNode === firstNode) {
                    completed = true;
                    break;
                }
                log$1('Remaining: ' + remainingEdges.toString());
                const nextIncidentEdges = toArray(this.getIncidentEdges(nextNode));
                log$1('Next incident: ' + nextIncidentEdges.toString());
                const nextEdgeCandidates = arrayProduct(remainingEdges, nextIncidentEdges);
                log$1('Candidates: ' + nextEdgeCandidates.toString());
                if (nextEdgeCandidates.length === 0)
                    break;
                const nextEdge = remove(remainingEdges, this.p.random(nextEdgeCandidates));
                log$1('Next edge: ' + nextEdge.toString());
                loop.push(nextEdge);
                currentNode = nextNode;
                nextNode = nextEdge.getAdjacentNode(currentNode);
            }
            if (completed) {
                break;
            }
            log$1('Created loop: ' + loop.toString());
            if (i === retryCount - 1)
                throw 'Failed to set one-stroke.';
        }
        return loop;
    }
}
Graph.temporalEdgeArray = new LoopableArray();
Graph.isInitialized = false;

p5.disableFriendlyErrors = true;
const SKETCH_NAME = 'Koenigsberk';
new p5();
const sketch = (p) => {
    // ---- constants
    const backgroundColor = p.color(248);
    // ---- variables
    let graph;
    // ---- functions
    function mouseIsInCanvas() {
        if (p.mouseX < 0)
            return false;
        if (p.mouseX > p.width)
            return false;
        if (p.mouseY < 0)
            return false;
        if (p.mouseY > p.height)
            return false;
        return true;
    }
    // ---- Setup & Draw etc.
    p.preload = () => {
    };
    p.setup = () => {
        window.noCanvas();
        p.createScalableCanvas(ScalableCanvasTypes.FULL);
        p.setFrameRate(30);
        p.ellipseMode(p.CENTER);
        p.strokeWeight(1.5);
        graph = new Graph(p);
    };
    p.draw = () => {
        p.background(backgroundColor);
        p.scalableCanvas.scale();
        graph.step();
        graph.draw();
    };
    p.windowResized = () => {
        p.resizeScalableCanvas();
        p.background(255);
    };
    p.mousePressed = () => {
        graph.reset();
    };
    p.touchMoved = () => {
        if (!mouseIsInCanvas())
            return;
        return false;
    };
};
new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
