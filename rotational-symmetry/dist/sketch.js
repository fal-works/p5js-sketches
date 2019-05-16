/**
 * Rotational Symmetry.
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * Website => https://www.fal-works.com/
 * @copyright 2019 FAL
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
    /**
     * Set color to the specified pixel.
     * Should be used in conjunction with loadPixels() and updatePixels().
     * @param renderer - Instance of either p5 or p5.Graphics.
     * @param x - The x index of the pixel.
     * @param y - The y index of the pixel.
     * @param red - The red value (0 - 255).
     * @param green - The green value (0 - 255).
     * @param blue - The blue value (0 - 255).
     * @param pixelDensity - If not specified, renderer.pixelDensity() will be called.
     */
    function setPixel(renderer, x, y, red, green, blue, alpha, pixelDensity) {
        const g = renderer;
        const d = pixelDensity || g.pixelDensity();
        for (let i = 0; i < d; i += 1) {
            for (let j = 0; j < d; j += 1) {
                const idx = 4 * ((y * d + j) * g.width * d + (x * d + i));
                g.pixels[idx] = red;
                g.pixels[idx + 1] = green;
                g.pixels[idx + 2] = blue;
                g.pixels[idx + 3] = alpha;
            }
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

    function loop(array, callback) {
        const len = array.length;
        for (let i = 0; i < len; i += 1)
            callback(array[i]);
    }
    function createRandomTextureGraphics(p, w, h, factor) {
        const g = p.createGraphics(w, h);
        const width = g.width;
        const height = g.height;
        const pixelDensity = g.pixelDensity();
        g.loadPixels();
        for (let y = 0; y < height; y += 1) {
            for (let x = 0; x < width; x += 1) {
                setPixel(g, x, y, 0, 0, 0, 255 * Math.random() * factor, pixelDensity);
            }
        }
        g.updatePixels();
        return g;
    }

    const SKETCH_NAME = "RotationalSymmetry";
    const sketch = (p) => {
        // ---- constants
        // ---- variables
        let backgroundPixels;
        let icons;
        // ---- functions
        function drawShapeGroup(shapeGroup) {
            shapeGroup.shapeColor.applyColor();
            const revolution = shapeGroup.revolution;
            const count = shapeGroup.count;
            const shape = shapeGroup.shape;
            const radius = shapeGroup.radius;
            const shapeUnitSize = shapeGroup.shapeSize;
            const rotationFactor = shapeGroup.rotationFactor;
            let angle = revolution;
            const angleInterval = p.TWO_PI / count;
            for (let i = 0; i < count; i += 1) {
                const x = radius * Math.cos(angle);
                const y = radius * Math.sin(angle);
                const rotationAngle = rotationFactor * angle;
                p.translate(x, y);
                p.rotate(rotationAngle);
                shape.draw(shapeUnitSize);
                p.rotate(-rotationAngle);
                p.translate(-x, -y);
                angle += angleInterval;
            }
            shapeGroup.revolution = revolution + shapeGroup.revolutionVelocity;
        }
        function drawIcon(icon) {
            const x = icon.x;
            const y = icon.y;
            p.translate(x, y);
            loop(icon.shapeGroupList, drawShapeGroup);
            p.translate(-x, -y);
        }
        function drawSquare(size) {
            p.rect(0, 0, size, size, 0.05 * size);
        }
        const ROOT_THREE = p.sqrt(3);
        const ONE_THIRD = 1 / 3;
        const TWO_THIRDS = 2 / 3;
        const ONE_OVER_ROOT_THREE = 1 / ROOT_THREE;
        const TRIANGLE_SIZE_FACTOR = 1.2;
        function drawRegularTriangle(size) {
            const sz = TRIANGLE_SIZE_FACTOR * size;
            p.triangle(TWO_THIRDS * sz, 0, -ONE_THIRD * sz, -ONE_OVER_ROOT_THREE * sz, -ONE_THIRD * sz, ONE_OVER_ROOT_THREE * sz);
        }
        function drawCircle(size) {
            p.ellipse(0, 0, size, size);
        }
        function drawEllipse(size) {
            p.ellipse(0, 0, 0.9 * size, 1.3 * size);
        }
        function drawDiamand(size) {
            p.quad(0.9 * size, 0, 0, 0.6 * size, -0.9 * size, 0, 0, -0.6 * size);
        }
        function drawDrop(size) {
            p.beginShape();
            p.vertex(0.8 * size, 0);
            p.vertex(0, 0.5 * size);
            p.curveVertex(-0.4 * size, 0);
            p.vertex(0, -0.5 * size);
            p.endShape(p.CLOSE);
        }
        function createShapeGroup(shapeCandidates, count, radius, revolutionVelocityFactor, colorStack) {
            const pickedShape = p.random(shapeCandidates);
            const poppedShapeColor = colorStack.pop();
            if (!poppedShapeColor)
                throw "createShapeGroup - No colors in stack.";
            let determinedRotationFactor;
            switch (pickedShape.foldingNumber) {
                case 1:
                    determinedRotationFactor = 1;
                    break;
                case 4:
                    determinedRotationFactor = p.random([-1, 0, 1]);
                    break;
                case Infinity:
                    determinedRotationFactor = 0;
                    break;
                default:
                    determinedRotationFactor = p.random([-1, 1]);
                    break;
            }
            return {
                shape: pickedShape,
                count: count,
                shapeSize: 18,
                radius: radius,
                revolution: 0,
                revolutionVelocity: revolutionVelocityFactor * 0.004 * p.TWO_PI,
                shapeColor: poppedShapeColor,
                rotationFactor: determinedRotationFactor
            };
        }
        function createIcon(x, y, shapeCandidates, shapeColorCandidates, invertedRevolution = false) {
            const colorStack = p.shuffle(shapeColorCandidates, false);
            const revolutionVelocityFactor = invertedRevolution ? -1 : 1;
            const newShapeGroupList = [
                createShapeGroup(shapeCandidates, randomIntBetween(3, 6), 35, -revolutionVelocityFactor, colorStack),
                createShapeGroup(shapeCandidates, randomIntBetween(4, 10), 75, revolutionVelocityFactor, colorStack)
            ];
            return {
                x: x,
                y: y,
                shapeGroupList: newShapeGroupList
            };
        }
        function flat(arrays) {
            return [].concat.apply([], arrays);
        }
        function createRotatedShape(shape) {
            if (shape.foldingNumber === Infinity)
                return null;
            const rotationAngle = 0.5 * (p.TWO_PI / shape.foldingNumber);
            return {
                draw: (size) => {
                    p.rotate(rotationAngle);
                    shape.draw(size);
                    p.rotate(-rotationAngle);
                },
                foldingNumber: shape.foldingNumber
            };
        }
        function createShifteShape(shape, shiftFactor) {
            return {
                draw: (size) => {
                    const displacement = shiftFactor * size;
                    p.translate(displacement, 0);
                    shape.draw(size);
                    p.translate(-displacement, 0);
                },
                foldingNumber: 1
            };
        }
        function createCompositeShape(shape, otherShape, foldingNumber) {
            return {
                draw: (size) => {
                    shape.draw(size);
                    otherShape.draw(size);
                },
                foldingNumber: foldingNumber
            };
        }
        function createRotatedCompositeShape(baseShape) {
            const rotatedShape = createRotatedShape(baseShape);
            if (!rotatedShape)
                throw "createRotatedCompositeShape() - Invalid input.";
            return createCompositeShape(baseShape, rotatedShape, baseShape.foldingNumber * 2);
        }
        function createShiftedCompositeShape(baseShape) {
            const baseFoldingNumber = baseShape.foldingNumber;
            let newFoldingNumber;
            if (baseFoldingNumber === Infinity)
                newFoldingNumber = 2;
            else if (baseFoldingNumber % 2 === 0)
                newFoldingNumber = 2;
            else
                newFoldingNumber = 1;
            return createCompositeShape(createShifteShape(baseShape, -0.2), createShifteShape(baseShape, 0.2), newFoldingNumber);
        }
        function createShapePatterns(baseShape) {
            const array = [baseShape];
            const rotatedShape = createRotatedShape(baseShape);
            if (rotatedShape) {
                array.push(rotatedShape);
                array.push(createRotatedCompositeShape(baseShape));
                array.push(createShiftedCompositeShape(rotatedShape));
            }
            const shiftedCompositeShape = createShiftedCompositeShape(baseShape);
            array.push(shiftedCompositeShape);
            if (shiftedCompositeShape.foldingNumber === 2) {
                const rotatedShiftedCompositeShape = createRotatedShape(shiftedCompositeShape);
                if (rotatedShiftedCompositeShape)
                    array.push(rotatedShiftedCompositeShape);
            }
            return array;
        }
        function initialize() {
            const shapeCandidates = flat([
                {
                    draw: drawSquare,
                    foldingNumber: 4
                },
                {
                    draw: drawRegularTriangle,
                    foldingNumber: 3
                },
                {
                    draw: drawCircle,
                    foldingNumber: Infinity
                },
                {
                    draw: drawEllipse,
                    foldingNumber: 2
                },
                {
                    draw: drawDiamand,
                    foldingNumber: 2
                },
                {
                    draw: drawDrop,
                    foldingNumber: 1
                }
            ].map(createShapePatterns));
            const shapeColorCandidates = [
                "#C7243A",
                "#2266AF",
                "#009250",
                "#EDAD0B"
            ]
                .map((colorString) => p.color(colorString))
                // .map((color: p5.Color) => alphaColor(p, color, 160))
                .map((color) => new ShapeColor(p, color, undefined));
            icons = new LoopableArray(9);
            let invertedRevolution = false;
            const positionInterval = p.nonScaledWidth / 3;
            for (let row = 0; row < 3; row += 1) {
                const y = (row + 0.5) * positionInterval;
                for (let column = 0; column < 3; column += 1) {
                    const x = (column + 0.5) * positionInterval;
                    const newIcon = createIcon(x, y, shapeCandidates, shapeColorCandidates, invertedRevolution);
                    icons.push(newIcon);
                    invertedRevolution = !invertedRevolution;
                }
            }
        }
        // ---- Setup & Draw etc.
        p.preload = () => { };
        p.setup = () => {
            p.createScalableCanvas(ScalableCanvasTypes.SQUARE640x640);
            const texture = createRandomTextureGraphics(p, p.nonScaledWidth, p.nonScaledHeight, 0.05);
            p.scalableCanvas.scale();
            p.image(texture, 0, 0);
            p.scalableCanvas.cancelScale();
            p.loadPixels();
            backgroundPixels = p.pixels;
            p.noFill();
            p.strokeWeight(2);
            p.rectMode(p.CENTER);
            initialize();
        };
        p.draw = () => {
            p.pixels = backgroundPixels;
            p.updatePixels();
            p.scalableCanvas.scale();
            icons.loop(drawIcon);
            p.scalableCanvas.cancelScale();
        };
        p.mousePressed = () => {
            initialize();
        };
        p.keyTyped = () => {
            if (p.key === "p")
                p.noLoop();
            // if (p.key === "s") p.save("image.png");
        };
    };
    new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
