import p5 from "p5";

export type Pair<T> = {
  first: T,
  second: T,
}

export interface Vector {
  x: number,
  y: number,
}

export const arrMax = (xs: number[]): number => xs.reduce((acc, x) => Math.max(acc, x), -Infinity);
export const arrMin = (xs: number[]): number => xs.reduce((acc, x) => Math.min(acc, x), Infinity);
export const arrSum = (xs: number[]): number => xs.reduce((acc, x) => acc + x, 0);
export const arrMean = (xs: number[]): number => arrSum(xs) / xs.length;

export const arrMetaBy = <T>(xs: T[], f: (a: T) => number, reduce: (a: number[]) => number): T[] => {
  let ys = xs.map(f)
  let ymax = reduce(ys);
  let res = Array<T>();
  for (let i in xs) {
    if (ys[i] == ymax) {
      res.push(xs[i]);
    }
  }
  return res;
};

export const arrMaxBy = <T>({ xs, f }: { xs: T[]; f: (a: T) => number; }): T[] => {
  return arrMetaBy(xs, f, arrMax);
}

export const arrMinBy = <T>({ xs, f }: { xs: T[]; f: (a: T) => number; }): T[] => {
  return arrMetaBy(xs, f, arrMin);
}

export const vectorMean = (vec: Vector[]): Vector => {
  let x = arrMean(vec.map(v => v.x));
  let y = arrMean(vec.map(v => v.y));
  return { x: x, y: y };
}

export const rightmostPoint = (points: Vector[]): Vector => {
  return vectorMean(arrMaxBy({ xs: points, f: p => p.x }));
}

export const leftmostPoint = (points: Vector[]): Vector => {
  return vectorMean(arrMinBy({ xs: points, f: p => p.x }));
}

export const topmostPoint = (points: Vector[]): Vector => {
  return vectorMean(arrMinBy({ xs: points, f: p => p.y }));
}

export const bottommostPoint = (points: Vector[]): Vector => {
  return vectorMean(arrMaxBy({ xs: points, f: p => p.y }));
}

export const distHoriz = (pointA: Vector, pointB: Vector): number => {
  return Math.abs(pointA.x - pointB.x);
}

export const distVerti = (pointA: Vector, pointB: Vector): number => {
  return Math.abs(pointA.y - pointB.y);
}

export const distEuclid = (pointA: Vector, pointB: Vector): number => {
  return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
}

const cloestPointMeta = (this_: Matter.Body, that: Matter.Body, edgeA: (vs: Vector[]) => Vector, edgeB: (vs: Vector[]) => Vector, distFunc: (v1: Vector, v2: Vector) => number): [Vector, Vector, number] => {
  let thisA = edgeA(this_.vertices);
  let thisB = edgeB(this_.vertices);
  let thatA = edgeA(that.vertices);
  let thatB = edgeB(that.vertices);
  let res: [Vector, Vector, number] = [thisA, thatA, Infinity];
  let dist = Infinity;
  for (let p1 of [thisA, thisB]) {
    for (let p2 of [thatA, thatB]) {
      let d = distFunc(p1, p2);
      if (d < dist) {
        dist = d;
        res = [p1, p2, dist];
      }
    }
  }
  return res;
}

export const cloestPointPairX = (body1: Matter.Body, body2: Matter.Body): [Vector, Vector, number] => {
  return cloestPointMeta(body1, body2, leftmostPoint, rightmostPoint, distHoriz);
}

export const cloestPointPairY = (body1: Matter.Body, body2: Matter.Body): [Vector, Vector, number] => {
  return cloestPointMeta(body1, body2, topmostPoint, bottommostPoint, distVerti);
}

export const range = (size: number): number[] => {
  size = Math.floor(size);
  return Array.from(Array(size).keys());
};

export const randRange = (lo: number, hi: number, unit: number = 1): number => {
  let a = Math.floor(lo);
  let b = Math.floor(hi);
  return a + Math.floor(Math.random() * (b - a) / unit) * unit
}

// https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
export const randn = (): number => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random();
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) return randn(); // resample between 0 and 1
  return num - 0.5;
}

export const unitVec = (from: Vector, to: Vector): Vector => {
  let d = distEuclid(from, to)
  return {
    x: (to.x - from.x) / d,
    y: (to.y - from.y) / d,
  }
}

export const normalize = (v: Vector): Vector => {
  let norm = Math.hypot(v.x, v.y);
  return {
    x: v.x / norm,
    y: v.y / norm,
  }
}

export const negate = (v: Vector): Vector => {
  return { x: -v.x, y: -v.y };
}

export const makeUnorderedPair = <T>(a: T, b: T): Pair<T> => {
  if (b < a) {
    [a, b] = [b, a];
  }
  return { first: a, second: b };
}

export const getWidth = (block: Matter.Body): number => {
  let xs = block.vertices.map(v => v.x);
  return arrMax(xs) - arrMin(xs);
}

export const getHeight = (block: Matter.Body): number => {
  let ys = block.vertices.map(v => v.y);
  return arrMax(ys) - arrMin(ys);
}

export const areSameHeight = (foo: Matter.Body, bar: Matter.Body): boolean => {
  return getHeight(foo) == getHeight(bar);
}

export const areSameWidth = (foo: Matter.Body, bar: Matter.Body): boolean => {
  return getWidth(foo) == getWidth(bar);
}


// credit: https://github.com/processing/p5.js/issues/3767#issuecomment-502873792
// Rotate image by 90 degrees clockwise
export const rotateClockwise = (p: p5, src: p5.Image): p5.Image => {

  const w = src.width;
  const h = src.height;
  const tgt = p.createImage(h, w); // flip w and h

  src.loadPixels();
  tgt.loadPixels();

  let indexr = 0;
  for (let x = 0; x < w; x++) {
    for (let y = h - 1; y >= 0; y--) {
      let index = (x + y * w) * 4;
      for (let i = 0; i < 4; i++) {
        tgt.pixels[indexr + i] = src.pixels[index + i];
      }
      indexr += 4;
    }
  }

  src.updatePixels();
  tgt.updatePixels();

  return tgt;
}
