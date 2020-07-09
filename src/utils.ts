// import * as Matter from "matter-js";
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

    export const arrMinBy = <T>(xs: T[], f: (a: T) => number): T[] => {
        return arrMetaBy(xs, f, arrMin);
    }

    export const vectorMean = (vec: Vector[]): Vector => {
        let x = arrMean(vec.map(v => v.x));
        let y = arrMean(vec.map(v => v.y));
        return { x: x, y: y };
    }

    export const closestPointDirX = (points: Vector[], refPosX: number) => {
        let minDist = Infinity;
        let res: Vector[] = [];
        for (let p of points) {
            let d = Math.abs(p.x - refPosX)
            if (d == minDist) {
                res.push(p);
            } else if (d < minDist) {
                minDist = d;
                res = [p];
            }
        }
        return vectorMean(res);
    }

    export const rightmostPoint = (points: Vector[]): Vector => {
        return vectorMean(arrMaxBy({ xs: points, f: p => p.x }));
    }

    export const leftmostPoint = (points: Vector[]): Vector => {
        return vectorMean(arrMinBy(points, p => p.x));
    }

}