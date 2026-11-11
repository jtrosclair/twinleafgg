import { buildPrintCatalogue, PrintCompatibility, PrintContract } from '../../game/cards/print-compatibility';
import { Card } from '../../game/store/card/card';
const a: PrintContract = { fullName: 'Example1 SVP', name: 'Example', set: 'SVP', number: '1', setAliases: ['PR-SV'] };
const target = () => Object.assign(Object.create(Card.prototype) as Card, { name: 'Example', set: 'SVP', setNumber: '1', fullName: 'Example1 SVP', printCompatibilityIdentity: 'Example1 SVP' });
const alternate = () => Object.assign(Object.create(Card.prototype) as Card, { name: 'Example', set: 'SVP', setNumber: '1', fullName: 'ExampleALT SVP' });
describe('generic exact-print compatibility', () => {
  it('keeps catalogue reference and order with no contracts', () => {const cards = [alternate(), target()], p = new PrintCompatibility(cards, []);expect(p.legacyCards).toBe(cards);expect(p.resolveIdentifier('Example SVP 1').recognized).toBe(false);});
  for (const reverse of [false, true]) it('resolves exact while retaining duplicate, reverse=' + reverse, () => {const card = target(), other = alternate(), p = new PrintCompatibility(reverse ? [card, other] : [other, card], [a]);expect(p.resolve('Example', 'SVP', '0001').card).toBe(card);expect(p.resolveIdentifier('Example PR-SV 1').card).toBe(card);expect(p.legacyCards).toEqual([other]);});
  it('does not substitute a different fullName when target is absent', () => {const other = alternate(), p = new PrintCompatibility([other], [a]);expect(p.resolve('Example', 'SVP', '1').recognized).toBe(true);expect(p.resolve('Example', 'SVP', '1').card).toBeUndefined();expect(p.legacyCards).toEqual([other]);});
  it('retains an unannotated owner of the proposed canonical fullName', () => {const old = alternate();old.fullName = a.fullName;const p = new PrintCompatibility([old], [a]);expect(p.hasLegacyCanonical(a.fullName)).toBe(true);expect(p.resolveIdentifier(a.fullName).recognized).toBe(false);expect(p.resolve('Example', 'SVP', '1').recognized).toBe(true);expect(p.resolve('Example', 'SVP', '1').card).toBeUndefined();expect(p.legacyCards).toEqual([old]);});
  it('rejects duplicate canonical cards in either order', () => {const old = alternate();old.fullName = a.fullName;const fresh = target();expect(() => new PrintCompatibility([old, fresh], [a])).toThrowError(/Ambiguous canonical/);expect(() => new PrintCompatibility([fresh, old], [a])).toThrowError(/Ambiguous canonical/);});
  it('rejects duplicate normalized printed aliases in either order', () => {const other: PrintContract = { fullName: 'Example2 SVP', name: 'EXAMPLE', set: 'SVP', number: '0001' };expect(() => new PrintCompatibility([], [a, other])).toThrowError(/Ambiguous printed identity/);expect(() => new PrintCompatibility([], [other, a])).toThrowError(/Ambiguous printed identity/);});
  it('keeps long collector numbers exact without numeric precision loss', () => {const c: PrintContract = { fullName: 'Huge SVP', name: 'Huge', set: 'SVP', number: '9007199254740992' };const card = Object.assign(Object.create(Card.prototype) as Card, { ...c, setNumber: c.number, printCompatibilityIdentity: c.fullName });const p = new PrintCompatibility([card], [c]);expect(p.resolve('Huge', 'SVP', '9007199254740992').card).toBe(card);expect(p.resolve('Huge', 'SVP', '9007199254740993').recognized).toBe(false);});
  it('rejects a marker attached to the wrong fullName', () => {const bad = target();bad.fullName = 'Other SVP';expect(() => new PrintCompatibility([bad], [a])).toThrowError(/Mismatched print compatibility identity/);});
  it('builds an index and resolver from one atomic catalogue snapshot', () => {
    const cards = [target(), alternate()], contracts = [a], built = buildPrintCatalogue(cards, contracts);
    cards.push(alternate());
    expect(built.compatibility.resolve('Example', 'SVP', '1').card).toBe(cards[0]);
    expect(built.compatibility.legacyCards).toEqual([cards[1]]);
    expect(built.index.size).toBe(2);
    expect(() => new (PrintCompatibility as any)(cards, contracts, { index: built.index, token: Symbol() })).toThrowError(/Untrusted print catalogue index/);
  });
  it('preserves the eager view snapshot even if input list or marker changes later', () => {
    const selected = target(), old = alternate(), cards = [old, selected], p = new PrintCompatibility(cards, [a]);
    cards.push(alternate()); selected.printCompatibilityIdentity = 'Changed SVP';
    expect(p.legacyCards).toEqual([old]);
  });
  it('treats marked cards with missing print metadata as unavailable', () => {const bad = target();delete (bad as any).setNumber;const p = new PrintCompatibility([bad], [a]);expect(p.resolve('Example', 'SVP', '1').card).toBeUndefined();});
});
