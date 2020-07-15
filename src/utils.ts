namespace utils {
    export const arrMax = (xs: number[]): number => xs.reduce((acc, x) => Math.max(acc, x), -Infinity);
    export const arrMin = (xs: number[]): number => xs.reduce((acc, x) => Math.min(acc, x), Infinity);
    export const arrSum = (xs: number[]): number => xs.reduce((acc, x) => acc + x, 0);
    export const arrMean = (xs: number[]): number => arrSum(xs) / xs.length;

    interface Vector {
        x: number,
        y: number,
    }

    const arrMetaBy = <T>(xs: T[], f: (a: T) => number, reduce: (a: number[]) => number): T[] => {
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

    const closestPointDirMeta = (xs: Vector[], ref: number, f: (a: Vector) => number): Vector => {
        let minDist = Infinity;
        let res: Vector[] = [];
        for (let p of xs) {
            let d = Math.abs(f(p) - ref)
            if (d == minDist) {
                res.push(p);
            } else if (d < minDist) {
                minDist = d;
                res = [p];
            }
        }
        return vectorMean(res);
    }

    export const closestPointDirX = (xs: Vector[], ref: number): Vector => {
        return closestPointDirMeta(xs, ref, p => p.x);
    }

    export const closestPointDirY = (xs: Vector[], ref: number): Vector => {
        return closestPointDirMeta(xs, ref, p => p.y);
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

    const cloestPointMeta = (body1: Matter.Body, body2: Matter.Body, edgeA: (vs: Vector[]) => Vector, edgeB: (vs: Vector[]) => Vector, distFunc: (v1: Vector, v2: Vector) => number): [Vector, Vector, number] => {
        let one1 = edgeA(body1.vertices);
        let another1 = edgeB(body1.vertices);
        let one2 = edgeA(body2.vertices);
        let another2 = edgeB(body2.vertices);
        let res: [Vector, Vector, number] = [one1, another1, Infinity];
        let dist = Infinity;
        for (let p1 of [one1, another1]) {
            for (let p2 of [one2, another2]) {
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


    export const randRange = (lo: number, hi: number, unit: number=1): number => {
        let a = Math.floor(lo);
        let b = Math.floor(hi);
        return a + Math.floor(Math.random() * (b - a) / unit) * unit
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
}
