namespace unionfind {
  const range = (size: number): number[] => {
    size = Math.floor(size);
    return [...Array(size).keys()]
  };

  export class UnionFind {
    len: number;
    parent: number[];

    constructor(len: number) {
      this.len = len;
      this.parent = range(len).map(_ => -1);
    }

    _isRoot(x: number): boolean {
      return this.parent[x] < 0;
    }

    root(x: number): number {
      while (!this._isRoot(x)) {
        x = this.parent[x];
      }
      return x;
    }

    _depth(x: number): number {
      return -this.parent[this.root(x)];
    }

    isConnected(x: number, y: number): boolean {
      return this.root(x) == this.root(y);
    }

    connect(x: number, y: number): boolean {
      if (this._depth(x) < this._depth(y)) {
        return this.connect(y, x);
      }

      let rootX = this.root(x);
      let rootY = this.root(y);
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