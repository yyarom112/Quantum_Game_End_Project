class Node {
  constructor(id) {
    this.id = id;
    this.edges = [];
  }
}

class Edge {
  constructor(node1, node2, key) {
    this.start = node1;
    this.end = node2;
    this.key = key;
  }
}

class Graph {
  constructor() {
    this.nodes = {};
    this.edges = {};
  }

  addNode(id) {
    this.nodes[id] = new Node(id);
  }

  getNode(id) {
    return this.nodes[id];
  }

  hasNode(id) {
    return id in this.nodes;
  }

  addEdge(id1, id2, key) {
    if (!(id1 in this.nodes)) {
      this.addNode(id1);
    }

    if (!(id2 in this.nodes)) {
      this.addNode(id2);
    }

    let edge = new Edge(this.getNode(id1), this.getNode(id2), key);
    let reverseEdge = new Edge(this.getNode(id2), this.getNode(id1), key);

    this.getNode(id1).edges.push(edge);
    this.getNode(id2).edges.push(reverseEdge);
    this.edges[key] = edge;
  }

  numNodes() {
    return Object.keys(this.nodes).length;
  }

  /**
    @param {Object} startId - id of one of the nodes involved in the cycle
    @return {Boolean}
  */
  isCyclic(startId) {
    // TODO: optimize
    return Boolean(this.getCycle(startId));
  }

  /**
    @param {Object} startId - id of one of the nodes involved in the cycle
    @return {List} List of Nodes and Edges involved in cycle
  */
  getCycle(startId) {
    // case one: graph too small for cycles
    if (this.numNodes() < 2) {
      return null;
    }

    // case two: cycle of len 2
    const start = this.getNode(startId);
    let visited = new Set();
    let endToEdge = new Map();

    for (let edge of start.edges) {
      if (visited.has(edge.end)) {
        return [
          [edge.start.id, edge.end.id],
          [edge.key, endToEdge.get(edge.end).key]
        ];
      }

      visited.add(edge.end);
      endToEdge.set(edge.end, edge);
    }

    // case three: cycle of len > 2
    let q = [start];
    let layers = new Map(); // maps node to layer
    let prev = new Map(); // maps node to its associated edge
    layers.set(start, 0);
    prev.set(start, null);

    while (q !== undefined && q.length > 0) {
      let curr = q.shift();
      let layer = layers.get(curr);

      for (let edge of curr.edges) {
        if (layers.has(edge.end)) {
          if (layers.get(edge.end) === layer - 1) {
            // node we just came from
            continue;
          } else {
            return this._constructPath(edge, prev);
          }
        }

        q.push(edge.end);
        layers.set(edge.end, layer + 1);
        prev.set(edge.end, edge);
      }
    }
  }

  _constructPath(edge, prev) {
    let cycleNodeIds = [];
    let cycleEdgeKeys = [edge.key];
    let currNode, currEdge;

    // go around one way
    currNode = edge.start;
    while (prev.get(currNode)) {
      currEdge = prev.get(currNode);
      cycleNodeIds.push(currNode.id);
      cycleEdgeKeys.push(currEdge.key);
      currNode = currEdge.start;
    }
    cycleNodeIds.push(currNode.id); /// get start node only once

    // go around the other way
    currNode = edge.end;
    while (prev.get(currNode)) {
      currEdge = prev.get(currNode);
      cycleNodeIds.unshift(currNode.id);
      cycleEdgeKeys.unshift(currEdge.key);
      currNode = currEdge.start;
    }

    return [cycleNodeIds, cycleEdgeKeys];
  }
}

module.exports = Graph;
