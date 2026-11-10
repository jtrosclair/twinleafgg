import { deepClone } from './utils';

describe('deepClone reference indexing', () => {
  it('preserves primitives and independently copies arrays', () => {
    expect(deepClone(null)).toBeNull();
    expect(deepClone(undefined)).toBeUndefined();
    expect(deepClone(3)).toBe(3);
    const source = [1, { value: 2 }];
    const copy = deepClone(source);
    expect(copy).toEqual(source);
    expect(copy).not.toBe(source);
    expect(copy[1]).not.toBe(source[1]);
  });

  it('preserves object aliases and cycles inside a state graph', () => {
    const shared: any = { damage: 20 };
    const source: any = { first: shared, second: shared };
    shared.owner = source;
    const copy = deepClone(source);
    expect(copy.first).toBe(copy.second);
    expect(copy.first).not.toBe(shared);
    expect(copy.first.owner).toBe(copy);
    copy.first.damage = 30;
    expect(shared.damage).toBe(20);
  });

  it('retains class behavior and the existing source-backed prototype', () => {
    class Counter { constructor(public value: number) {} read() { return this.value; } }
    const source = new Counter(7);
    const copy = deepClone(source);
    expect(copy instanceof Counter).toBe(true);
    expect(Object.getPrototypeOf(copy)).toBe(source);
    copy.value = 9;
    expect(copy.read()).toBe(9);
    expect(source.value).toBe(7);
  });

  it('leaves ignored executable card classes shared', () => {
    class Card { public id = 1; }
    const card = new Card();
    const state = { cards: [card], mutable: { count: 1 } };
    const copy = deepClone(state, [Card]);
    expect(copy.cards).not.toBe(state.cards);
    expect(copy.cards[0]).toBe(card);
    expect(copy.mutable).not.toBe(state.mutable);
  });

  it('honors caller-supplied references and retains first-match semantics', () => {
    const source = { value: 1 }, first = { value: 2 }, second = { value: 3 };
    const references: {s: Object, d: Object}[] = [{s: source, d: first}, {s: source, d: second}];
    expect(deepClone(source, [], references)).toBe(first);
    const container = { item: source };
    const copy = deepClone(container, [], references);
    expect(copy.item).toBe(first);
    expect(references.length).toBe(3);
    expect(references[2].s).toBe(container);
    expect(references[2].d).toBe(copy);
  });

  it('tolerates primitive sources in a caller-provided reference map', () => {
    const refs: {s: Object, d: Object}[] = [{s: 4, d: 8}, {s: null as any, d: 9}];
    const copy = deepClone({ value: 4 }, [], refs);
    expect(copy.value).toBe(4);
    expect(refs.length).toBe(3);
  });

  it('preserves separate arrays while reusing their shared object elements', () => {
    const object = { value: 1 }, array = [object];
    const copy = deepClone({ first: array, second: array });
    expect(copy.first).not.toBe(copy.second);
    expect(copy.first[0]).toBe(copy.second[0]);
  });

  it('keeps function references callable throughout cyclic object graphs', () => {
    const callback = (value: number) => value + 3;
    const source: any = { callback, list: [callback] };
    source.list.push(source);
    const copy = deepClone(source);
    expect(deepClone(callback)).toBe(callback);
    expect(copy.callback).toBe(callback);
    expect(copy.list[0]).toBe(callback);
    expect(copy.list[1]).toBe(copy);
    expect(copy.callback(4)).toBe(7);
  });

  it('keeps legacy independent array copies even when arrays are ignored or listed in refMap', () => {
    const source = [{ value: 1 }];
    const replacement = [{ value: 2 }];
    const refs: { s: Object; d: Object }[] = [{ s: source, d: replacement }];
    const copy = deepClone({ left: source, right: source }, [Array], refs);
    expect(copy.left).not.toBe(source);
    expect(copy.left).not.toBe(replacement);
    expect(copy.left).not.toBe(copy.right);
    expect(copy.left[0]).toBe(copy.right[0]);
  });

  it('does not turn inherited enumerable fields into own fields', () => {
    const source = Object.create({ inherited: { value: 1 } });
    source.own = { value: 2 };
    const copy = deepClone(source);
    expect(Object.prototype.hasOwnProperty.call(copy, 'inherited')).toBe(false);
    expect(copy.inherited).toBe(source.inherited);
    expect(copy.own).not.toBe(source.own);
  });
});
