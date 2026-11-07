import { Base64 } from './base64';

describe('Base64', () => {

  let base64: Base64;

  beforeEach(() => {
    base64 = new Base64();
  });

  it('round-trips accented, CJK and astral Unicode as UTF-8', () => {
    const text = 'Żółcić gęślą jaźń — Pokémon 日本語 🐉𝄞';
    expect(base64.encode(text)).toBe(Buffer.from(text, 'utf8').toString('base64'));
    expect(base64.decode(base64.encode(text))).toBe(text);
  });

  it('Should encode to base64', () => {
    //when
    const encode1 = base64.encode('');
    const encode2 = base64.encode('123456');
    const encode3 = base64.encode('1234567');
    const encode4 = base64.encode('12345678');

    //then
    expect(encode1).toBe('');
    expect(encode2).toBe('MTIzNDU2');
    expect(encode3).toBe('MTIzNDU2Nw==');
    expect(encode4).toBe('MTIzNDU2Nzg=');
  });

  it('accepts omitted padding and ASCII whitespace exactly as native atob', () => {
    expect(base64.decode('AA')).toBe('\u0000');
    expect(base64.decode(' Y Q ==\n\t')).toBe('a');
    expect(base64.decode('YQ')).toBe('a');
  });

  it('preserves native atob rejection for invalid alphabet, padding and lengths', () => {
    for (const value of ['!@#$', 'A', 'YQ===', 'Y=Q=', '🐉']) {
      let nativeError: Error | undefined, actualError: Error | undefined;
      try { atob(value); } catch (error) {
        if (!(error instanceof Error)) { throw error; }
        nativeError = error;
      }
      try { base64.decode(value); } catch (error) {
        if (!(error instanceof Error)) { throw error; }
        actualError = error;
      }
      expect(nativeError).toBeDefined();
      expect(actualError).toBeDefined();
      if (!nativeError || !actualError) { throw new Error('Invalid Base64 must be rejected.'); }
      expect(actualError.name).toBe(nativeError.name);
      expect(actualError.message).toBe(nativeError.message);
    }
  });

  it('Should decode from base64', () => {
    //when
    const decode1 = base64.decode('');
    const decode2 = base64.decode('MTIzNDU2');
    const decode3 = base64.decode('MTIzNDU2Nw==');
    const decode4 = base64.decode('MTIzNDU2Nzg=');

    //then
    expect(decode1).toBe('');
    expect(decode2).toBe('123456');
    expect(decode3).toBe('1234567');
    expect(decode4).toBe('12345678');
  });

  it('retains TextDecoder replacement behavior for malformed and truncated UTF-8', () => {
    expect(base64.decode('/w==')).toBe('\ufffd');
    expect(base64.decode('wyg=')).toBe('\ufffd(');
    expect(base64.decode('8J+Q')).toBe('\ufffd');
    expect(base64.decode('7aCA')).toBe('\ufffd\ufffd\ufffd');
    const bytes = Uint8Array.from({ length: 256 }, (_, index) => index);
    const encoded = Buffer.from(bytes).toString('base64');
    expect(base64.decode(encoded)).toBe(new TextDecoder().decode(bytes));
  });

  it('preserves JSON escaped lone surrogates while keeping raw TextEncoder replacement', () => {
    const raw = 'A\ud800B\udfff';
    expect(base64.decode(base64.encode(raw))).toBe('A\ufffdB\ufffd');
    const json = JSON.stringify({ raw, astral: '🐉' });
    expect(base64.decode(base64.encode(json))).toBe(json);
    expect(JSON.parse(base64.decode(base64.encode(json)))).toEqual({ raw, astral: '🐉' });
  });

  it('encodes long UTF-8 strings across byte chunk boundaries without changing bytes', () => {
    const text = 'x'.repeat(8191) + '🐉é' + '日本語'.repeat(7000) + '\u0000';
    const encoded = base64.encode(text);
    expect(encoded).toBe(Buffer.from(text, 'utf8').toString('base64'));
    expect(base64.decode(encoded)).toBe(text);
  });

});
