import Matter from "matter-js";
import { antiGravity, antiGravityRanged } from "./repulsion";
import * as utils from "./utils";
import { WorldExtended } from "./exttypes";
import UnionFind from "./unionfind";


export const applyAntiGravityVector = (world: WorldExtended, src: Matter.Body, tgt: Matter.Body) => {
  const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => {
    return antiGravityRanged(s, t, world.repulsionCoeff, world.repulsionRange);
  };

  // wall should not be involved
  if (!src.isStatic && !tgt.isStatic) {
    let forceAntiGravity = f(src, tgt);
    // antigravity exerts on the center of a block
    Matter.Body.applyForce(tgt, tgt.position, forceAntiGravity);
    Matter.Body.applyForce(src, src.position, utils.negate(forceAntiGravity));
  }
}


export const applyAntiGravityDisjoint = (world: WorldExtended, blocks: Matter.Body[], ufX: UnionFind, ufY: UnionFind) => {
  const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => {
    return antiGravityRanged(s, t, world.repulsionCoeff, world.repulsionRange);
  };

  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      let src = blocks[i];
      let tgt = blocks[j];
      if (!src.isStatic && !tgt.isStatic) {
        let force = f(src, tgt);
        if (ufX.areConnected(i, j)) {
          force.x = 0;
        }
        if (ufY.areConnected(i, j)) {
          force.y = 0;
        }
        Matter.Body.applyForce(tgt, tgt.position, force)
        Matter.Body.applyForce(src, src.position, utils.negate(force));
      }
    }
  }
}


export const applyGrouping = (world: WorldExtended, src: Matter.Body, tgt: Matter.Body) => {
  const f = (s: Matter.Body, t: Matter.Body): Matter.Vector => antiGravity(s, t, world.groupingCoeff);

  // wall should not be involved
  if (!src.isStatic && !tgt.isStatic) {
    let forceAntiGravity = f(src, tgt);

    // exert attractive force if blocks are of the same group
    if (utils.areSameWidth(src, tgt) || utils.areSameHeight(src, tgt)) {
      forceAntiGravity = utils.negate(forceAntiGravity);
    }
    // antigravity exerts on the center of a block
    Matter.Body.applyForce(tgt, tgt.position, forceAntiGravity);
    Matter.Body.applyForce(src, src.position, utils.negate(forceAntiGravity));
  }
}