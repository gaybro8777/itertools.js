// @flow strict

import { range } from '../builtins';
import { first } from '../custom';
import {
    chunked,
    flatten,
    intersperse,
    pairwise,
    partition,
    roundrobin,
    take,
    uniqueEverseen,
    uniqueJustseen,
} from '../more-itertools';

const isEven = x => x % 2 === 0;
const isPositive = x => x >= 0;

describe('chunked', () => {
    it('does nothing for empty array', () => {
        expect([...chunked([], 3)]).toEqual([]);
    });

    it('works with array smaller than chunk size', () => {
        expect([...chunked([1], 3)]).toEqual([[1]]);
    });

    it('works with array of values', () => {
        expect([...chunked([1, 2, 3, 4, 5], 3)]).toEqual([[1, 2, 3], [4, 5]]);
    });
});

describe('first', () => {
    it('returns nothing for an empty array', () => {
        expect(first([])).toBeUndefined();
        expect(first([undefined, undefined])).toBeUndefined();
    });

    it('returns the first value in the array', () => {
        expect(first([3, 'ohai'])).toBe(3);
        expect(first([undefined, 3, 'ohai'])).toBe(3);
        expect(first(['ohai', 3])).toBe('ohai');
    });

    it('first may returns falsey values too', () => {
        expect(first([0, 1, 2])).toBe(0);
        expect(first([false, true])).toBe(false);
    });

    it('first uses a predicate if provided', () => {
        expect(first([0, 1, 2, 3, 4], n => !!n)).toBe(1);
        expect(first([0, 1, 2, 3, 4], n => n > 1)).toBe(2);
        expect(first([0, 1, 2, 3, 4], n => n < 0)).toBeUndefined();
        expect(first([false, true], x => x)).toBe(true);
    });
});

describe('flatten', () => {
    it('flatten w/ empty list', () => {
        expect([...flatten([])]).toEqual([]);
        expect([...flatten([[], [], [], [], []])]).toEqual([]);
    });

    it('flatten works', () => {
        expect([...flatten([[1, 2], [3, 4, 5]])]).toEqual([1, 2, 3, 4, 5]);
        expect([...flatten(['hi', 'ha'])]).toEqual(['h', 'i', 'h', 'a']);
    });
});

describe('intersperse', () => {
    it('intersperse on empty sequence', () => {
        expect([...intersperse(0, [])]).toEqual([]);
    });

    it('intersperse', () => {
        expect([...intersperse(-1, [13])]).toEqual([13]);
        expect([...intersperse(null, [13, 14])]).toEqual([13, null, 14]);
        expect([...intersperse('foo', [1, 2, 3, 4])]).toEqual([1, 'foo', 2, 'foo', 3, 'foo', 4]);
    });
});

describe('itake', () => {
    it('itake is tested through take() tests', () => {
        // This is okay
    });
});

describe('pairwise', () => {
    it('does nothing for empty array', () => {
        expect([...pairwise([])]).toEqual([]);
        expect([...pairwise([1])]).toEqual([]);
    });

    it('it returns pairs of input', () => {
        expect([...pairwise([0, 1, 2])]).toEqual([[0, 1], [1, 2]]);
        expect([...pairwise([1, 2])]).toEqual([[1, 2]]);
        expect([...pairwise([1, 2, 3, 4])]).toEqual([[1, 2], [2, 3], [3, 4]]);
    });
});

describe('partition', () => {
    it('partition empty list', () => {
        expect(partition([], isEven)).toEqual([[], []]);
    });

    it('partition splits input list into two lists', () => {
        const values = [1, -2, 3, 4, 5, 6, 8, 8, 0, -2, -3];
        expect(partition(values, isEven)).toEqual([[-2, 4, 6, 8, 8, 0, -2], [1, 3, 5, -3]]);
        expect(partition(values, isPositive)).toEqual([[1, 3, 4, 5, 6, 8, 8, 0], [-2, -2, -3]]);
    });
});

describe('roundrobin', () => {
    it('roundrobin on empty list', () => {
        expect([...roundrobin()]).toEqual([]);
        expect([...roundrobin([])]).toEqual([]);
        expect([...roundrobin([], [])]).toEqual([]);
        expect([...roundrobin([], [], [])]).toEqual([]);
        expect([...roundrobin([], [], [], [])]).toEqual([]);
    });

    it('roundrobin on equally sized lists', () => {
        expect([...roundrobin([1], [2], [3])]).toEqual([1, 2, 3]);
        expect([...roundrobin([1, 2], [3, 4])]).toEqual([1, 3, 2, 4]);
        expect([...roundrobin('foo', 'bar')].join('')).toEqual('fboaor');
    });

    it('roundrobin on unequally sized lists', () => {
        expect([...roundrobin([1], [], [2, 3, 4])]).toEqual([1, 2, 3, 4]);
        expect([...roundrobin([1, 2, 3, 4, 5], [6, 7])]).toEqual([1, 6, 2, 7, 3, 4, 5]);
        expect([...roundrobin([1, 2, 3], [4], [5, 6, 7, 8])]).toEqual([1, 4, 5, 2, 6, 3, 7, 8]);
    });
});

describe('take', () => {
    it('take on empty array', () => {
        expect(take(0, [])).toEqual([]);
        expect(take(1, [])).toEqual([]);
        expect(take(99, [])).toEqual([]);
    });

    it('take on infinite input', () => {
        expect(take(5, Math.PI.toString())).toEqual(['3', '.', '1', '4', '1']);
    });

    it('take on infinite input', () => {
        expect(take(0, range(999)).length).toEqual(0);
        expect(take(1, range(999)).length).toEqual(1);
        expect(take(99, range(999)).length).toEqual(99);
    });
});

describe('uniqueJustseen', () => {
    it('uniqueJustseen w/ empty list', () => {
        expect([...uniqueJustseen([])]).toEqual([]);
    });

    it('uniqueJustseen', () => {
        expect([...uniqueJustseen([1, 2, 3, 4, 5])]).toEqual([1, 2, 3, 4, 5]);
        expect([...uniqueJustseen([1, 1, 1, 2, 2])]).toEqual([1, 2]);
        expect([...uniqueJustseen([1, 1, 1, 2, 2, 1, 1, 1, 1])]).toEqual([1, 2, 1]);
    });

    it('uniqueEverseen with key function', () => {
        expect([...uniqueJustseen('AaABbBCcaABBb', s => s.toLowerCase())]).toEqual(['A', 'B', 'C', 'a', 'B']);
    });
});

describe('uniqueEverseen', () => {
    it('uniqueEverseen w/ empty list', () => {
        expect([...uniqueEverseen([])]).toEqual([]);
    });

    it('uniqueEverseen never emits dupes, but keeps input ordering', () => {
        expect([...uniqueEverseen([1, 2, 3, 4, 5])]).toEqual([1, 2, 3, 4, 5]);
        expect([...uniqueEverseen([1, 1, 1, 2, 2, 3, 1, 3, 0, 4])]).toEqual([1, 2, 3, 0, 4]);
        expect([...uniqueEverseen([1, 1, 1, 2, 2, 1, 1, 1, 1])]).toEqual([1, 2]);
    });

    it('uniqueEverseen with key function', () => {
        expect([...uniqueEverseen('AAAABBBCCDAABBB')]).toEqual(['A', 'B', 'C', 'D']);
        expect([...uniqueEverseen('ABCcAb', s => s.toLowerCase())]).toEqual(['A', 'B', 'C']);
        expect([...uniqueEverseen('AbCBBcAb', s => s.toLowerCase())]).toEqual(['A', 'b', 'C']);
    });
});
