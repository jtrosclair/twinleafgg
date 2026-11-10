import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { getEnergyCount, useAbility, useAttack } from './card-test-helpers';

describe('Upstream artwork-backed card requests', () => {
  it('registers distinct cards with their original set and number', () => {
    for (const [name, set, number] of [
      ['Cramorant TWM', 'TWM', '58'], ['Oricorio PAL', 'PAL', '33'], ['Electabuzz TEF', 'TEF', '53'], ['Electivire TEF', 'TEF', '54']
    ]) {
      const card = getCardByName(name);
      expect(card.fullName).toBe(name);
      expect(card.set).toBe(set);
      expect(card.setNumber).toBe(number);
    }
    expect((getCardByName('Electabuzz TEF') as any).cardType).toBe(CardType.LIGHTNING);
  });

  it('Oricorio heals a damaged Active Evolution once per turn', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Kirlia SIT', damage: 40 }, bench: [{ card: 'Oricorio PAL' }], deck: padDeck(10)
    }, player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) } });
    expect(game.player1.active.getPokemonCard()!.stage).not.toBe(Stage.BASIC);
    useAbility(game.store, game.state, 0, 'Ardent Dancing');
    expect(game.player1.active.damage).toBe(20);
    expect(() => useAbility(game.store, game.state, 0, 'Ardent Dancing')).toThrow();
    expect(game.player1.active.damage).toBe(20);
  });

  it('Oricorio cannot heal a damaged Basic Pokémon', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Ralts SIT', damage: 40 }, bench: [{ card: 'Oricorio PAL' }], deck: padDeck(10)
    }, player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) } });
    expect(() => useAbility(game.store, game.state, 0, 'Ardent Dancing')).toThrow();
    expect(game.player1.active.damage).toBe(40);
  });

  it('Cramorant discards all attached energy and deals 120 to the chosen Bench Pokémon', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Cramorant TWM', energy: ['Water Energy SVE', 'Grass Energy SVE', 'Fire Energy SVE'] }, deck: padDeck(10)
    }, player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(10) } });
    game.overridePrompt(ChoosePokemonPromptType, () => [{ player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }]);
    useAttack(game.store, game.state, 0, 'Spit Shot');
    expect(getEnergyCount(game.state, 0)).toBe(0);
    expect(game.player1.discard.cards.filter(c => c.superType === SuperType.ENERGY).length).toBe(3);
    expect(game.player2.bench[0].damage).toBe(120);
    expect(game.player2.active.damage).toBe(0);
  });

  it('Electivire adds damage only when the opponent has Water Pokémon in play', () => {
    for (const opponentHasWater of [false, true]) {
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Electivire TEF' }, bench: [{ card: 'Cramorant TWM' }], deck: padDeck(10)
      }, player2: {
        active: { card: 'Mew ex MEW' },
        bench: opponentHasWater ? [{ card: 'Cramorant TWM' }] : [], deck: padDeck(10)
      } });
      const card = game.player1.active.getPokemonCard()!;
      const effect = new AttackEffect(game.player1, game.player2, card.attacks[0]);
      game.store.reduceEffect(game.state, effect);
      expect(effect.damage).toBe(opponentHasWater ? 160 : 40);
    }
  });
});
