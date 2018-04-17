import * as p5ex from 'p5ex';
import GraphNode from './GraphNode';
import GraphEdge from './GraphEdge';
import PhysicsBodyEdge from './PhysicsBodyEdge';

function log(s: string): void {
  // console.log(s);
}

function subtractArray<T>(arrayA: T[], arrayB: T[]): T[] {
  return arrayA.filter(
    (av) => {
      return arrayB.findIndex((bv) => { return av === bv; }) === -1;
    },
  );
}

function arrayProduct<T>(arrayA: T[], arrayB: T[]): T[] {
  return arrayA.filter(
    (av) => {
      return arrayB.findIndex((bv) => { return av === bv; }) !== -1;
    },
  );
}

function remove<T>(array: T[], element: T): T {
  return array.splice(array.findIndex((value: T) => { return value === element; }), 1)[0];
}

function toArray<T>(loopableArray: p5ex.LoopableArray<T>): T[] {
  const array: T[] = [];

  for (let i = 0; i < loopableArray.length; i += 1) {
    array.push(loopableArray.get(i));
  }

  return array;
}

function containNode(edges: GraphEdge[], node: GraphNode): boolean {
  for (const edge of edges) {
    if (edge.isIncidentTo(node)) return true;
  }
  return false;
}

function isIncident(edge: GraphEdge, otherEdges: GraphEdge[]): boolean {
  for (const otherEdge of otherEdges) {
    if (edge.isIncidentToEdge(otherEdge)) return true;
  }
  return false;
}

function keepIn(
  region: p5ex.RectangleRegion,
  body: p5ex.PhysicsBody,
  restitution: number = 1,
): void {
  const bodyRadius = body.collisionRadius;

  if (body.x < region.leftPositionX + bodyRadius) {
    body.position.x = region.leftPositionX + bodyRadius;
    body.velocity.x = -restitution * body.velocity.x;
  } else if (body.x > region.rightPositionX - bodyRadius) {
    body.position.x = region.rightPositionX - bodyRadius;
    body.velocity.x = -restitution * body.velocity.x;
  }

  if (body.y < region.topPositionY + bodyRadius) {
    body.position.y = region.topPositionY + bodyRadius;
    body.velocity.y = -restitution * body.velocity.y;
  } else if (body.y > region.bottomPositionY - bodyRadius) {
    body.position.y = region.bottomPositionY - bodyRadius;
    body.velocity.y = -restitution * body.velocity.y;
  }
}

export default class Graph implements p5ex.Sprite {
  private static temporalVector: p5.Vector;
  private static temporalEdgeArray = new p5ex.LoopableArray<GraphEdge>();
  private static isInitialized = false;

  private region: p5ex.RectangleRegion;

  private readonly oneStrokeDelayTimer: p5ex.NonLoopedFrameCounter;
  private resetTimer: p5ex.NonLoopedFrameCounter;
  private readonly nodes = new p5ex.SpriteArray<GraphNode>();
  private readonly edges = new p5ex.SpriteArray<GraphEdge>();
  private readonly incidentEdgesMap = new Map<GraphNode, p5ex.SpriteArray<GraphEdge>>();
  private readonly midPoints = new p5ex.LoopableArray<p5ex.PhysicsBody>();

  private firstNode: GraphNode;
  private firstEdge: GraphEdge;

  private readonly applyRepulsion = (element: GraphNode, otherElement: GraphNode) => {
    // May not be correct, but works for now
    element.attractEachOther(
      otherElement,
      -10000000 * this.p.unitAccelerationMagnitude,
      0,
      10000 * this.p.unitAccelerationMagnitude,
    );
  }

  private readonly applyMidPointsRepulsion = (element: GraphNode, otherElement: GraphNode) => {
    // May not be correct, but works for now
    element.attractEachOther(
      otherElement,
      -1000000 * this.p.unitAccelerationMagnitude,
      0,
      1000 * this.p.unitAccelerationMagnitude,
    );
  }

  private readonly keepInScreen = (body: p5ex.PhysicsBody) => {
    keepIn(this.region, body, 0.7);
  }

