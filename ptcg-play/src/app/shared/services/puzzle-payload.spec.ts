import {
  decodePuzzlePayload, MAX_COMPRESSED_PUZZLE_BYTES, MAX_EXPANDED_PUZZLE_BYTES
} from './puzzle-payload';
import { encodePuzzleFieldCodes } from './puzzle-field-codes';

const zlib = require('zlib');
const token = (bytes: Uint8Array, version = 'gz1'): string => version + '.' + Buffer.from(bytes).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const gzip = (text: string): Buffer => zlib.gzipSync(Buffer.from(text, 'utf8'));

describe('initial puzzle gzip transport', () => {
  it('preserves every legacy input byte and rejects unsupported versions', () => {
    for (const value of ['W10=', 'W10', '', 'old/noncanonical+base64==']) {
      expect(decodePuzzlePayload(value)).toBe(value);
    }
    expect(() => decodePuzzlePayload('gz3.AAAA')).toThrowError(/version/);
  });

  it('returns the exact UTF-8 Base64 bytes, including Unicode and multiple output chunks', () => {
    const text = JSON.stringify([{ name: 'Pokémon ✨ 星' }, { text: 'é'.repeat(20000) }]);
    expect(decodePuzzlePayload(token(gzip(text)))).toBe(Buffer.from(text).toString('base64'));
  });

  it('restores gz2 field names without changing property order, references, Unicode or code-like values', () => {
    const json = JSON.stringify([[{
      _type: 'Player', id: 43, name: 'Pokémon ✨ 星',
      active: { _type: 'PokemonCardList', cards: [{ _type: 'Card', id: 7 }] },
      marker: { _type: 'Marker', markers: [{ name: 'a ~name', source: { _type: 'Ref', path: '0.0.active.cards.0' } }] }
    }], {
      _type: 'State', cardNames: ['Adapter Pokemon TEST'], prompts: [],
      winConditions: { selfDeckOut: true, customRule: { a: 'name', '~name': 'a', name: '~name', nested: ['勝利'] } },
      arbitraryField: { text: 'é'.repeat(20000), nullValue: null, falseValue: false, zeroValue: 0, emptyValue: '' }
    }]);
    const coded = encodePuzzleFieldCodes(json);
    expect(coded).not.toBe(json);
    for (const options of [{ level: 0 }, { level: 6, strategy: zlib.constants.Z_FIXED }, { level: 9 }]) {
      const compressed = zlib.gzipSync(Buffer.from(coded, 'utf8'), options);
      expect(decodePuzzlePayload(token(compressed, 'gz2'))).toBe(Buffer.from(json).toString('base64'));
    }
  });

  it('uses the prefix to distinguish ordinary JSON keys from gz2 field codes', () => {
    const ordinary = '[[],{"a":"name","~name":"a"}]';
    expect(decodePuzzlePayload(token(gzip(ordinary)))).toBe(Buffer.from(ordinary).toString('base64'));
    for (const malformed of ['[[],{"notAFieldCode":1}]', '[[],{"~name":1}]', '[[],{"~_type":1}]', '{']) {
      expect(() => decodePuzzlePayload(token(gzip(malformed), 'gz2'))).toThrow();
    }
  });

  it('accepts stored, fixed-Huffman and dynamic-Huffman gzip streams', () => {
    const bytes = Buffer.from('some repeated Pokémon puzzle text!'.repeat(2000));
    for (const options of [{ level: 0 }, { level: 6, strategy: zlib.constants.Z_FIXED }, { level: 9 }]) {
      expect(decodePuzzlePayload(token(zlib.gzipSync(bytes, options)))).toBe(bytes.toString('base64'));
    }
  });

  it('requires canonical unpadded Base64URL', () => {
    for (const version of ['gz1', 'gz2']) {
      for (const body of ['', 'A', 'AAAA=', 'AA+A', 'AA/A', 'AA A', 'AB']) {
        expect(() => decodePuzzlePayload(version + '.' + body)).toThrowError(/encoding/);
      }
    }
  });

  it('rejects every truncated form including missing footer bytes', () => {
    const json = '[[],{"customWinConditions":{"selfDeckOut":true}}]';
    for (const version of ['gz1', 'gz2']) {
      const bytes = gzip(version === 'gz2' ? encodePuzzleFieldCodes(json) : json);
      for (let length = 1; length < bytes.length; length++) {
        expect(() => decodePuzzlePayload(token(bytes.subarray(0, length), version))).toThrow();
      }
    }
  });

  it('rejects corrupt data, checksum and declared uncompressed size', () => {
    const json = '[[],{"players":[],"turn":8}]';
    for (const version of ['gz1', 'gz2']) {
      const bytes = gzip(version === 'gz2' ? encodePuzzleFieldCodes(json) : json);
      for (const offset of [0, 2, 3, 11, bytes.length - 8, bytes.length - 4]) {
        const corrupt = Buffer.from(bytes);
        corrupt[offset] ^= 255;
        expect(() => decodePuzzlePayload(token(corrupt, version))).toThrow();
      }
    }
  });

  it('rejects trailing bytes and concatenated members', () => {
    const bytes = gzip('[[],{}]');
    for (const version of ['gz1', 'gz2']) {
      for (const extra of [Buffer.from([0]), Buffer.from('junk'), bytes]) {
        expect(() => decodePuzzlePayload(token(Buffer.concat([bytes, extra]), version))).toThrowError(/trailing/);
      }
    }
  });

  it('rejects raw deflate and zlib streams', () => {
    const bytes = Buffer.from('[[],{}]');
    for (const version of ['gz1', 'gz2']) {
      for (const stream of [zlib.deflateSync(bytes), zlib.deflateRawSync(bytes)]) {
        expect(() => decodePuzzlePayload(token(stream, version))).toThrow();
      }
    }
  });

  it('rejects invalid UTF-8 without replacing bytes', () => {
    for (const version of ['gz1', 'gz2']) {
      expect(() => decodePuzzlePayload(token(zlib.gzipSync(Buffer.from([0xc3, 0x28])), version))).toThrow();
    }
  });

  it('bounds compressed input before attempting decompression', () => {
    for (const version of ['gz1', 'gz2']) {
      const tooLarge = token(Buffer.alloc(MAX_COMPRESSED_PUZZLE_BYTES + 1), version);
      expect(() => decodePuzzlePayload(tooLarge)).toThrowError(/too large/);
    }
  });

  it('accepts the exact expanded limit and stops expansion above it', () => {
    const exact = Buffer.alloc(MAX_EXPANDED_PUZZLE_BYTES, 65);
    expect(decodePuzzlePayload(token(zlib.gzipSync(exact)))).toBe(exact.toString('base64'));
    const tooLarge = Buffer.alloc(MAX_EXPANDED_PUZZLE_BYTES + 1, 65);
    for (const version of ['gz1', 'gz2']) {
      expect(() => decodePuzzlePayload(token(zlib.gzipSync(tooLarge), version))).toThrowError(/too large/);
    }
  });
});
