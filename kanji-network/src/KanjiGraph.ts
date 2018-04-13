import * as p5ex from 'p5ex';
import KanjiNode from './KanjiNode';
import KanjiEdge from './KanjiEdge';
import PhysicsBodyEdge from './PhysicsBodyEdge';
import Camera from './Camera';

export default class KanjiGraph implements p5ex.Sprite {
  private static temporalVector: p5.Vector;
  private static temporalEdgeArray = new p5ex.LoopableArray<KanjiEdge>();

  private readonly nodes = new p5ex.SpriteArray<KanjiNode>();
  private readonly edges = new p5ex.SpriteArray<KanjiEdge>();
  private readonly nodeMap = new Map<string, KanjiNode>();
  private readonly incomingEdgesMap = new Map<KanjiNode, p5ex.SpriteArray<KanjiEdge>>();
  private readonly outgoingEdgesMap = new Map<KanjiNode, p5ex.SpriteArray<KanjiEdge>>();
  private readonly averagePosition: p5.Vector;
  private readonly repulsionTimer: p5ex.NonLoopedFrameCounter;
  private repulsionRatio: number;

  private readonly edgeColor: p5ex.ShapeColor;
  private readonly hudBackgroundColor: p5ex.ShapeColor;
  private readonly hudNodeColor: p5ex.ShapeColor;
  private readonly hudEdgeColor: p5ex.ShapeColor;
  private readonly hudCameraColor: p5ex.ShapeColor;

  private readonly applyRepulsion = (element: KanjiNode, otherElement: KanjiNode) => {
    if (p5ex.distSq(element.position, otherElement.position) > 160000) return;

    const degreeA =
      this.getIncomingEdges(element).length + this.getOutgoingEdges(element).length;
    const degreeB =
      this.getIncomingEdges(otherElement).length + this.getOutgoingEdges(otherElement).length;
    const totalDegree = degreeA + degreeB;

    // May not be correct, but works for now
    element.attractEachOther(
      otherElement,
      -20000000 * this.p.unitAccelerationMagnitude * this.repulsionRatio * totalDegree,
      0,
      50000 * this.p.unitAccelerationMagnitude * this.repulsionRatio,
      500 * this.p.unitAccelerationMagnitude,
    );
  }