  private readonly keepAwayEdgePair = (
    node: p5ex.PhysicsBody,
    edgeA: PhysicsBodyEdge<p5ex.PhysicsBody>, edgeB: PhysicsBodyEdge<p5ex.PhysicsBody>,
    magnitudeFactor: number,
  ) => {
    const directionAngleA = edgeA.getDirectionAngle(node);
    const directionAngleB = edgeB.getDirectionAngle(node);
    const angleDifferenceAB = p5ex.angleDifference(
      directionAngleB, directionAngleA,
    );
    const angleDifferenceRatio = this.p.abs(angleDifferenceAB) / this.p.PI;
    const effortForceMagnitude = magnitudeFactor / this.p.sq(Math.max(angleDifferenceRatio, 0.05));
    const tmpVec = Graph.temporalVector;

    const aIsLeft = angleDifferenceAB > 0;

    const edgeADistanceSquared = edgeA.distanceSquared;
    if (edgeADistanceSquared > 1) {
      const forceA = p5ex.calculateLeverageForce(
        directionAngleA,
        this.p.sqrt(edgeADistanceSquared), 1, effortForceMagnitude, aIsLeft, tmpVec,
      );
      edgeA.getAdjacentNode(node).applyForce(forceA);
    }

    const edgeBDistanceSquared = edgeB.distanceSquared;
    if (edgeBDistanceSquared > 1) {
      const forceB = p5ex.calculateLeverageForce(
        directionAngleB,
        this.p.sqrt(edgeBDistanceSquared), 1, effortForceMagnitude, !aIsLeft, tmpVec,
      );
      edgeB.getAdjacentNode(node).applyForce(forceB);
    }
  }

  keepAwayIncidentEdges = (node: GraphNode) => {
    const edges = Graph.temporalEdgeArray;
    edges.clear();
    edges.pushAll(this.getIncidentEdges(node));
    const edgeCount = edges.length;

    for (let i = 0; i < edgeCount; i += 1) {
      const nextIndex = (i + 1) % edgeCount;
      this.keepAwayEdgePair(node, edges.get(i), edges.get(nextIndex), 0.3);
    }
  }

  constructor(protected readonly p: p5ex.p5exClass) {
    if (!Graph.isInitialized) {
      Graph.temporalVector = p.createVector();
      Graph.isInitialized = true;
    }

    this.region = new p5ex.RectangleRegion(0, 0, p.nonScaledWidth, p.nonScaledHeight, -50);

    this.oneStrokeDelayTimer = new p5ex.NonLoopedFrameCounter(
      1 * p.idealFrameRate,
      () => {
        this.firstEdge.fire(this.firstNode);
      },
    );

    this.reset();
  }

  reset(): void {
    const retryCount = 1000;

    for (let i = 0; i < retryCount; i += 1) {
      try {
        this.generate(p5ex.randomIntBetween(6, 10));
        this.setOneStroke();
        break;
      } catch (e) {
        if (i === retryCount - 1) throw 'Failed to generate graph.';
      }
    }

    this.oneStrokeDelayTimer.resetCount().on();

    this.resetTimer = new p5ex.NonLoopedFrameCounter(
      (1 + this.edges.length * 0.5 + 1) * this.p.idealFrameRate,
      () => {
        this.reset();
      },
    );
  }

