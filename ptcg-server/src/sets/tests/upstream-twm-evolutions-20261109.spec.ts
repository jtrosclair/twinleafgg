import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { getEnergyCount, useAbility, useAttack } from './card-test-helpers';

describe('Upstream Twilight Masquerade evolution line', () => {
  it('registers the three distinct printings and evolution chain', () => {
    for (const [name, number] of [['Litwick TWM', '36'], ['Lampent TWM', '37'], ['Chandelure TWM', '38']]) {
      const card = getCardByName(name);
      expect(card.set).toBe('TWM');
      expect(card.setNumber).toBe(number);
      expect(card.fullName).toBe(name);
      expect((card as any).cardType).toBe(CardType.FIRE);
    }
    expect((getCardByName('Lampent TWM') as any).evolvesFrom).toBe('Litwick');
    expect((getCardByName('Chandelure TWM') as any).evolvesFrom).toBe('Lampent');
  });

  it('Litwick can find a Basic and put it onto the Bench', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Litwick TWM', energy: ['Fire Energy SVE'] }, deck: ['Ralts SIT', ...padDeck(8)]
    }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    useAttack(game.store, game.state, 0, 'Call for Family');
    expect(game.player1.bench.some(slot => slot.getPokemonCard()?.fullName === 'Ralts SIT')).toBe(true);
  });

  it('Litwick may fail a private Basic search, even when a Basic exists', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Litwick TWM', energy: ['Fire Energy SVE'] }, deck: ['Ralts SIT', ...padDeck(8)]
    }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    let seen = false;
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      seen = true;
      const choose = prompt as ChooseCardsPrompt;
      expect(choose.options.min).toBe(0);
      expect(choose.validate([])).toBe(true);
      return [];
    });
    useAttack(game.store, game.state, 0, 'Call for Family');
    expect(seen).toBe(true);
    expect(game.player1.bench.every(slot => slot.cards.length === 0)).toBe(true);
  });

  it('Litwick may attack with an empty deck and does not block with a full Bench', () => {
    for (const fullBench of [false, true]) {
      const game = setupGame({ turn: 2, player1: {
        active: { card: 'Litwick TWM' }, bench: fullBench ? Array.from({ length: 5 }, () => ({ card: 'Ralts SIT' })) : [],
        deck: fullBench ? padDeck(8) : []
      }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
      const card = game.player1.active.getPokemonCard()!;
      expect(() => game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, card.attacks[0]))).not.toThrow();
    }
  });

  it('Lampent discards all attached Energy when using Burn It All Up', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Lampent TWM', energy: ['Fire Energy SVE', 'Water Energy SVE'] }, deck: padDeck(10)
    }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    useAttack(game.store, game.state, 0, 'Burn It All Up');
    expect(getEnergyCount(game.state, 0)).toBe(0);
    expect(game.player1.discard.cards.filter(card => card.superType === SuperType.ENERGY).length).toBe(2);
    expect(game.player2.active.damage).toBe(60);
  });

  it('Chandelure draws for both players once per turn and scales attack damage by the opposing hand', () => {
    const game = setupGame({ turn: 2, player1: {
      active: { card: 'Chandelure TWM' }, deck: padDeck(10)
    }, player2: { active: { card: 'Mew ex MEW' }, hand: ['Fire Energy SVE', 'Water Energy SVE'], deck: padDeck(10) } });
    expect(game.player1.active.getPokemonCard()!.stage).toBe(Stage.STAGE_2);
    useAbility(game.store, game.state, 0, 'Alluring Light');
    expect(game.player1.hand.cards.length).toBe(1);
    expect(game.player2.hand.cards.length).toBe(3);
    expect(() => useAbility(game.store, game.state, 0, 'Alluring Light')).toThrow();
    const card = game.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, card.attacks[0]);
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(90);
  });
});
