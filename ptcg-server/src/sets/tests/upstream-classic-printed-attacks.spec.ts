import { ensureClientCards } from '../../client/cards';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

describe('printed attacks on Secret Wonders Bulbasaur and Undaunted Leafeon', () => {
  beforeAll(ensureClientCards);

  for (const heads of [false, true]) {
    it(`Bullet Seed deals ${heads ? 40 : 0} when all four flips are ${heads ? 'heads' : 'tails'}`, () => {
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      const g = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Bulbasaur SW', energy: ['Grass Energy SVE', 'Water Energy SVE'] },
          deck: padDeck(16),
        },
        player2: { active: { card: 'Rookidee SSH' }, deck: padDeck(16) },
      });

      useAttack(g.store, g.state, 0, 'Bullet Seed');

      expect(g.player2.active.damage).toBe(heads ? 40 : 0);
      expect(g.player2.active.specialConditions).toEqual([]);
      g.store.cleanup();
    });
  }

  for (const conditions of [
    [],
    [SpecialCondition.ASLEEP],
    [SpecialCondition.ASLEEP, SpecialCondition.POISONED, SpecialCondition.BURNED],
  ]) {
    it(`Miasma Wind deals 50 per Special Condition with ${conditions.length} present`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Leafeon UD', energy: padDeck(1) }, deck: padDeck(16) },
        player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
      });
      const target = g.player2.active;
      conditions.forEach(condition => target.addSpecialCondition(condition));
      let attackDamage = 0;
      const reduce = g.store.reduceEffect.bind(g.store);
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        const next = reduce(state, effect);
        if (effect instanceof DealDamageEffect && effect.attack.name === 'Miasma Wind') attackDamage = target.damage;
        return next;
      });

      useAttack(g.store, g.state, 0, 'Miasma Wind');

      expect(attackDamage).toBe(50 * conditions.length);
      g.store.cleanup();
    });
  }
});

describe('Noble Victories Cryogonal 33', () => {
  beforeAll(ensureClientCards);

  for (const protectedBench of [false, true]) {
    it(`lets the attacker choose the Ice Chain target and ${protectedBench ? 'respects' : 'switches without'} protection`, () => {
      const g = setupGame({
        turn: 5,
        player1: { active: { card: 'Cryogonal NVI 33', energy: padDeck(1) }, deck: padDeck(16) },
        player2: {
          active: { card: 'Arceus V BRS' },
          bench: [{ card: 'Piplup DP' }, { card: 'Rookidee SSH' }],
          deck: padDeck(16),
        },
      });
      const originalDefender = g.player2.active;
      originalDefender.preventEffectsOfAttacksNextTurn = true;
      const next = g.player2.bench[1];
      next.preventEffectsOfAttacksNextTurn = protectedBench;
      let playerId: number | undefined;
      g.overridePrompt('Choose pokemon', prompt => {
        playerId = (prompt as ChoosePokemonPrompt).playerId;
        return [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 1 }];
      });

      useAttack(g.store, g.state, 0, 'Ice Chain');

      expect(playerId).toBe(g.player1.id);
      expect(g.player2.active).toBe(protectedBench ? originalDefender : next);
      expect(originalDefender.damage).toBe(0);
      g.store.cleanup();
    });
  }

  for (const returns of [false, true]) {
    it(`Frost Vanish deals 40 whether the attacker ${returns ? 'returns' : 'stays'}`, () => {
      const g = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Cryogonal NVI 33', energy: padDeck(2), tools: ['Bravery Charm PAL'] },
          bench: [{ card: 'Piplup DP' }],
          deck: padDeck(16),
        },
        player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
      });
      const source = g.player1.active;
      const cards = Array.from(new Set([...source.cards, ...source.energies.cards, ...source.tools]));
      g.overridePrompt('Confirm', () => {
        expect(g.player2.active.damage).toBe(40);
        return returns;
      });

      useAttack(g.store, g.state, 0, 'Frost Vanish');

      expect(g.player2.active.damage).toBe(40);
      if (returns) {
        expect(g.player1.active.getPokemonCard()!.fullName).toBe('Piplup DP');
        expect(g.player1.hand.cards.map(card => card.id).sort()).toEqual(cards.map(card => card.id).sort());
        expect(source.cards).toEqual([]);
        expect(source.energies.cards).toEqual([]);
        expect(source.tools).toEqual([]);
      } else {
        expect(g.player1.active).toBe(source);
        expect(g.player1.hand.cards).toEqual([]);
      }
      g.store.cleanup();
    });
  }

  it('returns the copier when Mew ex uses Frost Vanish', () => {
    const g = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Mew ex 30C', energy: padDeck(2) },
        bench: [{ card: 'Cryogonal NVI 33' }],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
    });
    const copied = g.player1.bench[0];
    const cards = g.player1.active.cards.slice();
    g.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Frost Vanish' }));
    g.overridePrompt('Confirm', () => true);

    useAbility(g.store, g.state, 0, 'Memory Helix');

    expect(g.player2.active.damage).toBe(40);
    expect(g.player1.active).toBe(copied);
    expect(g.player1.hand.cards.map(card => card.id).sort()).toEqual(cards.map(card => card.id).sort());
    g.store.cleanup();
  });
});
