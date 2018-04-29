/**
 * Rectangle Petals.
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
// Temporal vectors for calculation use in getClosestPositionOnLineSegment()
const tmpVectorAP = dummyP5.createVector();
const tmpVectorAB = dummyP5.createVector();
/**
 * Returns the position on the line segment AB which is closest to the reference point P.
 * @param {p5.Vector} P - The position of the reference point.
 * @param {p5.Vector} A - The position of the line segment start point.
 * @param {p5.Vector} B - The position of the line segment end point.
 * @param {p5.Vector} target - The vector to receive the result.
 */

/**
 * Just lerp.
 * @param startValue - The start value.
 * @param endValue - The end value.
 * @param ratio - The ratio between 0 and 1.
 */
function lerp(startValue, endValue, ratio) {
    return startValue + ratio * (endValue - startValue);
}
/**
 * Returns random integer from 0 up to (but not including) the max number.
 */
function randomInt(maxInt) {
    return Math.floor(Math.random() * maxInt);
}
/**
 * Returns one of array elements randomly.
 * @param array
 */
function getRandom(array) {
    return array[randomInt(array.length)];
}
/**
 * Returns n or -n randomly. (n = provided number)
 * @param {number} n - any number
 */
function randomSign(n) {
    if (Math.random() < 0.5)
        return n;
    return -n;
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
 * (To be filled)
 */
class RandomShapeColor {
    constructor() {
        this.candidateArray = [];
    }
    /**
     * (To be filled)
     * @param createShapeColor - Any function which returns a p5ex.ShapeColor instance.
     * @param {number} candidateCount - Number of color candidates to push.
     */
    pushCandidateFromFunction(createShapeColor, candidateCount) {
        for (let i = 0; i < candidateCount; i += 1) {
            this.candidateArray.push(createShapeColor());
        }
        return this;
    }
    /**
     * (To be filled)
     * @param {p5.Color} shapeColor - Any p5.Color instance.
     * @param {number} candidateCount - Number of color candidates to push.
     */
    pushCandidate(shapeColor, candidateCount = 1) {
        for (let i = 0; i < candidateCount; i += 1) {
            this.candidateArray.push(shapeColor);
        }
        return this;
    }
    /**
     * Clears all color candidates.
     */
    clear() {
        this.candidateArray.length = 0;
        return this;
    }
    /**
     * Returns one of color candidates randomly.
     */
    get() {
        return getRandom(this.candidateArray);
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

/**
 * (To be filled)
 */
class ScaleFactor {
    /**
     *
     * @param p - p5ex instance.
     * @param { number } [value = 1]
     */
    constructor(p, value = 1) {
        this.p = p;
        this.internalValue = value;
        this.internalReciprocalValue = 1 / value;
    }
    /**
     * The numeric value of the scale factor.
     */
    get value() {
        return this.internalValue;
    }
    set value(v) {
        if (v === 0) {
            this.internalValue = 0.0001;
            this.internalReciprocalValue = 10000;
            return;
        }
        this.internalValue = v;
        this.internalReciprocalValue = 1 / v;
    }
    /**
     * The reciprocal value of the scale factor.
     */
    get reciprocalValue() {
        return this.internalReciprocalValue;
    }
    /**
     * Calls scale().
     */
    applyScale() {
        this.p.currentRenderer.scale(this.internalValue);
    }
    /**
     * Calls scale() with the reciprocal value.
     */
    cancel() {
        this.p.currentRenderer.scale(this.internalReciprocalValue);
    }
}
/**
 * (To be filled)
 */
class Drawer {
    /**
     *
     * @param p
     * @param element
     * @param drawParam
     */
    constructor(p, element, drawParam) {
        this.p = p;
        this.set(element, drawParam);
    }
    /**
     * (To be filled)
     * @param element
     * @param drawParam
     */
    set(element, drawParam) {
        this.element = element;
        this.position = drawParam.positionRef || this.p.createVector();
        this.offsetPosition = drawParam.offsetPositionRef || this.p.createVector();
        this.rotation = drawParam.rotationAngleRef || NumberContainer.NULL;
        this.scaleFactor = drawParam.scaleFactorRef || new ScaleFactor(this.p);
        this.shapeColor = drawParam.shapeColorRef || ShapeColor.UNDEFINED;
        this.alphaChannel = drawParam.alphaChannelRef || NumberContainer.NULL;
        this.strokeWeight = drawParam.strokeWeightRef || NumberContainer.NULL;
        this.textSize = drawParam.textSizeRef || NumberContainer.NULL;
        this.procedureList = this.createProcedureList(drawParam);
        this.procedureListLength = this.procedureList.length;
    }
    /**
     * Draws the content.
     */
    draw() {
        for (let i = 0, len = this.procedureListLength; i < len; i += 1) {
            this.procedureList[i](this);
        }
    }
    drawElement(drawer) {
        drawer.element.draw();
    }
    createProcedureList(drawParam) {
        const procedureList = [];
        if (drawParam.shapeColorRef) {
            if (drawParam.alphaChannelRef)
                procedureList.push(this.alphaColor);
            else
                procedureList.push(this.color);
        }
        if (drawParam.textSizeRef)
            procedureList.push(this.applyTextSize);
        if (drawParam.strokeWeightRef)
            procedureList.push(this.applyStrokeWeight);
        if (drawParam.positionRef) {
            if (drawParam.offsetPositionRef)
                procedureList.push(this.translateWithOffset);
            else
                procedureList.push(this.translate);
        }
        else if (drawParam.offsetPositionRef)
            procedureList.push(this.translateOnlyOffset);
        if (drawParam.scaleFactorRef)
            procedureList.push(this.scale);
        if (drawParam.rotationAngleRef)
            procedureList.push(this.rotate);
        procedureList.push(this.drawElement);
        if (drawParam.rotationAngleRef)
            procedureList.push(this.cancelRotate);
        if (drawParam.scaleFactorRef)
            procedureList.push(this.cancelScale);
        if (drawParam.positionRef) {
            if (drawParam.offsetPositionRef)
                procedureList.push(this.cancelTranslateWithOffset);
            else
                procedureList.push(this.cancelTranslate);
        }
        else if (drawParam.offsetPositionRef)
            procedureList.push(this.cancelTranslateOnlyOffset);
        return procedureList;
    }
    translate(drawer) {
        drawer.p.currentRenderer.translate(drawer.position.x, drawer.position.y);
    }
    cancelTranslate(drawer) {
        drawer.p.currentRenderer.translate(-drawer.position.x, -drawer.position.y);
    }
    translateOnlyOffset(drawer) {
        drawer.p.currentRenderer.translate(drawer.offsetPosition.x, drawer.offsetPosition.y);
    }
    cancelTranslateOnlyOffset(drawer) {
        drawer.p.currentRenderer.translate(-drawer.offsetPosition.x, -drawer.offsetPosition.y);
    }
    translateWithOffset(drawer) {
        drawer.p.currentRenderer.translate(drawer.position.x + drawer.offsetPosition.x, drawer.position.y + drawer.offsetPosition.y);
    }
    cancelTranslateWithOffset(drawer) {
        drawer.p.currentRenderer.translate(-(drawer.position.x + drawer.offsetPosition.x), -(drawer.position.y + drawer.offsetPosition.y));
    }
    rotate(drawer) {
        drawer.p.currentRenderer.rotate(drawer.rotation.value);
    }
    cancelRotate(drawer) {
        drawer.p.currentRenderer.rotate(-drawer.rotation.value);
    }
    scale(drawer) {
        if (drawer.scaleFactor.value === 1)
            return;
        drawer.scaleFactor.applyScale();
    }
    cancelScale(drawer) {
        if (drawer.scaleFactor.value === 1)
            return;
        drawer.scaleFactor.cancel();
    }
    color(drawer) {
        drawer.shapeColor.applyColor();
    }
    alphaColor(drawer) {
        drawer.shapeColor.applyColor(drawer.alphaChannel.value);
    }
    applyStrokeWeight(drawer) {
        drawer.p.currentRenderer.strokeWeight(drawer.strokeWeight.value);
    }
    applyTextSize(drawer) {
        drawer.p.currentRenderer.textSize(drawer.textSize.value);
    }
}

// temporal vectors for use in QuadraticBezierCurve.
const tmpMidPoint1 = dummyP5.createVector();
const tmpMidPoint2 = dummyP5.createVector();
/**
 * Set color to the specified pixel. The alpha channel remains unchanged.
 * @param renderer - Instance of either p5 or p5.Graphics.
 * @param x - The x index of the pixel.
 * @param y - The y index of the pixel.
 * @param red - The red value (0 - 255).
 * @param green - The green value (0 - 255).
 * @param blue - The blue value (0 - 255).
 * @param pixelDensity - If not specified, renderer.pixelDensity() will be called.
 * @param lerpRatio - The lerp ratio (0 - 1). If 1, the color will be replaced.
 */
function setPixel(renderer, x, y, red, green, blue, pixelDensity, lerpRatio = 1) {
    const g = renderer;
    const d = pixelDensity || g.pixelDensity();
    for (let i = 0; i < d; i += 1) {
        for (let j = 0; j < d; j += 1) {
            const idx = 4 * ((y * d + j) * g.width * d + (x * d + i));
            g.pixels[idx] = lerp(g.pixels[idx], red, lerpRatio);
            g.pixels[idx + 1] = lerp(g.pixels[idx + 1], green, lerpRatio);
            g.pixels[idx + 2] = lerp(g.pixels[idx + 2], blue, lerpRatio);
            // g.pixels[idx + 3] = 255;
        }
    }
}

/**
 * (To be filled)
 */
class AngleQuantity {
    /**
     * Null object of AngleQuantity.
     * @static
     */
    static get NULL() { return NULL$1; }
    /**
     *
     * @param angle
     * @param angleVelocity
     */
    constructor(angle = 0, angleVelocity = 0) {
        this.angleReference = new NumberContainer(angle);
        this.angleVelocityReference = new NumberContainer(angleVelocity);
    }
    /**
     * Current angle value.
     */
    get angle() { return this.angleReference.value; }
    set angle(v) { this.angleReference.value = v; }
    /**
     * Current anglular velocity value.
     */
    get angleVelocity() { return this.angleVelocityReference.value; }
    set angleVelocity(v) { this.angleVelocityReference.value = v; }
    /**
     * Updates the angle.
     */
    step() {
        this.angle += this.angleVelocity;
    }
}
class NullAngleQuantity extends AngleQuantity {
    get angle() { return 0; }
    set angle(v) { }
    get angleVelocity() { return 0; }
    set angleVelocity(v) { }
    step() { }
}
const NULL$1 = new NullAngleQuantity();

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

function createGradationRectangle(p, w, h, backgroundColor, fromColor, toColor, gradient = 1) {
    const g = p.createGraphics(w, h);
    g.background(backgroundColor);
    g.strokeWeight(2);
    for (let y = 0; y < h; y += 1) {
        const lerpRatio = Math.pow(y / (h - 1), gradient);
        g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
        g.line(0, y, w - 1, y);
    }
    return g;
}
function applyRandomTexture(graphics, factor) {
    const g = graphics;
    const width = g.width;
    const height = g.height;
    const pixelDensity = g.pixelDensity();
    g.loadPixels();
    for (let y = 0; y < height; y += 1) {
        for (let x = 0; x < width; x += 1) {
            setPixel(graphics, x, y, 0, 0, 0, pixelDensity, Math.random() * factor);
        }
    }
    g.updatePixels();
    return g;
}

p5.disableFriendlyErrors = true;
const SKETCH_NAME = 'RectanglePetals';
new p5();
class Petal {
    constructor(p, position, shapeColor) {
        this.p = p;
        this.shapeColor = shapeColor;
        this.isToBeRemoved = false;
        this.position = p.createVector().set(position);
        this.velocity = p.createVector();
        this.rotation = new AngleQuantity(Math.random() * p.TWO_PI, randomSign(0.005 * p.TWO_PI));
        this.alphaChannelRef = new NumberContainer();
        const width = p.random(40, 100);
        const height = p.random(40, 100);
        this.drawer = new Drawer(p, {
            draw() {
                p.rect(0, 0, width, height, 2);
            },
        }, {
            positionRef: this.position,
            rotationAngleRef: this.rotation.angleReference,
            shapeColorRef: this.shapeColor,
            alphaChannelRef: this.alphaChannelRef,
        });
        this.disappearanceTimer = new NonLoopedFrameCounter(3 * p.idealFrameRate, () => { this.isToBeRemoved = true; });
    }
    step() {
        this.velocity.add(0, 0.1);
        this.position.add(this.velocity);
        this.rotation.step();
        this.disappearanceTimer.step();
        this.alphaChannelRef.value = (1 - this.disappearanceTimer.getProgressRatio()) * 255;
    }
    clean() {
    }
    draw() {
        if (this.alphaChannelRef.value === 0)
            return;
        this.drawer.draw();
    }
}
class PetalGenerator {
    constructor(p, petalArray, baseHue) {
        this.p = p;
        this.petalArray = petalArray;
        this.speed = 25;
        this.position = p.createVector(Math.random() * p.nonScaledWidth, Math.random() * p.nonScaledHeight);
        this.randomColor = new RandomShapeColor().pushCandidateFromFunction(() => {
            let hue;
            if (baseHue)
                hue = p.radians(baseHue + p.random(-20, 20));
            else
                hue = Math.random() * p.TWO_PI;
            return new ShapeColor(p, p.color(cielchColor(40, 35, hue, 40)), p.color(cielchColor(70, 35, hue, 40)), true);
        }, 36);
    }
    step() {
        const angle = Math.random() * this.p.TWO_PI;
        this.position.add(this.speed * Math.cos(angle), this.speed * Math.sin(angle));
        this.p.scalableCanvas.region.constrain(this.position, -70);
        this.position.set(this.p.constrain(this.position.x + this.speed * Math.cos(angle), 0, this.p.nonScaledWidth), this.p.constrain(this.position.y + this.speed * Math.sin(angle), 0, this.p.nonScaledHeight));
        this.petalArray.push(new Petal(this.p, this.position, this.randomColor.get()));
    }
}
const sketch = (p) => {
    // ---- constants
    let backgroundPixels;
    // ---- variables
    let petals;
    let petalGenerators;
    let timeoutId = -1;
    // ---- functions
    function createBackgroundPixels() {
        const gradation = createGradationRectangle(p, p.width, p.height, p.color(255, 255, 255), p.color(255, 255, 255), p.color(248, 244, 255), 3);
        const g = applyRandomTexture(gradation, 0.05);
        p.background(255, 255, 255);
        p.image(g, 0, 0);
        p.loadPixels();
        return p.pixels;
    }
    // ---- Setup & Draw etc.
    p.preload = () => {
    };
    p.setup = () => {
        window.noCanvas();
        p.createScalableCanvas(ScalableCanvasTypes.FULL);
        p.setFrameRate(30);
        backgroundPixels = createBackgroundPixels();
        p.rectMode(p.CENTER);
        petals = new CleanableSpriteArray();
        petalGenerators = new SteppableArray(2);
        petalGenerators.pushRawArray([
            new PetalGenerator(p, petals, 275),
            new PetalGenerator(p, petals, 300),
        ]);
    };
    p.draw = () => {
        p.pixels = backgroundPixels;
        p.updatePixels();
        p.scalableCanvas.scale();
        petalGenerators.step();
        petals.step();
        petals.clean();
        petals.draw();
        p.scalableCanvas.cancelScale();
    };
    p.windowResized = () => {
        p.resizeScalableCanvas();
        if (timeoutId !== -1)
            clearTimeout(timeoutId);
        timeoutId = setTimeout(() => { backgroundPixels = createBackgroundPixels(); }, 200);
    };
    p.mousePressed = () => {
    };
    p.touchMoved = () => {
        // return false;
    };
};
new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
