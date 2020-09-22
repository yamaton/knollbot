import chai from "chai";
import { binarySearch } from "../src/binarySearch";

describe('Bisect tests', () => {
  let assert = chai.assert;
  const xs = [1, 14, 32, 51, 51, 51, 243, 419, 750, 910];
  it('should be xs[3] = 51 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 51), 3);
  });
  it('should be xs[0] = 1 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 1), 0);
  });
  it('should be xs[9] = 910 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 910), 9);
  });
  it('should be xs[0] >= 0 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 0), 0);
  });
  it('should be xs[6] >= 52 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 52), 6);
  });
  it('should be {x for all x in xs} < 912 as in https://qiita.com/drken/items/97e37dd6143e33a64c8c', () => {
    assert.equal(binarySearch(xs, 912), 10);
  });
});
