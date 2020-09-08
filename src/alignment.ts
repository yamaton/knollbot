import Matter from "matter-js";
import * as utils from "./utils";
import { WorldExtended, EdgeExtended, GraphExtended, IPointPairFunc } from "./exttypes";



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

export const createAlignmentGraphX = (world: WorldExtended, blocks: Matter.Body[]): GraphExtended => {
  return createAlignmentGraphMeta(world, blocks, utils.cloestPointPairX);
}
export const createAlignmentGraphY = (world: WorldExtended, blocks: Matter.Body[]): GraphExtended => {
  return createAlignmentGraphMeta(world, blocks, utils.cloestPointPairY);
}

export const applyAlignmentForceX = (world: WorldExtended, blocks: Matter.Body[], edge: EdgeExtended) => {
  const sign = (edge.posSrc.x < edge.posTgt.x) ? -1 : 1;
  const dist = edge.weight;
  const force = world.alignmentForceCoeff * sign * dist;
  const forceOnTgt = { x: force, y: 0 };
  const src = blocks[edge.idxSrc];
  const tgt = blocks[edge.idxTgt];
  Matter.Body.applyForce(tgt, tgt.position, forceOnTgt);
  Matter.Body.applyForce(src, src.position, utils.negate(forceOnTgt));
}

export const applyAlignmentForceY = (world: WorldExtended, blocks: Matter.Body[], edge: EdgeExtended) => {
  const sign = (edge.posSrc.y < edge.posTgt.y) ? -1 : 1;
  const dist = edge.weight;
  const force = world.alignmentForceCoeff * sign * dist;
  const forceOnTgt = { x: 0, y: force };
  const src = blocks[edge.idxSrc];
  const tgt = blocks[edge.idxTgt];
  Matter.Body.applyForce(tgt, tgt.position, forceOnTgt);
  Matter.Body.applyForce(src, src.position, utils.negate(forceOnTgt));
}