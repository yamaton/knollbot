/// <reference path="../src/unionfind.ts" />
let uf = new unionfind.UnionFind(10);
let assert = chai.assert;

describe('UnionFind', () => {

  it('should behave as expected' , () => {
    assert.strictEqual(uf.isConnected(3,4), false);
    
    uf.connect(3, 4);
    uf.connect(5, 6)
    uf.connect(4, 5);
    assert.strictEqual(uf.isConnected(3,4), true);
    assert.strictEqual(uf.isConnected(3,5), true);
    assert.strictEqual(uf.isConnected(3,6), true);
    assert.strictEqual(uf.isConnected(5,3), true);
    assert.strictEqual(uf.isConnected(3,7), false);
  });
});
