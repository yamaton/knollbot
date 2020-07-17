// Minimum spanning tree

namespace graph {
  export type Vertex = number | string;

  export interface Edge {
    pair: utils.Pair<Vertex>,
    weight: number,
    [propName: string]: any;
  };
  export interface Graph {
    vertices: Vertex[];
    edges: Edge[];
  }

  /** Kruskal for MST O(E log E)
   */
  export const kruskal = (g: Graph): Edge[] => {
    const uf = new unionfind.UnionFind(g.vertices);
    const sortedEdges = g.edges.sort((e1, e2) => e1.weight - e2.weight);
    let res: Edge[] = [];
    for (let e of sortedEdges) {
      let v1 = e.pair.first;
      let v2 = e.pair.second;
      if (!uf.areConnected(v1, v2)) {
        uf.connect(v1, v2);
        res.push(e);
      }
    }
    return res;
  }
}