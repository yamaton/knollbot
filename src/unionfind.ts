namespace UnionFind {
  type Node = string | number;
  type Index = number;


  export class UnionFind {
    len: number;
    parent: number[];
    translate: Map<Node, Index>;

    constructor(arg: number | Node[]) {
      if (typeof arg == 'number') {
        this.len = arg;
        this.translate = new Map(Utils.range(arg).map((_, i) => [i, i]));
      } else {
        this.len = arg.length;
        this.translate = new Map(arg.map((v, i) => [v, i]));
      }
      this.parent = Utils.range(this.len).map(_ => -1);
    }

    _isRoot(x: Index): boolean {
      return this.parent[x] < 0;
    }

    _root(x: Index): Index {
      while (!this._isRoot(x)) {
        x = this.parent[x];
      }
      return x;
    }

    _depth(x: Index): Index {
      return -this.parent[this._root(x)];
    }

    /**
     * Fetch index. Add to this._translate if absent.
     * @param x
     */
    _index(x: Node): Index {
      let tmp = this.translate.get(x);
      let ix: Index;
      if (tmp === undefined) {
        ix = this.len;
        this.translate.set(x, ix);
        this.len += 1;
      } else {
        ix = tmp;
      }
      return ix;
    }

    areConnected(x: Node, y: Node): boolean {
      let ix = this._index(x);
      let iy = this._index(y);
      return this._root(ix) == this._root(iy);
    }

    connect(x: Node, y: Node): boolean {
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

    getRootAll(): Index[] {
      return Utils.range(this.len).map(i => this._root(i));
    };
  }


  export class MultiSet<T> {
    counter: Map<T, number>;
    constructor(xs?: T[]) {
      this.counter = new Map<T, number>();
      if (xs) {
        xs.forEach(x => this.add(x));
      }
    }

    add(x: T) {
      this.counter.set(x, (this.counter.get(x) ?? 0) + 1)
    }

    get(x: T): number {
      return this.counter.get(x) ?? 0;
    }

    has(x: T): boolean {
      return this.counter.has(x);
    }

    clear() {
      this.counter.clear();
    }
  }
}