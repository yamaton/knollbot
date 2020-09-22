import chai from "chai";
import { bisect, bisectLeft } from "../src/binarySearch";

describe('Binary Search (bisect right)', () => {
  let assert = chai.assert;
  const xs = [1, 14, 32, 51, 51, 51, 243, 419, 750, 910];
  it('should be xs[3] as the first element >= 51', () => {
    assert.equal(bisect(xs, 51), 3);
  });
  it('should be xs[0] as the first element >= 1', () => {
    assert.equal(bisect(xs, 1), 0);
  });
  it('should be xs[9] as the first element >= 910', () => {
    assert.equal(bisect(xs, 910), 9);
  });
  it('should be xs[0] as the first element >= 0', () => {
    assert.equal(bisect(xs, 0), 0);
  });
  it('should be xs[6] as the first element >= 52', () => {
    assert.equal(bisect(xs, 52), 6);
  });
  it('should be no element >= 912 (out of bounds)', () => {
    assert.equal(bisect(xs, 912), 10);
  });
});


describe('Binary Search (bisect left)', () => {
  let assert = chai.assert;
  const xs = [1, 14, 32, 51, 51, 51, 243, 419, 750, 910];
  it('should be xs[6] as the first element > 51', () => {
    assert.equal(bisectLeft(xs, 51), 6);
  });
  it('should be xs[1] as the first element > 1', () => {
    assert.equal(bisectLeft(xs, 1), 1);
  });
  it('should be no element > 910 (out of bounds)', () => {
    assert.equal(bisectLeft(xs, 910), 10);
  });
  it('should be xs[1] as the first element > 0', () => {
    assert.equal(bisectLeft(xs, 0), 0);
  });
  it('should be xs[6] as the first element > 52', () => {
    assert.equal(bisectLeft(xs, 52), 6);
  });
  it('should be no element > 912 (out of bounds)', () => {
    assert.equal(bisectLeft(xs, 912), 10);
  });
});
