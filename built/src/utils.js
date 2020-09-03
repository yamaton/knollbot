"use strict";
var Utils;
(function (Utils) {
    Utils.arrMax = (xs) => xs.reduce((acc, x) => Math.max(acc, x), -Infinity);
    Utils.arrMin = (xs) => xs.reduce((acc, x) => Math.min(acc, x), Infinity);
    Utils.arrSum = (xs) => xs.reduce((acc, x) => acc + x, 0);
    Utils.arrMean = (xs) => Utils.arrSum(xs) / xs.length;
    const arrMetaBy = (xs, f, reduce) => {
        let ys = xs.map(f);
        let ymax = reduce(ys);
        let res = Array();
        for (let i in xs) {
            if (ys[i] == ymax) {
                res.push(xs[i]);
            }
        }
        return res;
    };
    Utils.arrMaxBy = ({ xs, f }) => {
        return arrMetaBy(xs, f, Utils.arrMax);
    };
    Utils.arrMinBy = ({ xs, f }) => {
        return arrMetaBy(xs, f, Utils.arrMin);
    };
    Utils.vectorMean = (vec) => {
        let x = Utils.arrMean(vec.map(v => v.x));
        let y = Utils.arrMean(vec.map(v => v.y));
        return { x: x, y: y };
    };
    const closestPointDirMeta = (xs, ref, f) => {
        let minDist = Infinity;
        let res = [];
        for (let p of xs) {
            let d = Math.abs(f(p) - ref);
            if (d == minDist) {
                res.push(p);
            }
            else if (d < minDist) {
                minDist = d;
                res = [p];
            }
        }
        return Utils.vectorMean(res);
    };
    Utils.closestPointDirX = (xs, ref) => {
        return closestPointDirMeta(xs, ref, p => p.x);
    };
    Utils.closestPointDirY = (xs, ref) => {
        return closestPointDirMeta(xs, ref, p => p.y);
    };
    Utils.rightmostPoint = (points) => {
        return Utils.vectorMean(Utils.arrMaxBy({ xs: points, f: p => p.x }));
    };
    Utils.leftmostPoint = (points) => {
        return Utils.vectorMean(Utils.arrMinBy({ xs: points, f: p => p.x }));
    };
    Utils.topmostPoint = (points) => {
        return Utils.vectorMean(Utils.arrMinBy({ xs: points, f: p => p.y }));
    };
    Utils.bottommostPoint = (points) => {
        return Utils.vectorMean(Utils.arrMaxBy({ xs: points, f: p => p.y }));
    };
    Utils.distHoriz = (pointA, pointB) => {
        return Math.abs(pointA.x - pointB.x);
    };
    Utils.distVerti = (pointA, pointB) => {
        return Math.abs(pointA.y - pointB.y);
    };
    Utils.distEuclid = (pointA, pointB) => {
        return Math.hypot(pointA.x - pointB.x, pointA.y - pointB.y);
    };
    const cloestPointMeta = (body1, body2, edgeA, edgeB, distFunc) => {
        let one1 = edgeA(body1.vertices);
        let another1 = edgeB(body1.vertices);
        let one2 = edgeA(body2.vertices);
        let another2 = edgeB(body2.vertices);
        let res = [one1, another1, Infinity];
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
    };
    Utils.cloestPointPairX = (body1, body2) => {
        return cloestPointMeta(body1, body2, Utils.leftmostPoint, Utils.rightmostPoint, Utils.distHoriz);
    };
    Utils.cloestPointPairY = (body1, body2) => {
        return cloestPointMeta(body1, body2, Utils.topmostPoint, Utils.bottommostPoint, Utils.distVerti);
    };
    Utils.range = (size) => {
        size = Math.floor(size);
        return [...Array(size).keys()];
    };
    Utils.randRange = (lo, hi, unit = 1) => {
        let a = Math.floor(lo);
        let b = Math.floor(hi);
        return a + Math.floor(Math.random() * (b - a) / unit) * unit;
    };
    // https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    Utils.randn = () => {
        let u = 0;
        let v = 0;
        while (u === 0)
            u = Math.random(); //Converting [0,1) to (0,1)
        while (v === 0)
            v = Math.random();
        let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        num = num / 10.0 + 0.5; // Translate to 0 -> 1
        if (num > 1 || num < 0)
            return Utils.randn(); // resample between 0 and 1
        return num - 0.5;
    };
    Utils.unitVec = (from, to) => {
        let d = Utils.distEuclid(from, to);
        return {
            x: (to.x - from.x) / d,
            y: (to.y - from.y) / d,
        };
    };
    Utils.normalize = (v) => {
        let norm = Math.hypot(v.x, v.y);
        return {
            x: v.x / norm,
            y: v.y / norm,
        };
    };
    Utils.negate = (v) => {
        return { x: -v.x, y: -v.y };
    };
    Utils.makeUnorderedPair = (a, b) => {
        if (b < a) {
            [a, b] = [b, a];
        }
        return { first: a, second: b };
    };
    Utils.getWidth = (block) => {
        let xs = block.vertices.map(v => v.x);
        return Utils.arrMax(xs) - Utils.arrMin(xs);
    };
    Utils.getHeight = (block) => {
        let ys = block.vertices.map(v => v.y);
        return Utils.arrMax(ys) - Utils.arrMin(ys);
    };
    Utils.areSameHeight = (foo, bar) => {
        return Utils.getHeight(foo) == Utils.getHeight(bar);
    };
    Utils.areSameWidth = (foo, bar) => {
        return Utils.getWidth(foo) == Utils.getWidth(bar);
    };
})(Utils || (Utils = {}));
