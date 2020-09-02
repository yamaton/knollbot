/// <reference path="../src/graph.ts" />
/// <reference path="../src/utils.ts" />


describe('Kruskal', () => {
    let assert = chai.assert;

    // Example from CLRS p632
    const test_edges = [
        {
            pair: Utils.makeUnorderedPair('a', 'b'),
            weight: 4,
        },
        {
            pair: Utils.makeUnorderedPair('a', 'h'),
            weight: 8,
        },
        {
            pair: Utils.makeUnorderedPair('b', 'c'),
            weight: 8,
        },
        {
            pair: Utils.makeUnorderedPair('b', 'h'),
            weight: 11,
        },
        {
            pair: Utils.makeUnorderedPair('c', 'd'),
            weight: 7,
        },
        {
            pair: Utils.makeUnorderedPair('c', 'f'),
            weight: 4,
        },
        {
            pair: Utils.makeUnorderedPair('c', 'i'),
            weight: 2,
        },
        {
            pair: Utils.makeUnorderedPair('d', 'e'),
            weight: 9,
        },
        {
            pair: Utils.makeUnorderedPair('d', 'f'),
            weight: 14,
        },
        {
            pair: Utils.makeUnorderedPair('e', 'f'),
            weight: 10,
        },
        {
            pair: Utils.makeUnorderedPair('f', 'g'),
            weight: 2,
        },
        {
            pair: Utils.makeUnorderedPair('g', 'h'),
            weight: 1,
        },
        {
            pair: Utils.makeUnorderedPair('g', 'i'),
            weight: 6,
        },
        {
            pair: Utils.makeUnorderedPair('h', 'i'),
            weight: 7,
        },
    ];
    const g = {
        vertices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'],
        edges: test_edges,
    }
    const mst_edges = new WeakSet(Graph.kruskal(g).map(e => e.pair));
    const expected_edges = new WeakSet([
        ['a', 'b'],
        ['a', 'h'],
        ['c', 'd'],
        ['c', 'f'],
        ['c', 'i'],
        ['f', 'g'],
        ['g', 'h'],
    ].map(v => Utils.makeUnorderedPair(v[0], v[1]))
    );

    it('should behave as illustrated in CLRS p632', () => {
        for (let x of g.vertices) {
            for (let y of g.vertices) {
                if (x == y) continue;
                let pair = Utils.makeUnorderedPair(x, y);
                if (expected_edges.has(pair)) {
                    assert.isTrue(mst_edges.has(pair));
                } else {
                    assert.isFalse(mst_edges.has(pair));
                }
            }
        }
    });
});