  private readonly updateMass = (node: KanjiNode) => {
    node.mass *= 1.001;
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
    const tmpVec = KanjiGraph.temporalVector;

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

  private readonly drawNode = (node: KanjiNode) => {
    if (this.camera.region.contains(node.position)) node.draw();
  }

  private readonly drawEdge = (edge: KanjiEdge) => {
    if (
      this.camera.region.contains(edge.nodeA.position) ||
      this.camera.region.contains(edge.nodeB.position)
    ) edge.draw();
  }

  keepAwayIncidentEdges = (node: KanjiNode) => {
    const edges = KanjiGraph.temporalEdgeArray;
    edges.clear();
    edges.pushAll(this.getIncomingEdges(node));
    edges.pushAll(this.getOutgoingEdges(node));
    const edgeCount = edges.length;

    for (let i = 0; i < edgeCount; i += 1) {
      const nextIndex = (i + 1) % edgeCount;
      this.keepAwayEdgePair(node, edges.get(i), edges.get(nextIndex), 0.3);
    }
  }

  constructor(
    protected readonly p: p5ex.p5exClass,
    lines: string[],
    protected readonly font: p5.Font,
    protected readonly camera: Camera,
  ) {
    KanjiGraph.temporalVector = p.createVector();

    for (const line of lines) {
      const characters = p.split(line, '\t');
      const lastIndex = characters.length - 1;
      const lastCharacter = characters[lastIndex];

      for (let i = 0; i < lastIndex; i += 1) {
        this.addEdge(characters[i], lastCharacter);
      }
    }

    this.edges.loop(
      (edge: KanjiEdge) => {
        const predecessorNodeDegree =
          this.getIncomingEdges(edge.nodeA).length + this.getOutgoingEdges(edge.nodeA).length;
        const successorNodeDegree =
          this.getIncomingEdges(edge.nodeB).length + this.getOutgoingEdges(edge.nodeB).length;
        // edge.springConstant =
        //   (predecessorNodeDegree === 1 || successorNodeDegree === 1) ?
        //   0.1 :
        //   0.1 / p.sq(1 * (predecessorNodeDegree + successorNodeDegree));
        const difference = p.abs(predecessorNodeDegree - successorNodeDegree);
        edge.springConstant = 0.005 * (1 + difference);
      },
    );

    this.repulsionTimer = new p5ex.NonLoopedFrameCounter(420);

    this.averagePosition = p.createVector();

    this.edgeColor = new p5ex.ShapeColor(p, p.color(64), undefined);
    this.hudBackgroundColor = new p5ex.ShapeColor(p, null, p.color(0, 192));
    this.hudNodeColor = new p5ex.ShapeColor(p, null, p.color(255, 64));
    this.hudEdgeColor = new p5ex.ShapeColor(p, p.color(255, 32), undefined);
    this.hudCameraColor = new p5ex.ShapeColor(p, p.color(255, 0, 0, 192), null);
  }

  toString(): string {
    let s = '';

    for (let i = 0, len = this.edges.length; i < len; i += 1) {
      s += this.edges.array[i] + '\n';
    }

    return s;
  }

  step(): void {
    this.repulsionTimer.step();
    this.repulsionRatio = this.p.sq(this.repulsionTimer.getProgressRatio());
    this.nodes.loop(this.updateMass);

    this.edges.step();
    this.nodes.step();
    // this.nodes.loop(this.keepAwayIncidentEdges);
    this.nodes.roundRobin(this.applyRepulsion);
  }

  draw(): void {
    this.p.strokeWeight(1);
    this.edgeColor.applyColor();
    this.edges.loop(this.drawEdge);
    this.nodes.loop(this.drawNode);
  }

  drawHud(): void {
    this.hudBackgroundColor.applyColor();
    this.p.rect(
      0, 0, this.p.nonScaledWidth, this.p.nonScaledHeight,
    );

    this.p.scale(0.28);
    this.p.blendMode(this.p.ADD);

    this.p.strokeWeight(16);
    this.hudEdgeColor.applyColor();
    this.edges.loop(this.drawHudEdge);
    this.hudNodeColor.applyColor();
    this.nodes.loop(this.drawHudNode);

    this.p.strokeWeight(10);
    this.hudCameraColor.applyColor();
    this.p.rect(
      this.camera.scaleFactor.reciprocalValue * this.camera.position.x,
      this.camera.scaleFactor.reciprocalValue * this.camera.position.y,
      this.camera.scaleFactor.reciprocalValue * this.p.nonScaledWidth,
      this.camera.scaleFactor.reciprocalValue * this.p.nonScaledHeight,
    );

    this.p.blendMode(this.p.BLEND);
    this.p.scale(1 / 0.28);
  }

  addEdge(predecessorCharacter: string, successorCharacter: string): void {
    const predecessorKanji = this.getOrCreateNode(predecessorCharacter);
    const successorKanji = this.getOrCreateNode(successorCharacter);

    // Check if already added
    for (let i = 0; i < this.edges.length; i += 1) {
      const copmaringEdge = this.edges.get(i);

      if (predecessorKanji === copmaringEdge.nodeA && successorKanji === copmaringEdge.nodeB) {
        return;
      }
    }

    const newEdge = new KanjiEdge(
      this.p, predecessorKanji, successorKanji,
    );
    this.edges.push(newEdge);

    this.getOutgoingEdges(predecessorKanji).push(newEdge);
    predecessorKanji.mass += 2;

    this.getIncomingEdges(successorKanji).push(newEdge);
  }

  getIncomingEdges(node: KanjiNode): p5ex.SpriteArray<KanjiEdge> {
    const edges = this.incomingEdgesMap.get(node);

    if (!edges) throw 'Passed unregistered node to getIncomingEdges().';

    return edges;
  }

  getOutgoingEdges(node: KanjiNode): p5ex.SpriteArray<KanjiEdge> {
    const edges = this.outgoingEdgesMap.get(node);

    if (!edges) throw 'Passed unregistered node to getOutgoingEdges().';

    return edges;
  }

  getAveragePosition(): p5.Vector {
    this.averagePosition.set(0, 0);

    this.nodes.loop(
      (body: p5ex.PhysicsBody) => {
        this.averagePosition.add(body.position);
      },
    );

    this.averagePosition.div(Math.max(1, this.nodes.length));

    return this.averagePosition;
  }

  private getOrCreateNode(character: string): KanjiNode {
    const existingKanji = this.nodeMap.get(character);

    if (existingKanji) return existingKanji;

    const kanji = new KanjiNode(this.p, character, this.font);
    this.nodeMap.set(character, kanji);
    this.nodes.push(kanji);
    this.incomingEdgesMap.set(kanji, new p5ex.SpriteArray<KanjiEdge>());
    this.outgoingEdgesMap.set(kanji, new p5ex.SpriteArray<KanjiEdge>());

    return kanji;
  }

  private drawHudNode(node: KanjiNode): void {
    node.drawHud();
  }

  private drawHudEdge(edge: KanjiEdge): void {
    edge.drawHud();
  }
}
