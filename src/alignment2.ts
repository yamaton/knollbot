import Matter from "matter-js";
import { bisect, bisectLeft } from "./binarySearch";
import { mean, undoSortBy, min, max, unique} from "./utils";

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

const getPointsMeta = (boxes: Matter.Body[], f: ((v: Matter.Vector) => number)): number[] => {
  const res = Array<number>(2 * boxes.length);
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    const arr = box.vertices.map(f);
    res[2 * i] = min(arr);
    res[2 * i + 1] = max(arr);
  }
  return res;
}

const getPointsX = (boxes: Matter.Body[]): number[] => {
  return getPointsMeta(boxes, (p) => p.x);
}

const getPointsY = (boxes: Matter.Body[]): number[] => {
  return getPointsMeta(boxes, (p) => p.y);
}


const getAttractorsMeta = (boxes: Matter.Body[], radius: number, f: ((blocks: Matter.Body[]) => number[])) => {
  let xs: number[];
  xs = f(boxes).sort((a, b) => a - b);
  xs = fixedRadius1dClustering(xs, radius).filter(x => (x !== undefined));
  xs = unique(xs.map(Math.round));
  return xs;
}

export const getAttractorXs = (boxes: Matter.Body[], radius: number): number[] => {
  return getAttractorsMeta(boxes, radius, getPointsX);
}

export const getAttractorYs = (boxes: Matter.Body[], radius: number): number[] => {
  return getAttractorsMeta(boxes, radius, getPointsY);
}
