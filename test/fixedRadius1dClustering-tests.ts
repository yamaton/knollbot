import chai from "chai";
import { fixedRadius1dClustering } from "../src/alignment2";
let assert = chai.assert;


describe('fixedRadius1dClustering', () => {
  it('Hierarchical clustering with fixed radius = 1', () => {
    const xs = [0, 2, 4, 5, 6, 10];
    assert.deepEqual(fixedRadius1dClustering(xs, 1), [undefined, undefined, 4.5, 4.5, undefined, undefined]);
  });

  it('Hierarchical clustering with fixed radius = 1', () => {
    const xs = [4, 0, 2, 6, 10, 5];
    assert.deepEqual(fixedRadius1dClustering(xs, 1), [4.5, undefined, undefined, undefined, undefined, 4.5]);
  });

  it('Hierarchical clustering with fixed radius = 2', () => {
    const xs = [0, 2, 4, 5, 6, 10];
    assert.deepEqual(fixedRadius1dClustering(xs, 2), [1, 1, 5, 5, 5, undefined]);
  });

  it('Hierarchical clustering with fixed radius = 2', () => {
    const xs = [6, 4, 10, 2, 5, 0];
    assert.deepEqual(fixedRadius1dClustering(xs, 2), [5, 5, undefined, 1, 5, 1]);
  });
});