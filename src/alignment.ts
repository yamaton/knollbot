import Matter from "matter-js";
import * as utils from "./utils";
import { kruskal } from "./graph";
import UnionFind from "./unionfind";
import { WorldExtended, EdgeExtended, GraphExtended, IPointPairFunc } from "./exttypes";
import * as grouping from "./grouping";


const createAlignmentGraphMeta = (world: WorldExtended, blocks: Matter.Body[], pointPairFunc: IPointPairFunc): GraphExtended => {
  let edges: EdgeExtended[] = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const src = blocks[i];
      const tgt = blocks[j];
      const [posSrc, posTgt, dist] = pointPairFunc(src, tgt);
      if (dist < world.alignmentForceRange && (!src.isStatic || !tgt.isStatic)) {
        const e = {
          weight: dist,
          pair: utils.makeUnorderedPair(i, j),
          posSrc: posSrc,
          posTgt: posTgt,
          idxSrc: i,
          idxTgt: j,
        }
        edges.push(e);
      }
    }
  }
  let g: GraphExtended = {
    vertices: utils.range(blocks.length),
    edges: edges,
  }
  return g;
}


const createAlignmentGraphX = (world: WorldExtended, blocks: Matter.Body[]): GraphExtended => {
  return createAlignmentGraphMeta(world, blocks, utils.cloestPointPairX);
}


const createAlignmentGraphY = (world: WorldExtended, blocks: Matter.Body[]): GraphExtended => {
  return createAlignmentGraphMeta(world, blocks, utils.cloestPointPairY);
}


const applyAlignmentForceX = (world: WorldExtended, blocks: Matter.Body[], edge: EdgeExtended) => {
  const sign = (edge.posSrc.x < edge.posTgt.x) ? -1 : 1;
  const dist = edge.weight;
  const force = world.alignmentForceCoeff * sign * dist;
  const forceOnTgt = { x: force, y: 0 };
  const src = blocks[edge.idxSrc];
  const tgt = blocks[edge.idxTgt];
  Matter.Body.applyForce(tgt, tgt.position, forceOnTgt);
  Matter.Body.applyForce(src, src.position, utils.negate(forceOnTgt));
}


const applyAlignmentForceY = (world: WorldExtended, blocks: Matter.Body[], edge: EdgeExtended) => {
  const sign = (edge.posSrc.y < edge.posTgt.y) ? -1 : 1;
  const dist = edge.weight;
  const force = world.alignmentForceCoeff * sign * dist;
  const forceOnTgt = { x: 0, y: force };
  const src = blocks[edge.idxSrc];
  const tgt = blocks[edge.idxTgt];
  Matter.Body.applyForce(tgt, tgt.position, forceOnTgt);
  Matter.Body.applyForce(src, src.position, utils.negate(forceOnTgt));
}


export const applyAlignment = (world: WorldExtended, blocks: Matter.Body[]) => {
  let gX = createAlignmentGraphX(world, blocks);
  let gY = createAlignmentGraphY(world, blocks);
  let edgeMstX = kruskal(gX) as EdgeExtended[];
  let edgeMstY = kruskal(gY) as EdgeExtended[];

  // alignment force occurs at MST edges only
  edgeMstX.forEach(e => applyAlignmentForceX(world, blocks, e));
  edgeMstY.forEach(e => applyAlignmentForceY(world, blocks, e));

  // antigravity force occurs at disconnected nodes
  let ufX = new UnionFind(gX.vertices);
  gX.edges.forEach(e => { ufX.connect(e.idxSrc, e.idxTgt) });
  let ufY = new UnionFind(gY.vertices);
  gY.edges.forEach(e => { ufY.connect(e.idxSrc, e.idxTgt) });
  grouping.applyAntiGravityDisjoint(world, blocks, ufX, ufY);
}
