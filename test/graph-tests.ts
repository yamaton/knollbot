/// <reference path="../src/graph.ts" />
/// <reference path="../src/utils.ts" />


describe('Kruskal', () => {
    let assert = chai.assert;

    // Example from CLRS p632
    const test_edges = [
        {
            pair: utils.makeUnorderedPair('a', 'b'),
            weight: 4,
        },
        {
            pair: utils.makeUnorderedPair('a', 'h'),
            weight: 8,
        },
        {
            pair: utils.makeUnorderedPair('b', 'c'),
            weight: 8,
        },
        {
            pair: utils.makeUnorderedPair('b', 'h'),
            weight: 11,
        },
        {
            pair: utils.makeUnorderedPair('c', 'd'),
            weight: 7,
        },
        {
            pair: utils.makeUnorderedPair('c', 'f'),
            weight: 4,
        },
        {
            pair: utils.makeUnorderedPair('c', 'i'),
            weight: 2,
        },
        {
            pair: utils.makeUnorderedPair('d', 'e'),
            weight: 9,
        },
        {
            pair: utils.makeUnorderedPair('d', 'f'),
            weight: 14,
        },
        {
            pair: utils.makeUnorderedPair('e', 'f'),
            weight: 10,
        },
        {
            pair: utils.makeUnorderedPair('f', 'g'),
            weight: 2,
        },
        {
            pair: utils.makeUnorderedPair('g', 'h'),
            weight: 1,
        },
        {
            pair: utils.makeUnorderedPair('g', 'i'),
            weight: 6,
        },
        {
            pair: utils.makeUnorderedPair('h', 'i'),
            weight: 7,
        },
    ];
    const g = {
        vertices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
        edges: test_edges,
    }
    const mst_edges = new WeakSet(graph.kruskal(g).map(e => e.pair));
    const expected_edges = new WeakSet([
        ['a', 'b'],
        ['a', 'h'],
        ['c', 'd'],
        ['c', 'f'],
        ['c', 'i'],
        ['f', 'g'],
        ['g', 'h'],
    ].map(v => utils.makeUnorderedPair(v[0], v[1]))
    );

    it('should behave as expected', () => {
        for (let x of g.vertices) {
            for (let y of g.vertices) {
                if (x == y) continue;
                let pair = utils.makeUnorderedPair(x, y);
                if (expected_edges.has(pair)) {
                    assert.isTrue(mst_edges.has(pair));
                } else {
                    assert.isFalse(mst_edges.has(pair));
                }
            }
        }
    });
});
