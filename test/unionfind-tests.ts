/// <reference path="../src/unionfind.ts" />

describe('UnionFind', () => {
  let assert = chai.assert;

  it('takes number of nodes, and check if two nodes are disjoint', () => {
    let uf = new unionfind.UnionFind(10);
    assert.isFalse(uf.isConnected(3, 4));
    uf.connect(3, 4);
    uf.connect(5, 6)
    uf.connect(4, 5);
    assert.isTrue(uf.isConnected(3, 4));
    assert.isTrue(uf.isConnected(4, 3));
    assert.isTrue(uf.isConnected(3, 5));
    assert.isTrue(uf.isConnected(3, 6));
    assert.isTrue(uf.isConnected(5, 3));
    assert.isFalse(uf.isConnected(3, 7));
  });

  it('takes array of numbers as nodes, and check if two nodes are disjoint', () => {
    let uf = new unionfind.UnionFind(utils.range(10));
    assert.isFalse(uf.isConnected(3, 4));
    uf.connect(3, 4);
    uf.connect(5, 6)
    uf.connect(4, 5);
    assert.isTrue(uf.isConnected(3, 4));
    assert.isTrue(uf.isConnected(4, 3));
    assert.isTrue(uf.isConnected(3, 5));
    assert.isTrue(uf.isConnected(3, 6));
    assert.isTrue(uf.isConnected(5, 3));
    assert.isFalse(uf.isConnected(3, 7));
  });


  it('takes array of strings as nodes, and check if two nodes are disjoint', () => {
    let nodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let uf = new unionfind.UnionFind(nodes);
    assert.isFalse(uf.isConnected('d', 'f'));
    uf.connect('d', 'e');
    uf.connect('f', 'g')
    uf.connect('e', 'f');
    assert.isTrue(uf.isConnected('d', 'e'));
    assert.isTrue(uf.isConnected('e', 'd'));
    assert.isTrue(uf.isConnected('d', 'f'));
    assert.isTrue(uf.isConnected('d', 'g'));
    assert.isTrue(uf.isConnected('f', 'd'));
    assert.isFalse(uf.isConnected('d', 'j'));
  });

});
