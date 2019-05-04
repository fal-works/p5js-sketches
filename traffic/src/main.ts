import * as p5ex from "p5ex";
import {
  createGradationRectangle,
  createObjectPool,
  useObject,
  recycleObject,
  ObjectPool
} from "./functions";

const SKETCH_NAME = "Traffic";

const enum Bound {
  TOP,
  BOTTOM,
  LEFT,
  RIGHT
}

interface EndPoint {
  position: p5.Vector;
  velocity: number;
  acceleration: number;
  bound: Bound;
}

interface Road {
  startPoint: EndPoint;
  endPoint: EndPoint;
  intersectionList: Intersection[];
}

interface Vehicle {
  road: Road;
  positionRatio: number;
  positionRatioChangeRate: number;
  positionRatioTotalChange: number;
  acceleration: number;
  roadChangeEffectTimer: p5ex.NonLoopedFrameCounter;
}

interface Intersection {
  roadA: Road;
  positionRatioA: number;
  roadB: Road;
  positionRatioB: number;
}

interface ReadonlyNumberRange {
  readonly start: number;
  readonly end: number;
}

const sketch = (p: p5ex.p5exClass): void => {
  // ---- constants
  const DRAW_INTERSECTIONS = false;
  const boundArray = [Bound.TOP, Bound.BOTTOM, Bound.LEFT, Bound.RIGHT];
  const ROAD_COUNT = 24;
  const ROAD_STROKE_WEIGHT = 1;
  const VEHICLE_COUNT = 64;
  const VEHICLE_SIZE = 12;
  const VEHICLE_STROKE_WEIGHT = 2;
  const VEHICLE_EXPAND_MAX_RATIO = 0.2;
  const VEHICLE_EXPAND_TIME_SCALE = 60;
  const INTERSECTION_SIZE = 5;
  const MAX_INTERSECTION_COUNT = ROAD_COUNT * ROAD_COUNT;
  const POSITION_RATIO_DISTANCE_THREASHOLD = 0.0025;
  const ROAD_CHANGE_EFFECT_DURATION = 30;
  const END_POINT_VELOCITY_RANGE: ReadonlyNumberRange = {
    start: -0.5,
    end: 0.5
  };
  const END_POINT_ACCELERATION_RANGE: ReadonlyNumberRange = {
    start: -0.05,
    end: 0.05
  };
  const VEHICLE_POSITION_CHANGE_RATE_RANGE: ReadonlyNumberRange = {
    start: 0.002,
    end: 0.005
  };
  const VEHICLE_ACCELERATION_RANGE: ReadonlyNumberRange = {
    start: -0.0001,
    end: 0.0001
  };
  const END_POINT_ACCELERATION_CHANGE_PROBABILITY = 0.01;
  const VEHICLE_ACCELERATION_CHANGE_PROBABILITY = 0.02;
  const ROAD_CHANGE_POSSIBILITY = 0.75;

  // variables
  let intersectionPool: ObjectPool<Intersection>;
  let usedIntersections: p5ex.LoopableArray<Intersection>;
  let backgroundPixels: number[];
  let roads: p5ex.LoopableArray<Road>;
  let vehicles: p5ex.LoopableArray<Vehicle>;
  let roadColor: p5ex.ShapeColor;
  let vehicleColor: p5ex.ShapeColor;
  let activeVehicleColor: p5ex.ShapeColor;

  // ---- functions
  function randomIn(range: ReadonlyNumberRange): number {
    return p.random(range.start, range.end);
  }

  function constrainInRange(value: number, range: ReadonlyNumberRange): number {
    return p.constrain(value, range.start, range.end);
  }

  function drawCircleOnLineSegment(
    startPosition: p5.Vector,
    endPosition: p5.Vector,
    positionRatio: number,
    diameter: number
  ): void {
    p.ellipse(
      p.lerp(startPosition.x, endPosition.x, positionRatio),
      p.lerp(startPosition.y, endPosition.y, positionRatio),
      diameter,
      diameter
    );
  }

  function createEndPoint(bound: Bound): EndPoint {
    let x: number;
    let y: number;
    const ratio = p.random(0.2, 0.8);

    switch (bound) {
      default:
      case Bound.TOP:
        x = ratio * p.width;
        y = 0;
        break;
      case Bound.BOTTOM:
        x = ratio * p.width;
        y = p.height;
        break;
      case Bound.LEFT:
        x = 0;
        y = ratio * p.height;
        break;
      case Bound.RIGHT:
        x = p.width;
        y = ratio * p.height;
        break;
    }

    return {
      position: p.createVector(x, y),
      velocity: 0,
      acceleration: 0,
      bound: bound
    };
  }

  function createRoad(): Road {
    const startPointBound: Bound = p.random(boundArray);
    const endPointBound: Bound = p.random(
      boundArray.filter(b => b != startPointBound)
    );

    return {
      startPoint: createEndPoint(startPointBound),
      endPoint: createEndPoint(endPointBound),
      intersectionList: []
    };
  }

  function updateEndPoint(endPoint: EndPoint): void {
    if (Math.random() < END_POINT_ACCELERATION_CHANGE_PROBABILITY)
      endPoint.acceleration = randomIn(END_POINT_ACCELERATION_RANGE);

    endPoint.velocity = constrainInRange(
      endPoint.velocity + endPoint.acceleration,
      END_POINT_VELOCITY_RANGE
    );

    const position = endPoint.position;
    switch (endPoint.bound) {
      case Bound.TOP:
      case Bound.BOTTOM:
        position.x += endPoint.velocity;
        if (position.x < 0) {
          position.x = 1;
          endPoint.velocity = 0;
          endPoint.acceleration = END_POINT_ACCELERATION_RANGE.end * 2;
        } else if (position.x > p.width) {
          position.x = p.width - 1;
          endPoint.velocity = 0;
          endPoint.acceleration = END_POINT_ACCELERATION_RANGE.start * 2;
        }
        break;
      case Bound.LEFT:
      case Bound.RIGHT:
        position.y += endPoint.velocity;
        if (position.y < 0) {
          position.y = 1;
          endPoint.velocity = 0;
          endPoint.acceleration = END_POINT_ACCELERATION_RANGE.end * 2;
        } else if (position.y > p.height) {
          position.y = p.height - 1;
          endPoint.velocity = 0;
          endPoint.acceleration = END_POINT_ACCELERATION_RANGE.start * 2;
        }
        break;
    }
  }

  function updateRoad(road: Road): void {
    updateEndPoint(road.startPoint);
    updateEndPoint(road.endPoint);
  }

  function drawRoad(road: Road): void {
    const startPosition = road.startPoint.position;
    const endPosition = road.endPoint.position;
    p.line(startPosition.x, startPosition.y, endPosition.x, endPosition.y);
  }

  function drawIntersection(intersection: Intersection): void {
    const road = intersection.roadA;
    const startPosition = road.startPoint.position;
    const endPosition = road.endPoint.position;
    drawCircleOnLineSegment(
      startPosition,
      endPosition,
      intersection.positionRatioA,
      INTERSECTION_SIZE
    );
  }

  function clearIntersections(road: Road): void {
    road.intersectionList.length = 0;
  }

  function tryAddIntersection(roadA: Road, roadB: Road): void {
    const A = roadA.startPoint.position;
    const B = roadA.endPoint.position;
    const C = roadB.startPoint.position;
    const D = roadB.endPoint.position;

    let divider = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);
    if (divider == 0) return;

    const ACx = C.x - A.x;
    const ACy = C.y - A.y;

    const ratioA = ((D.y - C.y) * ACx - (D.x - C.x) * ACy) / divider;
    if (ratioA < 0 || ratioA > 1) return;

    const ratioB = ((B.y - A.y) * ACx - (B.x - A.x) * ACy) / divider;
    if (ratioB < 0 || ratioB > 1) return;

    const intersection = useObject(intersectionPool);
    usedIntersections.push(intersection);
    intersection.roadA = roadA;
    intersection.positionRatioA = ratioA;
    intersection.roadB = roadB;
    intersection.positionRatioB = ratioB;

    roadA.intersectionList.push(intersection);
    roadB.intersectionList.push(intersection);
  }

  function recycleAllIntersections(): void {
    const len = usedIntersections.length;
    for (let i = 0; i < len; i++) {
      recycleObject(intersectionPool, usedIntersections.pop());
    }
  }

  function tryChangeRoad(
    vehicle: Vehicle,
    intersection: Intersection
  ): boolean {
    const currentRoad = vehicle.road;
    let otherRoad: Road;
    let currentRoadIntersectionPositionRatio: number;
    let otherRoadIntersectionPositionRatio: number;
    if (intersection.roadA === currentRoad) {
      otherRoad = intersection.roadB;
      currentRoadIntersectionPositionRatio = intersection.positionRatioA;
      otherRoadIntersectionPositionRatio = intersection.positionRatioB;
    } else {
      otherRoad = intersection.roadA;
      currentRoadIntersectionPositionRatio = intersection.positionRatioB;
      otherRoadIntersectionPositionRatio = intersection.positionRatioA;
    }

    const ratioDifference =
      vehicle.positionRatio - currentRoadIntersectionPositionRatio;

    if (
      ratioDifference < -POSITION_RATIO_DISTANCE_THREASHOLD ||
      ratioDifference > POSITION_RATIO_DISTANCE_THREASHOLD
    ) {
      return false;
    }

    if (Math.random() >= ROAD_CHANGE_POSSIBILITY) {
      vehicle.positionRatio =
        currentRoadIntersectionPositionRatio +
        POSITION_RATIO_DISTANCE_THREASHOLD;
      return false;
    }

    vehicle.road = otherRoad;
    vehicle.positionRatio =
      otherRoadIntersectionPositionRatio + POSITION_RATIO_DISTANCE_THREASHOLD;
    vehicle.roadChangeEffectTimer.resetCount().on();
    return true;
  }

  function updateVehicle(vehicle: Vehicle): void {
    if (Math.random() < VEHICLE_ACCELERATION_CHANGE_PROBABILITY)
      vehicle.acceleration = randomIn(VEHICLE_ACCELERATION_RANGE);

    let changeRate = constrainInRange(
      vehicle.positionRatioChangeRate + vehicle.acceleration,
      VEHICLE_POSITION_CHANGE_RATE_RANGE
    );
    vehicle.positionRatioChangeRate = changeRate;
    vehicle.positionRatioTotalChange += changeRate;

    let ratio = vehicle.positionRatio;
    ratio += changeRate;
    if (ratio > 1) ratio -= 1;

    vehicle.positionRatio = ratio;

    for (const intersection of vehicle.road.intersectionList) {
      if (tryChangeRoad(vehicle, intersection)) return;
    }

    vehicle.roadChangeEffectTimer.step();
  }

  function drawVehicle(vehicle: Vehicle): void {
    const road = vehicle.road;
    const startPosition = road.startPoint.position;
    const endPosition = road.endPoint.position;
    const ratio = vehicle.positionRatio;
    const expandFactor =
      VEHICLE_EXPAND_MAX_RATIO *
      Math.cos(VEHICLE_EXPAND_TIME_SCALE * vehicle.positionRatioTotalChange);
    const diameter = (1 + expandFactor) * VEHICLE_SIZE;

    const timer = vehicle.roadChangeEffectTimer;
    const alphaRatio = timer.getProgressRatio();
    if (timer.isOn && alphaRatio < 1) {
      vehicleColor.applyColor(alphaRatio * 255);
      drawCircleOnLineSegment(startPosition, endPosition, ratio, diameter);
      activeVehicleColor.applyColor((1 - alphaRatio) * 255);
      drawCircleOnLineSegment(startPosition, endPosition, ratio, diameter);
    } else {
      vehicleColor.applyColor();
      drawCircleOnLineSegment(startPosition, endPosition, ratio, diameter);
    }
  }

  function initialize() {
    roads = new p5ex.LoopableArray(ROAD_COUNT);
    for (let i = 0; i < ROAD_COUNT; i++) {
      roads.push(createRoad());
    }
    vehicles = new p5ex.LoopableArray(VEHICLE_COUNT);
    const roadArray = roads.array;
    function createVehicle(): Vehicle {
      return {
        road: p.random(roadArray),
        positionRatio: Math.random(),
        positionRatioChangeRate: randomIn(VEHICLE_POSITION_CHANGE_RATE_RANGE),
        positionRatioTotalChange: 0,
        acceleration: 0,
        roadChangeEffectTimer: new p5ex.NonLoopedFrameCounter(
          ROAD_CHANGE_EFFECT_DURATION
        ).off()
      };
    }
    for (let i = 0; i < VEHICLE_COUNT; i++) {
      vehicles.push(createVehicle());
    }

    const dummyRoad = createRoad();
    intersectionPool = createObjectPool((): Intersection => {
      return {
        roadA: dummyRoad,
        positionRatioA: 0,
        roadB: dummyRoad,
        positionRatioB: 0
      };
    }, MAX_INTERSECTION_COUNT);
    usedIntersections = new p5ex.LoopableArray(MAX_INTERSECTION_COUNT);
  }

  // ---- Setup & Draw etc.
  p.preload = () => {};

  p.setup = () => {
    p.createScalableCanvas(p5ex.ScalableCanvasTypes.FULL);
    const backgroundGraphics = createGradationRectangle(
      p,
      p.nonScaledWidth,
      p.nonScaledHeight,
      p.color(254, 254, 255),
      p.color(254, 254, 255),
      p.color(244, 244, 255),
      4,
      2
    ) as any;
    p.scalableCanvas.scale();
    p.image(backgroundGraphics, 0, 0);
    p.scalableCanvas.cancelScale();
    p.loadPixels();
    backgroundPixels = p.pixels;
    p.noFill();

    roadColor = new p5ex.ShapeColor(p, p.color(128), undefined, false);
    vehicleColor = new p5ex.ShapeColor(
      p,
      p.color(0, 112, 255),
      // p.color(0, 112, 255, 32),
      undefined,
      true
    );
    activeVehicleColor = new p5ex.ShapeColor(
      p,
      p.color(240, 0, 128),
      // p.color(240, 0, 128, 32),
      undefined,
      true
    );

    initialize();
  };

  p.draw = () => {
    p.pixels = backgroundPixels;
    p.updatePixels();

    roads.loop(updateRoad);

    roads.loop(clearIntersections);
    recycleAllIntersections();
    roads.roundRobin(tryAddIntersection);
    vehicles.loop(updateVehicle);

    roadColor.applyColor();
    p.strokeWeight(ROAD_STROKE_WEIGHT);
    roads.loop(drawRoad);
    if (DRAW_INTERSECTIONS) usedIntersections.loop(drawIntersection);
    p.strokeWeight(VEHICLE_STROKE_WEIGHT);
    vehicles.loop(drawVehicle);
  };

  p.mousePressed = () => {
    initialize();
  };

  p.keyTyped = () => {
    if (p.key === "p") p.noLoop();

    // if (p.key === "s") p.save("image.png");
  };
};

new p5ex.p5exClass(sketch, SKETCH_NAME);
