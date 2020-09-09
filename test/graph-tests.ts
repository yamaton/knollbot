import chai from "chai";
import { kruskal } from "../src/graph";
import { makeUnorderedPair } from "../src/utils";


describe('Kruskal', () => {
    let assert = chai.assert;

    // Example from CLRS p632
    const test_edges = [
        {
            pair: makeUnorderedPair('a', 'b'),
            weight: 4,
        },
        {
            pair: makeUnorderedPair('a', 'h'),
            weight: 8,
        },
        {
            pair: makeUnorderedPair('b', 'c'),
            weight: 8,
        },
        {
            pair: makeUnorderedPair('b', 'h'),
            weight: 11,
        },
        {
            pair: makeUnorderedPair('c', 'd'),
            weight: 7,
        },
        {
            pair: makeUnorderedPair('c', 'f'),
            weight: 4,
        },
        {
            pair: makeUnorderedPair('c', 'i'),
            weight: 2,
        },
        {
            pair: makeUnorderedPair('d', 'e'),
            weight: 9,
        },
        {
            pair: makeUnorderedPair('d', 'f'),
            weight: 14,
        },
        {
            pair: makeUnorderedPair('e', 'f'),
            weight: 10,
        },
        {
            pair: makeUnorderedPair('f', 'g'),
            weight: 2,
        },
        {
            pair: makeUnorderedPair('g', 'h'),
            weight: 1,
        },
        {
            pair: makeUnorderedPair('g', 'i'),
            weight: 6,
        },
        {
            pair: makeUnorderedPair('h', 'i'),
            weight: 7,
        },
    ];
    const g = {
        vertices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
        edges: test_edges,
    }
    const mst_edges = new WeakSet(kruskal(g).map(e => e.pair));
    const expected_edges = new WeakSet([
        ['a', 'b'],
        ['a', 'h'],
        ['c', 'd'],
        ['c', 'f'],
        ['c', 'i'],
        ['f', 'g'],
        ['g', 'h'],
    ].map(v => makeUnorderedPair(v[0], v[1]))
    );

    it('should behave as illustrated in CLRS p632', () => {
        for (let x of g.vertices) {
            for (let y of g.vertices) {
                if (x == y) continue;
                let pair = makeUnorderedPair(x, y);
                if (expected_edges.has(pair)) {
                    assert.isTrue(mst_edges.has(pair));
                } else {
                    assert.isFalse(mst_edges.has(pair));
                }
            }
        }
    });
});
