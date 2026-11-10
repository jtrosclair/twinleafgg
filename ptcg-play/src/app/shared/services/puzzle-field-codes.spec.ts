import {
  decodePuzzleFieldCodes, encodePuzzleFieldCodes, MAX_FIELD_CODE_DEPTH,
  MAX_FIELD_CODE_JSON_BYTES, MAX_FIELD_CODE_NODES, PUZZLE_FIELD_CODES_V2
} from './puzzle-field-codes';

describe('immutable gz2 field codes', () => {
  it('pins the exact released dictionary and prevents accidental mutation', () => {
    const hash = require('crypto').createHash('sha256')
      .update(JSON.stringify(PUZZLE_FIELD_CODES_V2)).digest('hex');
    expect(hash).toBe('87ca901740ddbee18996226aa35f759651512e782eee1555bd0dbd55493c6861');
    expect(Object.isFrozen(PUZZLE_FIELD_CODES_V2)).toBe(true);
    expect(PUZZLE_FIELD_CODES_V2.every(pair => Object.isFrozen(pair))).toBe(true);
    expect(new Set(PUZZLE_FIELD_CODES_V2.map(([name]) => name)).size).toBe(69);
    expect(new Set(PUZZLE_FIELD_CODES_V2.map(([, code]) => code)).size).toBe(69);
    expect(PUZZLE_FIELD_CODES_V2.every(([, code]) => /^[a-zA-Z]+$/.test(code))).toBe(true);
  });

  it('round-trips every code and retains canonical object ordering', () => {
    const fields = Object.fromEntries([...PUZZLE_FIELD_CODES_V2].reverse()
      .map(([name], index) => [name, index]));
    const json = JSON.stringify([[], { futureKey: 3, ...fields, '0': true, a: 'unknown literal a' }]);
    expect(decodePuzzleFieldCodes(encodePuzzleFieldCodes(json))).toBe(json);
  });

  it('preserves custom fields, values, physical IDs, Unicode and Ref paths', () => {
    const json = JSON.stringify([[{ id: 2 }], {
      cardNames: ['Pokémon ✨', 'Pokémon ✨'],
      cards: [{ _type: 'Card', index: 0 }, { _type: 'Card', index: 1 }],
      marker: { markers: [{ name: 'id', source: { _type: 'Ref', path: ['players', 0, 'active', 'cards', 0] } }] },
      winConditions: { mustLose: true, futureCondition: { a: 12, '~id': 'cards', '': null } },
      futureField: ['a', 'id', '~', 'cards', false, null]
    }]);
    const packed = encodePuzzleFieldCodes(json);
    expect(packed).toContain('"~futureCondition"');
    expect(packed).toContain('"~~id"');
    expect(packed).toContain('"~a"');
    expect(decodePuzzleFieldCodes(packed)).toBe(json);
  });

  it('treats prototype-like properties as data without mutating prototypes', () => {
    const json = '{"__proto__":{"polluted":true},"constructor":{"prototype":{"id":4}},"toString":null}';
    const restored = decodePuzzleFieldCodes(encodePuzzleFieldCodes(json));
    expect(restored).toBe(json);
    expect(Object.prototype.hasOwnProperty.call(JSON.parse(restored), '__proto__')).toBe(true);
    expect(({} as any).polluted).toBeUndefined();
  });

  it('rejects unknown unescaped codes and aliases for already-coded fields', () => {
    for (const json of ['{"unknownCode":1}', '{"0":1}', '{"":1}', '{"~id":1}', '{"r":1,"~id":2}']) {
      expect(() => decodePuzzleFieldCodes(json)).toThrow();
    }
    expect(decodePuzzleFieldCodes('{"~":1,"~~":2}')).toBe('{"":1,"~":2}');
  });

  it('requires JSON and canonicalizes whitespace without changing values', () => {
    expect(decodePuzzleFieldCodes(encodePuzzleFieldCodes(' { "id" : 10 } '))).toBe('{"id":10}');
    for (const json of ['', 'undefined', '{broken}', '{"a":NaN}']) {
      expect(() => encodePuzzleFieldCodes(json)).toThrow();
      expect(() => decodePuzzleFieldCodes(json)).toThrow();
    }
  });

  it('bounds nesting in both directions', () => {
    const exact = '['.repeat(MAX_FIELD_CODE_DEPTH) + '0' + ']'.repeat(MAX_FIELD_CODE_DEPTH);
    expect(decodePuzzleFieldCodes(exact)).toBe(exact);
    expect(encodePuzzleFieldCodes(exact)).toBe(exact);
    const deep = '[' + exact + ']';
    expect(() => encodePuzzleFieldCodes(deep)).toThrowError(/nesting/);
    expect(() => decodePuzzleFieldCodes(deep)).toThrowError(/nesting/);
  });

  it('bounds total values in both directions', () => {
    const exact = JSON.stringify(Array(MAX_FIELD_CODE_NODES - 1).fill(0));
    expect(decodePuzzleFieldCodes(exact)).toBe(exact);
    const extra = JSON.stringify(Array(MAX_FIELD_CODE_NODES).fill(0));
    expect(() => encodePuzzleFieldCodes(extra)).toThrowError(/structure/);
    expect(() => decodePuzzleFieldCodes(extra)).toThrowError(/structure/);
  });

  it('measures UTF-8 byte limits rather than JavaScript character counts', () => {
    const exact = JSON.stringify('é'.repeat((MAX_FIELD_CODE_JSON_BYTES - 2) / 2));
    expect(decodePuzzleFieldCodes(exact)).toBe(exact);
    expect(encodePuzzleFieldCodes(exact)).toBe(exact);
    const extra = exact.slice(0, -1) + 'a"';
    expect(() => encodePuzzleFieldCodes(extra)).toThrowError(/too large/);
    expect(() => decodePuzzleFieldCodes(extra)).toThrowError(/too large/);
  });

  it('also bounds full JSON after short fields expand', () => {
    const code = new Map(PUZZLE_FIELD_CODES_V2).get('unlimitedEnergyAttachments');
    const coded = JSON.stringify(Array(120000).fill({ [code]: 'x'.repeat(40) }));
    expect(new TextEncoder().encode(coded).length).toBeLessThan(MAX_FIELD_CODE_JSON_BYTES);
    expect(() => decodePuzzleFieldCodes(coded)).toThrowError(/too large/);
  });
});
