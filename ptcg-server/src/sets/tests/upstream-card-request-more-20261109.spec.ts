import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { CardManager } from '../../game/cards/card-manager';
import { setMegaEvolution } from '../set-mega-evolution';

describe('Additional upstream artwork-backed requests', () => {
  // The test helper infers a single set code from each set module; Mega
  // Evolution contains both MEG and Japanese M1 cards. Register the real set.
  beforeAll(() => CardManager.getInstance().defineSet(setMegaEvolution));
  it('registers three distinct correct printing identifiers', () => {
    for (const [name, set, number] of [['Slowpoke PAL', 'PAL', '85'], ['Tatsugiri PAR', 'PAR', '141'], ['Tyrogue MEG', 'MEG', '71']]) {
      const card = getCardByName(name);
      expect([card.fullName, card.set, card.setNumber]).toEqual([name, set, number]);
    }
  });

  it('Slowpoke searches its deck on heads and discards from hand on tails', () => {
    const random = spyOn(Math, 'random');
    for (const heads of [true, false]) {
      random.and.returnValue(heads ? 0 : 1);
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Slowpoke PAL', energy: ['Psychic Energy SVE'] },
        hand: ['Grass Energy SVE'], deck: ['Fire Energy SVE', ...padDeck(8)]
      }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      useAttack(game.store, game.state, 0, 'Tail-Fishing');
      if (heads) {
        expect(game.player1.hand.cards.some(card => card.fullName === 'Fire Energy SVE')).toBe(true);
        expect(game.player1.hand.cards.some(card => card.fullName === 'Grass Energy SVE')).toBe(true);
      } else {
        expect(game.player1.hand.cards.some(card => card.fullName === 'Grass Energy SVE')).toBe(false);
        expect(game.player1.discard.cards.some(card => card.fullName === 'Grass Energy SVE')).toBe(true);
      }
    }
  });

  it('Slowpoke safely resolves either coin result when its corresponding zone is empty', () => {
    const random = spyOn(Math, 'random');
    for (const heads of [true, false]) {
      random.and.returnValue(heads ? 0 : 1);
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Slowpoke PAL' }, hand: [], deck: heads ? [] : padDeck(8)
      }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const card = game.player1.active.getPokemonCard()!;
      expect(() => game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, card.attacks[0]))).not.toThrow();
    }
  });

  it('Tatsugiri can search up to two cards, including choosing none', () => {
    for (const count of [0, 2]) {
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Tatsugiri PAR', energy: ['Water Energy SVE', 'Grass Energy SVE'] },
        deck: ['Fire Energy SVE', 'Psychic Energy SVE', ...padDeck(8)]
      }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      let seen = false;
      game.overridePrompt(ChooseCardsPromptType, prompt => {
        seen = true;
        const choose = prompt as ChooseCardsPrompt;
        expect(choose.options.min).toBe(0);
        expect(choose.options.max).toBe(2);
        return count ? [0, 1] : [];
      });
      useAttack(game.store, game.state, 0, 'Survival Strategy');
      expect(seen).toBe(true);
      expect(game.player1.hand.cards.length).toBe(count);
    }
  });

  it('Tatsugiri switches after the search only if the player chooses to', () => {
    for (const shouldSwitch of [false, true]) {
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Tatsugiri PAR', energy: ['Water Energy SVE', 'Grass Energy SVE'] },
        bench: [{ card: 'Ralts SIT' }], deck: padDeck(10)
      }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      game.overridePrompt('Confirm', () => shouldSwitch);
      useAttack(game.store, game.state, 0, 'Survival Strategy');
      expect(game.player1.active.getPokemonCard()?.fullName).toBe(shouldSwitch ? 'Ralts SIT' : 'Tatsugiri PAR');
    }
  });

  it('Tyrogue starts at 10 damage and tails adds no bonus', () => {
    spyOn(Math, 'random').and.returnValue(1);
    const game = setupGame({ turn: 2, player1: { active: { card: 'Tyrogue MEG' }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const card = game.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, card.attacks[0]);
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(10);
  });

  it('Tyrogue adds 30 damage for each heads before tails', () => {
    const game = setupGame({ turn: 2, player1: { active: { card: 'Tyrogue MEG', energy: ['Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const sequence = [true, true, false];
    const reduce = game.store.reduceEffect.bind(game.store);
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CoinFlipEffect) {
        effect.callback!(sequence.shift() ?? false);
        return state;
      }
      return reduce(state, effect);
    });
    const card = game.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, card.attacks[0]);
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(70);
  });
});
