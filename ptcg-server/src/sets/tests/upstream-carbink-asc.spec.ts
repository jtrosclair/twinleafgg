import { CardType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Carbink ASC', () => {
  it('registers the printed identity and attributes', () => {
    const card = getCardByName('Carbink ASC') as PokemonCard;
    expect([card.name, card.set, card.setNumber, card.hp, card.cardType, card.regulationMark]).toEqual(['Carbink', 'ASC', '117', 90, CardType.FIGHTING, 'J']);
  });
  for (const count of [0, 1, 2, 3, 6]) {
    it(`checks the opponent's ${count} remaining Prizes`, () => {
      const g = setupGame({ player1: { active: { card: 'Carbink ASC' }, prizeCount: 1, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: count, deck: padDeck(10) } });
      const card = g.player1.active.getPokemonCard()!;
      const attack = new AttackEffect(g.player1, g.player2, card.attacks[0]);
      g.store.reduceEffect(g.state, attack);
      expect(attack.damage).toBe(count <= 2 ? 170 : 70);
    });
  }
  for (const count of [2, 3]) {
    it(`deals ${count <= 2 ? 170 : 70} damage through an actual attack`, () => {
      const g = setupGame({ turn: 2, player1: { active: { card: 'Carbink ASC', energy: ['Fighting Energy SVE', 'Fighting Energy SVE', 'Fighting Energy SVE'] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: count, deck: padDeck(10) } });
      g.player2.active.getPokemonCard()!.resistance = [];
      useAttack(g.store, g.state, 0, 'Counter Jewel');
      expect(g.player2.active.damage).toBe(count <= 2 ? 170 : 70);
    });
  }
  it('has both types in Active and Bench without changing another Pokémon', () => {
    const g = setupGame({ player1: { active: { card: 'Carbink ASC' }, bench: [{ card: 'Carbink ASC' }], deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    for (const slot of [g.player1.active, g.player1.bench[0]]) {
      const check = new CheckPokemonTypeEffect(slot);
      g.store.reduceEffect(g.state, check);
      expect(check.cardTypes).toEqual([CardType.FIGHTING, CardType.PSYCHIC]);
    }
    const other = new CheckPokemonTypeEffect(g.player2.active);
    g.store.reduceEffect(g.state, other);
    expect(other.cardTypes).toEqual([CardType.PSYCHIC]);
  });
  it('respects Garbotoxin from a Benched Garbodor with a Tool', () => {
    const g = setupGame({ player1: { active: { card: 'Carbink ASC' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Garbodor DRX', tools: ['Bravery Charm PAL'] }], deck: padDeck(10) } });
    const check = new CheckPokemonTypeEffect(g.player1.active);
    g.store.reduceEffect(g.state, check);
    expect(check.cardTypes).toEqual([CardType.FIGHTING]);
  });
  it('adds both Ability types without erasing types from other effects', () => {
    const g = setupGame({ player1: { active: { card: 'Carbink ASC' }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const check = new CheckPokemonTypeEffect(g.player1.active);
    check.cardTypes = [CardType.WATER];
    g.player1.active.getPokemonCard()!.reduceEffect(g.store, g.state, check);
    expect(check.cardTypes).toEqual([CardType.WATER, CardType.FIGHTING, CardType.PSYCHIC]);
  });
  it('applies Psychic Weakness when dealing attack damage', () => {
    const g = setupGame({ turn: 2, player1: { active: { card: 'Carbink ASC', energy: ['Fighting Energy SVE', 'Fighting Energy SVE', 'Fighting Energy SVE'] }, deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, prizeCount: 3, deck: padDeck(10) } });
    g.player2.active.getPokemonCard()!.weakness = [{ type: CardType.PSYCHIC }];
    g.player2.active.getPokemonCard()!.resistance = [];
    useAttack(g.store, g.state, 0, 'Counter Jewel');
    expect(g.player2.active.damage).toBe(140);
  });
});
