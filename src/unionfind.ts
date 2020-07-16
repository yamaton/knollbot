namespace unionfind {
  type Node = string | number;
  type Index = number;

  const range = (size: number): number[] => {
    size = Math.floor(size);
    return [...Array(size).keys()]
  };

  export class UnionFind {
    len: number;
    parent: number[];
    translate: Map<Node,Index>;

    constructor(arg: number | Node[]) {
      if (typeof arg == 'number') {
        this.len = arg;
        this.translate = new Map(Array(arg).map((v, i) => [i, i]));
      } else {
        this.len = arg.length;
        this.translate =  new Map(arg.map((v, i) => [v, i]));
      }
      this.parent = range(this.len).map(_ => -1);
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
      let ix = this.translate.get(x);
      if (ix === undefined) {
        ix = this.len;
        this.translate.set(x, ix);
        this.len += 1;
      }
      return ix;
    }

    isConnected(x: Node, y: Node): boolean {
      let ix = this._index(x);
      let iy = this._index(y);
      return this._root(ix) == this._root(iy);
    }

    connect(x: Node, y: Node): boolean {
      let ix = this._index(x);
      let iy = this._index(y);
      if (this._depth(ix) < this._depth(iy)) {
        return this.connect(x, y);
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

    print() {
      console.log("parent: ", parent);
    };
  }
}