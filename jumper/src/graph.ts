import { GraphNode, GraphNodeUnit } from "./graph-node";
import { GraphEdge, GraphEdgeUnit } from "./graph-edge";
import { p, Arrays, Random, Camera, ShapeColor, camera, area } from "./common";

export const Graph = (() => {
  let nodes: GraphNodeUnit[];
  let edges: GraphEdgeUnit[];

  let focusedNode: GraphNodeUnit;
  const markerColor = ShapeColor.create("#BF1E56", null, 1);
  const boundaryColor = ShapeColor.create([0, 64], null, 1);

  const getIncidentEdges = (node: GraphNodeUnit) =>
    edges.filter(edge => edge.nodeA === node || edge.nodeB === node);

  const reset = () => {
    nodes = Arrays.createPopulated(GraphNode.create, 48);

    edges = [];
    Arrays.roundRobin(nodes, (a, b) => {
      if (Random.bool(0.8)) return;
      if (getIncidentEdges(a).length >= 3 || getIncidentEdges(b).length >= 3)
        return;

      edges.push(GraphEdge.create(a, b));
    });

    const initialFocusedNode = nodes.find(
      node => getIncidentEdges(node).length > 0
    );
    if (!initialFocusedNode) {
      console.error("Failed to reset.");
      return;
    }
    focusedNode = initialFocusedNode;
    camera.targetFocusPoint = focusedNode;
  };

  const update = () => {
    Arrays.loop(nodes, GraphNode.update);
    Arrays.loop(edges, GraphEdge.update);
    Camera.update(camera);
  };

  const drawGraph = () => {
    Arrays.loop(edges, GraphEdge.draw);
    Arrays.loop(nodes, GraphNode.draw);

    p.strokeWeight(4);

    ShapeColor.apply(markerColor, 255);
    p.circle(focusedNode.x, focusedNode.y, 120);

    p.strokeWeight(2);

    ShapeColor.apply(boundaryColor, 255);
    p.rectMode(p.CORNERS);
    p.rect(
      area.topLeft.x,
      area.topLeft.y,
      area.bottomRight.x,
      area.bottomRight.y
    );
  };

  const draw = () => {
    Camera.draw(camera, drawGraph);
  };

  const changeFocus = () => {
    const nextEdge = Random.Arrays.get(getIncidentEdges(focusedNode));
    const nextNode = GraphEdge.getOhterNode(nextEdge, focusedNode);

    focusedNode = nextNode;
    camera.targetFocusPoint = focusedNode;
    GraphEdge.mark(nextEdge);
  };

  return { reset, update, draw, changeFocus };
})();
