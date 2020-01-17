/**
 * ---- Body ------------------------------------------------------------------
 */

import * as CCC from "@fal-works/creative-coding-core";
import {
  p,
  canvas,
  Vector2D,
  RectangleRegion,
  ArrayQueue,
  Kinematics,
  SimpleDynamics,
  Gravitation,
  Bounce,
  ShapeColor,
  max2,
  drawTranslatedAndRotated
} from "./common";

type TrailNode = CCC.Vector2D.Unit;

export interface BodyUnit extends CCC.SimpleDynamics.VerletQuantity {
  trail: CCC.ArrayQueue.Unit<TrailNode>;
}

Gravitation.setConstant(2000);

export const Body = (() => {
  const shellSize = 64;
  const trailLength = 64;
  const coreColor = ShapeColor.create(null, 32, 1);
  const shellColor = ShapeColor.create([128, 128], [240, 128], 1);
  let region: CCC.RectangleRegion.Unit;

  const reset = () => {
    region = RectangleRegion.createFromCenter(Vector2D.zero, {
      width: canvas.logicalSize.width - shellSize,
      height: canvas.logicalSize.height - shellSize
    });
  };

  const create = (position: CCC.Vector2D.Unit): BodyUnit => ({
    ...SimpleDynamics.createVerletQuantity(position.x, position.y),
    trail: ArrayQueue.create(trailLength)
  });

  const preUpdate = SimpleDynamics.updateVerlet;

  const createTrailNode = (body: BodyUnit): TrailNode => ({
    x: body.x,
    y: body.y
  });

  const updateTrail = (body: BodyUnit) => {
    const { trail } = body;

    ArrayQueue.dequeueIfFull(trail);
    ArrayQueue.enqueue(trail, createTrailNode(body));
  };

  const relativeVector = Vector2D.Mutable.create();

  const interact = (bodyA: BodyUnit, bodyB: BodyUnit) => {
    Vector2D.Assign.subtract(bodyB, bodyA, relativeVector);
    const distance = max2(shellSize, Vector2D.length(relativeVector));

    Gravitation.attractEachOther.precalculatedSimple(
      bodyA,
      bodyB,
      relativeVector,
      distance
    );

    /* Collision mode */
    // if (distance > SIZE) return;
    // Bounce.addForceEachOther.calculate(bodyA, bodyB, 2);
    // Vector2D.Mutable.separateEachOther(bodyA, bodyB, SIZE, 0.5);
  };

  const postUpdate = (body: BodyUnit) => {
    SimpleDynamics.truncateForce(body, 8);
    Bounce.addForceWithinRectangle(body, region, 0.5);
    SimpleDynamics.postUpdateVerlet(body);

    updateTrail(body);
  };

  const drawCoreAtOrigin = () => {
    p.triangle(12, 0, -7, -8, -7, 8);
  };

  const draw = (body: BodyUnit) => {
    const { x, y } = body;

    ShapeColor.apply(shellColor, 255);
    p.circle(x, y, shellSize);

    ShapeColor.apply(coreColor, 255);
    drawTranslatedAndRotated(
      drawCoreAtOrigin,
      x,
      y,
      Kinematics.getVelocityAngle(body)
    );
  };

  const drawTrailNode = (node: TrailNode) => p.curveVertex(node.x, node.y);

  const drawTrail = (body: BodyUnit) => {
    p.beginShape();
    ArrayQueue.loop(body.trail, drawTrailNode);
    p.endShape();
  };

  return {
    reset,
    create,
    preUpdate,
    interact,
    postUpdate,
    draw,
    drawTrail
  };
})();
