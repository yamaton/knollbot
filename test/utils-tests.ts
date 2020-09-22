import chai from "chai";
import { argsort, undoSortBy } from "../src/utils";


describe('Argsort', () => {
  let assert = chai.assert;
  const xs = ['c', 'a', 'k', 'xx', 'bb', 'k'];
  it('holds that argsort returns elements ranging [0, xs.length)', () => {
    assert.deepEqual(argsort(xs).sort(), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that argsort(xs.sort()) == [0, 1, ..., xs.length - 1]', () => {
    assert.deepEqual(argsort(xs.sort()), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that argsort maps xs sorted', () => {
    const res = argsort(xs);
    const rearranged = Array<string>(xs.length);
    for (let i = 0; i < xs.length; i++) {
      const idx = res[i];
      rearranged[i] = xs[idx];
    }
    assert.deepEqual(rearranged, xs.sort());
  });
  it("holds that argsort(['c', 'a', 'b']) == [1, 2, 0]", () => {
    assert.deepEqual(argsort(['c', 'a', 'b']), [1, 2, 0]);
  });
  it('argsort returns empty if xs is emtpy', () => {
    const res = argsort([]);
    assert.deepEqual(res, []);
  });
  it('argsort returns [0] if xs has a single element', () => {
    const res = argsort(['x']);
    assert.deepEqual(res, [0]);
  });
});


describe('undoSortBy', () => {
  let assert = chai.assert;
  const xs = ['c', 'a', 'k', 'xx', 'bb', 'k'];
  it('undoSortBy(argsort(xs), xs) == [0, ..., xs.length - 1]', () => {
    assert.deepEqual(undoSortBy(argsort(xs), xs), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that undoSortBy(xs.sort(), xs) == xs', () => {
    assert.deepEqual(undoSortBy(xs.sort(), xs), xs);
  });
  it("holds that undoSortBy([0, 1, 2], ['c','a','b']) == [2, 0, 1]", () => {
    assert.deepEqual(undoSortBy([0, 1, 2], ['c','a','b']), [2, 0, 1]);
  });
  it('argsort returns empty if xs is emtpy', () => {
    const res = undoSortBy([], []);
    assert.deepEqual(res, []);
  });
  it('undoSortBy returns xs if xs has a single element', () => {
    const res = undoSortBy([-3], ['x']);
    assert.deepEqual(res, [-3]);
  });
});
