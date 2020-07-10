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

    export const distHoriz = (pointA: Vector, pointB: Vector): number => {
        return Math.abs(pointA.x - pointB.x);
    }

    export const cloestPointPairX = (body1: Matter.Body, body2:Matter.Body): [Vector, Vector, number] => {
        let left1 = leftmostPoint(body1.vertices);
        let right1 = rightmostPoint(body1.vertices);
        let left2 = leftmostPoint(body2.vertices);
        let right2 = rightmostPoint(body2.vertices);
        let res: [Vector, Vector, number] = [left1, right1, Infinity];
        let dist = Infinity;
        for (let p1 of [left1, right1]) {
            for (let p2 of [left2, right2]) {
                let d = distHoriz(p1, p2);
                if (d < dist) {
                    dist = d;
                    res = [p1, p2, dist];
                }
            }
        }
        return res;
    }
}

