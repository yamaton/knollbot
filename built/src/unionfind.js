"use strict";
var UnionFind;
(function (UnionFind_1) {
    class UnionFind {
        constructor(arg) {
            if (typeof arg == 'number') {
                this.len = arg;
                this.translate = new Map(Utils.range(arg).map((_, i) => [i, i]));
            }
            else {
                this.len = arg.length;
                this.translate = new Map(arg.map((v, i) => [v, i]));
            }
            this.parent = Utils.range(this.len).map(_ => -1);
        }
        _isRoot(x) {
            return this.parent[x] < 0;
        }
        _root(x) {
            while (!this._isRoot(x)) {
                x = this.parent[x];
            }
            return x;
        }
        _depth(x) {
            return -this.parent[this._root(x)];
        }
        /**
         * Fetch index. Add to this._translate if absent.
         * @param x
         */
        _index(x) {
            let tmp = this.translate.get(x);
            let ix;
            if (tmp === undefined) {
                ix = this.len;
                this.translate.set(x, ix);
                this.len += 1;
            }
            else {
                ix = tmp;
            }
            return ix;
        }
        areConnected(x, y) {
            let ix = this._index(x);
            let iy = this._index(y);
            return this._root(ix) == this._root(iy);
        }
        connect(x, y) {
            let ix = this._index(x);
            let iy = this._index(y);
            if (this._depth(ix) < this._depth(iy)) {
                return this.connect(y, x);
            }
            let rootX = this._root(ix);
            let rootY = this._root(iy);
            if (rootX == rootY) {
                return false;
            }
            this.parent[rootX] += this.parent[rootY];
            this.parent[rootY] = rootX;
            return true;
        }
        getRootAll() {
            return Utils.range(this.len).map(i => this._root(i));
        }
        ;
    }
    UnionFind_1.UnionFind = UnionFind;
    class MultiSet {
        constructor(xs) {
            this.counter = new Map();
            if (xs) {
                xs.forEach(x => this.add(x));
            }
        }
        add(x) {
            var _a;
            this.counter.set(x, ((_a = this.counter.get(x)) !== null && _a !== void 0 ? _a : 0) + 1);
        }
        get(x) {
            var _a;
            return (_a = this.counter.get(x)) !== null && _a !== void 0 ? _a : 0;
        }
        has(x) {
            return this.counter.has(x);
        }
        clear() {
            this.counter.clear();
        }
    }
    UnionFind_1.MultiSet = MultiSet;
})(UnionFind || (UnionFind = {}));
