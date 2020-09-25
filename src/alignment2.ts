import Matter from "matter-js";
import { bisect, bisectLeft } from "./binarySearch";
import { mean, undoSortBy, min, max, unique, tally } from "./utils";
import { WorldExtended } from "./exttypes";

export const fixedRadius1dClustering = (xs: number[], r: number): number[] => {

  let ys: number[] = xs.slice();
  ys = ys.sort((a, b) => a - b);
  const zs = Array<number>(xs.length);

  while (true) {
    let chunkSize = 1;
    let range = Array<number>(2);

    // range is set to left-inclusive, right-exclusive
    for (let i = 0; i < ys.length; i++) {
      if (zs[i] !== undefined) continue;

      let left = bisect(ys, ys[i] - r);
      while (zs[left] !== undefined) left++;
      if (i - left + 1 > chunkSize) {
        chunkSize = i - left + 1;
        range = [left, i + 1];
      } else if (chunkSize > 1 && i - left + 1 == chunkSize) {
        let [a, b] = range;
        if (ys[i] - ys[left] < ys[b - 1] - ys[a])
          range = [left, i + 1];
      }
      // console.log(`  <---| range = ${range}`);

      let right = bisectLeft(ys, ys[i] + r);
      while (zs[right] !== undefined) right--;
      if (right - i > chunkSize) {
        chunkSize = right - i;
        range = [i, right];
      } else if (chunkSize > 1 && right - i == chunkSize) {
        let [a, b] = range;
        if (ys[right - 1] - ys[i] < ys[b - 1] - ys[a])
          range = [i, right];
      }

      // console.log(`  |---> range = ${range}`);
    }

    if (chunkSize > 1) {
      let centroid = mean(ys.slice(range[0], range[1]));
      for (let i = range[0]; i < range[1]; i++) {
        zs[i] = centroid;
      }
    } else {
      // not seeing any update
      break;
    }

  }

  const res = undoSortBy(zs, xs);
  return res;
}

const getEdgesMeta = (boxes: Matter.Body[], f: ((v: Matter.Vector) => number)): number[] => {
  const res = Array<number>(2 * boxes.length);
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const arr = box.vertices.map(f);
    res[2 * i] = min(arr);
    res[2 * i + 1] = max(arr);
  }
  return res;
}

const getEdgesX = (boxes: Matter.Body[]): number[] => {
  return getEdgesMeta(boxes, (p) => p.x);
}

const getEdgesY = (boxes: Matter.Body[]): number[] => {
  return getEdgesMeta(boxes, (p) => p.y);
}


const getAttractorsMeta = (boxes: Matter.Body[], radius: number, getEdges: ((blocks: Matter.Body[]) => number[])) => {
  let xs: number[];
  xs = getEdges(boxes);
  xs = fixedRadius1dClustering(xs, radius);
  xs = xs.filter(x => (x !== undefined)).map(Math.round).sort((a, b) => a - b);
  xs = unique(xs);
  return xs;
}

export const getAttractorXs = (boxes: Matter.Body[], radius: number): number[] => {
  return getAttractorsMeta(boxes, radius, getEdgesX);
}

export const getAttractorYs = (boxes: Matter.Body[], radius: number): number[] => {
  return getAttractorsMeta(boxes, radius, getEdgesY);
}


const applyBoxesAlignmentX = (world: WorldExtended, boxes: Matter.Body[]) => {
  const edges = getEdgesX(boxes);
  const attractors = fixedRadius1dClustering(edges, world.alignmentForceRange);
  const attrScore = tally(attractors);

  for (let i = 0; i < boxes.length; i++) {
    if (attrScore[2 * i] == 0 && attrScore[2 * i + 1] == 0) continue;
    const box = boxes[i];
    if (box.isStatic) continue;
    let idx = 2 * i;
    if (attrScore[2 * i] < attrScore[2 * i + 1]) {
      idx = 2 * i + 1;
    }
    const srcX = attractors[idx];
    const tgt = box.vertices.filter(v => v.x == edges[idx])[0];
    const sign = (tgt.x > srcX) ? -1 : 1;
    const dist = Math.abs(tgt.x - srcX);
    const forceX = sign * attrScore[idx] / 2 * (world.alignmentForceCoeff * dist + world.alignmentForceOffset);
    Matter.Body.applyForce(box, tgt, { x: forceX, y: 0 });
  }
}


const applyBoxesAlignmentY = (world: WorldExtended, boxes: Matter.Body[]) => {
  const edges = getEdgesY(boxes);
  const attractors = fixedRadius1dClustering(edges, world.alignmentForceRange);
  const attrScore = tally(attractors);

  for (let i = 0; i < boxes.length; i++) {
    if (attrScore[2 * i] == 0 && attrScore[2 * i + 1] == 0) continue;
    const box = boxes[i];
    if (box.isStatic) continue;
    let idx = 2 * i;
    if (attrScore[2 * i] < attrScore[2 * i + 1]) {
      idx = 2 * i + 1;
    }
    const srcY = attractors[idx];
    const tgt = box.vertices.filter(v => v.y == edges[idx])[0];
    const sign = (tgt.y > srcY) ? -1 : 1;
    const dist = Math.abs(tgt.y - srcY);
    const forceY = sign * attrScore[idx] / 2 * (world.alignmentForceCoeff * dist + world.alignmentForceOffset);
    Matter.Body.applyForce(box, tgt, { x: 0, y: forceY });
  }
}


export const applyAlignment = (world: WorldExtended, blocks: Matter.Body[]) => {
  // const boxes = blocks.slice(0, blocks.length - 4);
  applyBoxesAlignmentX(world, blocks);
  applyBoxesAlignmentY(world, blocks);
}