  step(): void {
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

  draw(): void {
    this.edges.draw();
    this.nodes.draw();
  }

  addEdge(
    nodeA?: GraphNode,
    nodeB?: GraphNode,
    directed: boolean = false,
    onlyIfAbsent: boolean = false,
  ): null | GraphEdge {
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

  getIncidentEdges(node: GraphNode): p5ex.SpriteArray<GraphEdge> {
    const edges = this.incidentEdgesMap.get(node);

    if (!edges) throw 'Passed unregistered node to getIncidentEdges().';

    return edges;
  }

  getDegrees(node: GraphNode): number {
    return this.getIncidentEdges(node).length;
  }

  private addNode(): GraphNode {
    const newNode = new GraphNode(this.p);
    this.nodes.push(newNode);
    this.incidentEdgesMap.set(newNode, new p5ex.SpriteArray<GraphEdge>());

    return newNode;
  }

  private generate(nodeCount: number): void {
    this.nodes.clear();
    this.incidentEdgesMap.clear();

    for (let i = 0; i < nodeCount; i += 1) {
      this.addNode();
    }

    this.edges.clear();
    this.midPoints.clear();

    while (true) {
      const nodeCandidates = toArray(this.nodes).filter(
        (node) => {
          const degrees = this.getDegrees(node);
          if (degrees === 0 || degrees % 2 === 1) return true;
          if (degrees === 2 && Math.random() < 0.5) return true;
          return false;
        },
      );

      if (nodeCandidates.length === 0) break;

      const currentNode = remove(nodeCandidates, this.p.random(nodeCandidates));
      const adjacentNode = remove(nodeCandidates, this.p.random(nodeCandidates));

      const newEdge = this.addEdge(currentNode, adjacentNode);
      if (newEdge) this.midPoints.push(newEdge.midPoint);
    }
  }

  private setOneStroke(): void {
    const allEdges = toArray(this.edges);

    const beginningEdge = remove(allEdges, this.p.random(allEdges));
    const beginningNode = this.p.random([beginningEdge.nodeA, beginningEdge.nodeB]);

    const loop = this.createLoop(allEdges, beginningEdge, beginningNode);

    while (loop.length !== this.edges.length) {
      const remainingEdges = subtractArray(allEdges, loop);
      const beginningEdgeCandidates = remainingEdges.filter(
        (e: GraphEdge) => { return isIncident(e, loop); },
      );
      const beginningEdge = remove(remainingEdges, this.p.random(beginningEdgeCandidates));
      const beginningNode = containNode(loop, beginningEdge.nodeA) ?
        beginningEdge.nodeA : beginningEdge.nodeB;
      log('Creating other loop starting at ' + beginningNode.toString());
      const otherLoop = this.createLoop(
        remainingEdges,
        beginningEdge,
        beginningNode,
      );
      const insertingIndex = loop.findIndex(
        (cur: GraphEdge, i: number, array: GraphEdge[]) => {
          const prev = (i === 0) ? array[array.length - 1] : array[i - 1];
          const commonNode =
            prev.isIncidentTo(cur.nodeA) ? cur.nodeA : cur.nodeB;
          return beginningNode === commonNode;
        },
      );

      if (insertingIndex === -1) throw 'error.';

      loop.splice(insertingIndex, 0, ...otherLoop);
      log('inserted -> ' + loop.toString());
    }

    for (let i = 0; i < loop.length - 1; i += 1) {
      loop[i].nextEdge = loop[i + 1];
    }

    this.firstEdge = loop[0];
    this.firstNode = loop[1].isIncidentTo(this.firstEdge.nodeA) ?
      (
        loop[1].isIncidentTo(this.firstEdge.nodeB) ?
          (
            loop[2].isIncidentTo(this.firstEdge.nodeA) ?
              this.firstEdge.nodeA : this.firstEdge.nodeB
          ) :
          this.firstEdge.nodeB
      ) :
      this.firstEdge.nodeA;
  }

  private createLoop(
    baseEdges: GraphEdge[], firstEdge: GraphEdge, firstNode: GraphNode,
  ): GraphEdge[] {
    log('Base edges: ' + baseEdges.toString());
    log('Fisrt edge: ' + firstEdge.toString());
    log('Fisrt node: ' + firstNode.toString());

    const loop: GraphEdge[] = [];
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

        log('Remaining: ' + remainingEdges.toString());

        const nextIncidentEdges = toArray(this.getIncidentEdges(nextNode));
        log('Next incident: ' + nextIncidentEdges.toString());

        const nextEdgeCandidates = arrayProduct(remainingEdges, nextIncidentEdges);
        log ('Candidates: ' + nextEdgeCandidates.toString());

        if (nextEdgeCandidates.length === 0) break;

        const nextEdge = remove(remainingEdges, this.p.random(nextEdgeCandidates));
        log('Next edge: ' + nextEdge.toString());
        loop.push(nextEdge);
        currentNode = nextNode;
        nextNode = nextEdge.getAdjacentNode(currentNode);
      }

      if (completed) {
        log('Complete.');
        break;
      }
      log('Created loop: ' + loop.toString());

      if (i === retryCount - 1) throw 'Failed to set one-stroke.';

      log('Retry...');
    }

    return loop;
  }
}
