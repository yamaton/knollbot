import UnionFind from "../src/unionfind";
import * as utils from "../src/utils";


describe('UnionFind', () => {
  let assert = chai.assert;

  it('takes number of nodes, and check if two nodes are disjoint', () => {
    let uf = new UnionFind(10);
    assert.isFalse(uf.areConnected(3, 4));
    uf.connect(3, 4);
    uf.connect(5, 6)
    uf.connect(4, 5);
    assert.isTrue(uf.areConnected(3, 4));
    assert.isTrue(uf.areConnected(4, 3));
    assert.isTrue(uf.areConnected(3, 5));
    assert.isTrue(uf.areConnected(3, 6));
    assert.isTrue(uf.areConnected(5, 3));
    assert.isFalse(uf.areConnected(3, 7));
  });

  it('takes array of numbers as nodes, and check if two nodes are disjoint', () => {
    let uf = new UnionFind(utils.range(10));
    assert.isFalse(uf.areConnected(3, 4));
    uf.connect(3, 4);
    uf.connect(5, 6)
    uf.connect(4, 5);
    assert.isTrue(uf.areConnected(3, 4));
    assert.isTrue(uf.areConnected(4, 3));
    assert.isTrue(uf.areConnected(3, 5));
    assert.isTrue(uf.areConnected(3, 6));
    assert.isTrue(uf.areConnected(5, 3));
    assert.isFalse(uf.areConnected(3, 7));
  });


  it('takes array of strings as nodes, and check if two nodes are disjoint', () => {
    let nodes = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let uf = new UnionFind(nodes);
    assert.isFalse(uf.areConnected('d', 'f'));
    uf.connect('d', 'e');
    uf.connect('f', 'g')
    uf.connect('e', 'f');
    assert.isTrue(uf.areConnected('d', 'e'));
    assert.isTrue(uf.areConnected('e', 'd'));
    assert.isTrue(uf.areConnected('d', 'f'));
    assert.isTrue(uf.areConnected('d', 'g'));
    assert.isTrue(uf.areConnected('f', 'd'));
    assert.isFalse(uf.areConnected('d', 'j'));
  });

});
