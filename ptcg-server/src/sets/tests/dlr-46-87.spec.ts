import { CardManager } from '../../game/cards/card-manager';
import { Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { setDeltaReign } from '../set-delta-reign';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack, useAbility } from './card-test-helpers';

describe('Delta Reign cards 46–87', () => {
  beforeAll(() => { const cards = CardManager.getInstance(); if (!cards.isCardDefined('Golett M6')) cards.defineSet(setDeltaReign); });
  it('registers each nondelegated base collector number exactly once', () => {
    const cards = setDeltaReign.filter(card => card.set === 'DLR' && Number(card.setNumber) >= 46 && Number(card.setNumber) <= 87 && Number(card.setNumber) !== 84);
    const numbers = cards.map(card => Number(card.setNumber)).sort((a,b) => a-b);
    expect(numbers).toEqual(Array.from({length: 42}, (_, index) => index + 46).filter(n => n !== 84));
    expect(new Set(cards.map(card => card.fullName)).size).toBe(cards.length);
  });
  it('preserves the printed name at each collector number', () => {
    const expected = ['Golett','Mega Golurk ex','Enamorus','Sandshrew','Sandslash','Onix','Steelix','Groudon','Landorus','Nidoran ♀','Nidorina','Nidoqueen','Spinarak','Ariados','Sableye','Carvanha','Sharpedo','Darkrai','Purrloin','Liepard','Zorua','Zoroark ex','Inkay','Mega Malamar ex','Morpeko','Zarude','Druddigon','Jangmo-o','Hakamo-o','Kommo-o','Cyclizar','Tauros','Eevee','Delibird','Azurill','Swablu','Altaria','Kecleon',null,'Tornadus','Fletchling','Fletchinder'];
    expected.forEach((name, index) => {
      if (name === null) return;
      const number = String(index + 46);
      expect(setDeltaReign.find(card => card.set === 'DLR' && card.setNumber === number)?.name).toBe(name);
    });
  });
  it('keeps Eevee distinct from Shaymin at the printed number', () => {
    expect(getCardByName('Eevee MEE').setNumber).toBe('78');
  });
  for (const copied of [false, true]) {
    it((copied ? 'copied' : 'direct') + ' Stealthy Sting prevents damage only from opposing Basics', () => {
      const g = setupGame({turn: 2, player1: {active: {card: copied ? 'Mew ex 30C' : 'Ariados M6', energy: ['Darkness Energy SVE','Darkness Energy SVE','Darkness Energy SVE']}, bench: copied ? [{card:'Ariados M6'}] : [], deck:padDeck(12)}, player2: {active:{card:'Mew ex MEW'}, deck:padDeck(12)}});
      if (copied) {
        g.overridePrompt('Choose attack', () => ({index: 0, attack: 'Stealthy Sting'}));
        useAbility(g.store, g.state, 0, 'Memory Helix');
      } else useAttack(g.store, g.state, 0, 'Stealthy Sting');
      const pokemon = g.player2.active.getPokemonCard()!;
      pokemon.attacks = [{name:'Test attack',cost:[],damage:30,text:''}];
      const incoming = new AttackEffect(g.player2, g.player1, pokemon.attacks[0]);
      const basic = new DealDamageEffect(incoming, 30);
      g.store.reduceEffect(g.state, basic);
      expect(basic.preventDefault).toBe(true);
      pokemon.stage = Stage.STAGE_1;
      const evolved = new DealDamageEffect(incoming, 30);
      g.store.reduceEffect(g.state, evolved);
      expect(evolved.preventDefault).toBe(false);
    });
  }
});
