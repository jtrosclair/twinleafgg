import { CardManager } from '../../game/cards/card-manager';
import { Kadabra } from '../set-mega-evolution/kadabra';
import { getCardByName } from './test-helpers';

describe('test helper mixed set registration', () => {
  it('loads all missing cards when one card in a multi-code module was already registered', () => {
    const manager = CardManager.getInstance();
    const existing = new Kadabra();
    if (!manager.isCardDefined(existing.fullName)) manager.defineSet([existing]);
    expect(getCardByName('Buneary M1L').fullName).toBe('Buneary M1L');
    expect(getCardByName('Alakazam M1S').fullName).toBe('Alakazam M1S');
    expect(getCardByName('Kadabra M1S').fullName).toBe('Kadabra M1S');
    expect(getCardByName('Inkay LOR 77').fullName).toBe('Inkay LOR 77');
  });
  it('fails clearly for unknown cards without fabricating a replacement', () => {
    expect(() => getCardByName('Imaginary Pokemon M1L')).toThrowError(/Card not found/);
    expect(() => getCardByName('Imaginary Pokemon ZZZZZZZ')).toThrowError(/No set module found/);
  });
});
