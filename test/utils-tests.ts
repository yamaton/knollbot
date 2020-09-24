import chai from "chai";
import { argsort, undoSortBy } from "../src/utils";


describe('Argsort', () => {
  let assert = chai.assert;
  it('holds that argsort returns elements ranging [0, xs.length)', () => {
    const xs = [100, 22, -3, -100, 88, 9];
    assert.deepEqual(argsort(xs.sort((a, b) => a - b)), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that argsort(xs.sort()) == [0, 1, ..., xs.length - 1]', () => {
    const xs = [100, 22, -3, -100, 88, 9];
    assert.deepEqual(argsort(xs.sort((a, b) => a - b)), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that argsort maps xs sorted', () => {
    const xs = [100, 22, -3, -100, 88, 9];
    const res = argsort(xs);
    const rearranged = Array<number>(xs.length);
    for (let i = 0; i < xs.length; i++) {
      const idx = res[i];
      rearranged[i] = xs[idx];
    }
    assert.deepEqual(rearranged, xs.sort((a, b) => a - b));
  });
  it("holds that argsort([100, 9, 33]) == [1, 2, 0]", () => {
    assert.deepEqual(argsort([100, 9, 33]), [1, 2, 0]);
  });
  it('argsort returns empty if xs is emtpy', () => {
    const res = argsort([]);
    assert.deepEqual(res, []);
  });
  it('argsort returns [0] if xs has a single element', () => {
    const res = argsort([-3]);
    assert.deepEqual(res, [0]);
  });
});


describe('undoSortBy', () => {
  let assert = chai.assert;
  it('undoSortBy(argsort(xs), xs) == [0, ..., xs.length - 1]', () => {
    const xs = [100, 22, -3, -100, 88, 9];
    assert.deepEqual(undoSortBy(argsort(xs), xs), [0, 1, 2, 3, 4, 5]);
  });
  it('holds that undoSortBy(xs.sort(), xs) == xs', () => {
    const xs = [100, 22, -3, -100, 88, 9];
    let ys = xs.slice();
    ys.sort((a, b) => a - b)
    assert.deepEqual(undoSortBy(ys, xs), xs);
  });
  it("holds that undoSortBy([0, 1, 2], [100, 9, 33]) == [2, 0, 1]", () => {
    assert.deepEqual(undoSortBy([0, 1, 2], [100, 9, 33]), [2, 0, 1]);
  });
  it('argsort returns empty if xs is emtpy', () => {
    const res = undoSortBy([], []);
    assert.deepEqual(res, []);
  });
  it('undoSortBy returns xs if xs has a single element', () => {
    const res = undoSortBy([-3], [-42]);
    assert.deepEqual(res, [-3]);
  });
});
