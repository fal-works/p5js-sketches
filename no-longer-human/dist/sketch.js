/**
 * NoLongerHuman.
 * Website => https://www.fal-works.com/
 * Including module: p5ex (Copyright 2018 FAL, licensed under MIT).
 * @copyright 2018 FAL
 * @author FAL <falworks.contact@gmail.com>
 * @version 0.1.0
 * @license CC-BY-SA-3.0
 */

/**
 * Font from: [Oradano明朝GSSRフォント](http://www.asahi-net.or.jp/~sd5a-ucd/freefonts/Oradano-Mincho/)
 * Text from: [青空文庫 ＞ 人間失格（太宰治）](https://www.aozora.gr.jp/cards/000035/files/301_14912.html)
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
     * Calculates the squared value of the Euclidean distance between
     * two points (considering a point as a vector object).
     */
    function distSq(v1, v2) {
        return Math.pow(v2.x - v1.x, 2) + Math.pow(v2.y - v1.y, 2) + Math.pow(v2.z - v1.z, 2);
    }
    const TWO_PI = 2 * Math.PI;
    // Temporal vectors for calculation use in getClosestPositionOnLineSegment()
    const tmpVectorAP = dummyP5.createVector();
    const tmpVectorAB = dummyP5.createVector();
    /**
     * easeOutQuad.
     * @param ratio
     */
    function easeOutQuad(ratio) {
        return -Math.pow(ratio - 1, 2) + 1;
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
    class LoopedFrameCounter extends TimedFrameCounter {
        /**
         *
         * @param duration
         * @param cycleCompleteBehavior
         */
        constructor(duration, cycleCompleteBehavior) {
            super(duration, cycleCompleteBehavior);
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
        getProgressRatio() {
            return this.count / this.durationFrameCount;
        }
        /**
         * @override
         */
        completeCycle() {
            this.completeBehavior();
            this.count = 0;
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

    function createGradationRectangle(p, w, h, backgroundColor, fromColor, toColor, gradient = 1, interval = 1) {
        const g = p.createGraphics(w, h);
        g.background(backgroundColor);
        g.strokeWeight(interval * 2);
        for (let y = 0; y < h; y += interval) {
            const lerpRatio = Math.pow(y / (h - 1), gradient);
            g.stroke(p.lerpColor(fromColor, toColor, lerpRatio));
            g.line(0, y, w - 1, y);
        }
        return g;
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

    const SKETCH_NAME = "NoLongerHuman";
    var CharacterSpriteState;
    (function (CharacterSpriteState) {
        CharacterSpriteState[CharacterSpriteState["BIRTH"] = 0] = "BIRTH";
        CharacterSpriteState[CharacterSpriteState["STOP"] = 1] = "STOP";
        CharacterSpriteState[CharacterSpriteState["DEATH"] = 2] = "DEATH";
    })(CharacterSpriteState || (CharacterSpriteState = {}));
    class CharacterSprite extends PhysicsBody {
        constructor(p, character, shapeColor) {
            super();
            this.p = p;
            this.character = character;
            this.shapeColor = shapeColor;
            this.isToBeRemoved = false;
            this.state = CharacterSpriteState.BIRTH;
            this.birthTimer = new NonLoopedFrameCounter(30, () => {
                this.deathDelayTimer.on();
                this.state = CharacterSpriteState.STOP;
            });
            this.deathDelayTimer = new NonLoopedFrameCounter(120, () => {
                this.deathTimer.on();
                this.state = CharacterSpriteState.DEATH;
                const direction = this.p.random(-1, 1) * this.p.QUARTER_PI;
                this.acceleration.set(this.p.createVector(Math.cos(direction), Math.sin(direction)).mult(0.05));
                this.rotationAcceleration = this.p.random(-1, 1) * this.p.TWO_PI * 0.0001;
            });
            this.deathTimer = new NonLoopedFrameCounter(120, () => {
                this.isToBeRemoved = true;
            }).off();
            this.rotationAngle = 0;
            this.rotationVelocity = 0;
            this.rotationAcceleration = 0;
            this.alphaValue = 0;
            this.acceleration = p.createVector();
        }
        setPosition(position) {
            this.position.set(position);
            return this;
        }
        step() {
            this.velocity.add(this.acceleration);
            super.step();
            this.rotationVelocity += this.rotationAcceleration;
            this.rotationAngle += this.rotationVelocity;
            this.birthTimer.step();
            this.deathDelayTimer.step();
            this.deathTimer.step();
            switch (this.state) {
                case CharacterSpriteState.BIRTH:
                    this.alphaValue = Math.ceil(255 * this.birthTimer.getProgressRatio());
                    break;
                case CharacterSpriteState.STOP:
                    this.alphaValue = 255;
                    break;
                case CharacterSpriteState.DEATH:
                    this.alphaValue = Math.ceil(255 * (1 - easeOutQuad(this.deathTimer.getProgressRatio())));
                    break;
            }
        }
        draw() {
            if (this.alphaValue < 1)
                return;
            this.shapeColor.applyColor(this.alphaValue);
            this.p.push();
            this.p.translate(this.position.x, this.position.y);
            this.p.rotate(this.rotationAngle);
            this.p.text(this.character, 0, 0);
            this.p.pop();
        }
        clean() {
            if (!this.p.scalableCanvas.region.contains(this.position, 30))
                this.isToBeRemoved = true;
        }
    }
    const sketch = (p) => {
        // ---- constants
        const ASSET_PATH = "https://fal-works.github.io/p5js-sketches/no-longer-human/assets/";
        const FONT_SIZE = 32;
        const LINE_INTERVAL = FONT_SIZE * 1.5;
        // ---- variables
        const characters = new CleanableSpriteArray();
        const shapeColor = new ShapeColor(p, undefined, p.color(32), true);
        let backgroundPixels;
        let currentFont;
        let pageList = [];
        let currentPageIndex = 0;
        let currentLineList = [];
        let currentLineIndex = 0;
        let currentCharacterIndex = 0;
        let characterPosition = p.createVector();
        let defaultCharacterPositionY;
        let sentenceReaderTimer;
        let characterGeneraterTimer;
        // ---- functions
        function createBackgroundGraphics() {
            const gradation = createGradationRectangle(p, p.nonScaledWidth, p.nonScaledHeight, p.color(252, 252, 253), p.color(252, 252, 253), p.color(208, 208, 216), 3, 2);
            const texture = createRandomTextureGraphics(p, p.nonScaledWidth, p.nonScaledHeight, 0.05);
            gradation.image(texture, 0, 0);
            return gradation;
        }
        function splitWithoutRemove(s, deliminator) {
            let index = 0;
            const len = s.length;
            const result = [];
            while (index < len) {
                const nextIndex = s.indexOf(deliminator, index) + 1;
                if (nextIndex <= 0) {
                    result.push(s.substring(index));
                    return result;
                }
                else {
                    result.push(s.substring(index, nextIndex));
                }
                index = nextIndex;
            }
            return result;
        }
        /**
         * Formats a given sentence and returns a list of lines.
         * @param sentence
         * @param minLineLength
         * @param maxLineLength
         */
        function formatSentence(sentence, minLineLength = 13, maxLineLength = 17) {
            const phrases = splitWithoutRemove(sentence, "\u3001");
            const emptyString = "";
            let lineList = [];
            let line = emptyString;
            let phraseIndex = 0;
            const len = phrases.length;
            let phrase = phrases[phraseIndex];
            while (phraseIndex < len) {
                if (line.length < minLineLength && phrase.length > maxLineLength) {
                    const substringLength = maxLineLength - line.length;
                    line = line.concat(phrase.substring(0, substringLength));
                    phrase = phrase.substring(substringLength);
                    if (phrase.startsWith("\u3001") || phrase.startsWith("\u3002")) {
                        line = line.concat(phrase.substring(0, 1));
                        phrase = phrase.substring(1);
                    }
                    lineList.push(line);
                    line = emptyString;
                    continue;
                }
                if (line.length + phrase.length <= maxLineLength) {
                    line = line.concat(phrase);
                    phraseIndex += 1;
                    if (phraseIndex >= len)
                        break;
                    phrase = phrases[phraseIndex];
                    continue;
                }
                lineList.push(line);
                line = emptyString;
            }
            if (line !== emptyString)
                lineList.push(line);
            return lineList;
        }
        function nextPage(pageList, index) {
            const currentIndex = index >= pageList.length || index < 0 ? 0 : index;
            const incrementedIndex = currentIndex + 1;
            return {
                page: pageList[currentIndex],
                index: incrementedIndex >= pageList.length ? 0 : incrementedIndex
            };
        }
        function updatePageIndex(value) {
            currentPageIndex = value;
        }
        /*
          function isKanji(character: string): boolean {
            const code = character.charCodeAt(0);

            return (
              (code >= 0x4e00 && code <= 0x9fcf) ||
              (code >= 0x3400 && code <= 0x4dbf) ||
              (code >= 0x20000 && code <= 0x2a6df) ||
              (code >= 0xf900 && code <= 0xfadf) ||
              (code >= 0x2f800 && code <= 0x2fa1f)
            );
          }
        */
        function setLineList(lineList) {
            currentLineList = lineList;
            currentLineIndex = 0;
            currentCharacterIndex = 0;
            characterPosition.set(p.nonScaledWidth / 2 + 0.5 * (lineList.length - 1) * LINE_INTERVAL, defaultCharacterPositionY);
            characterGeneraterTimer.resetCount();
            characterGeneraterTimer.on();
        }
        function devideArray(array, maxCountPerSegment) {
            const segmentCount = Math.ceil(array.length / maxCountPerSegment);
            const countPerSegment = Math.ceil(array.length / segmentCount);
            const result = [];
            while (array.length > 0) {
                result.push(array.splice(0, countPerSegment));
            }
            return result;
        }
        // ---- Setup & Draw etc.
        p.preload = () => {
            currentFont = p.loadFont(`${ASSET_PATH}OradanoGSRR-subset.ttf`);
            p.loadStrings(`${ASSET_PATH}sentences.txt`, (paragraphList) => {
                pageList = paragraphList
                    .map(paragraph => splitWithoutRemove(paragraph, "\u3002"))
                    .reduce((pre, current) => {
                    pre.push(...current);
                    return pre;
                }, [])
                    .map(sentence => sentence.trim())
                    .map(sentence => devideArray(formatSentence(sentence), 12))
                    .reduce((pre, current) => {
                    pre.push(...current);
                    return pre;
                }, [])
                    .map((lines) => {
                    return { lineList: lines };
                });
            });
        };
        p.setup = () => {
            p.createScalableCanvas(ScalableCanvasTypes.SQUARE640x640);
            const backgroundGraphics = createBackgroundGraphics();
            p.scalableCanvas.scale();
            p.image(backgroundGraphics, 0, 0);
            p.scalableCanvas.cancelScale();
            p.loadPixels();
            backgroundPixels = p.pixels;
            p.textFont(currentFont, FONT_SIZE);
            p.textAlign(p.CENTER, p.CENTER);
            defaultCharacterPositionY = p.nonScaledHeight * 0.09;
            sentenceReaderTimer = new NonLoopedFrameCounter(30, () => {
                const next = nextPage(pageList, currentPageIndex);
                setLineList(next.page.lineList);
                updatePageIndex(next.index);
            });
            characterGeneraterTimer = new LoopedFrameCounter(2, () => {
                characters.push(new CharacterSprite(p, currentLineList[currentLineIndex].charAt(currentCharacterIndex), shapeColor).setPosition(characterPosition));
                currentCharacterIndex += 1;
                characterPosition.add(0, FONT_SIZE);
                if (currentCharacterIndex >= currentLineList[currentLineIndex].length) {
                    currentCharacterIndex = 0;
                    currentLineIndex += 1;
                    characterPosition.set(characterPosition.x - LINE_INTERVAL, defaultCharacterPositionY);
                }
                if (currentLineIndex >= currentLineList.length) {
                    characterGeneraterTimer.off();
                    sentenceReaderTimer.resetCount();
                    sentenceReaderTimer.on(180);
                }
            }).off();
        };
        p.draw = () => {
            sentenceReaderTimer.step();
            characterGeneraterTimer.step();
            characters.step();
            characters.clean();
            p.pixels = backgroundPixels;
            p.updatePixels();
            p.scalableCanvas.scale();
            characters.draw();
            p.scalableCanvas.cancelScale();
        };
        p.windowResized = () => { };
        p.mousePressed = () => {
            // if (!p5ex.mouseIsInCanvas(p)) return;
            // p.noLoop();
        };
        p.keyTyped = () => {
            if (p.key === "p")
                p.noLoop();
        };
    };
    new p5exClass(sketch, SKETCH_NAME);

}());
//# sourceMappingURL=sketch.js.map
