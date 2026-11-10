import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { TAKE_SPECIFIC_PRIZES } from '../../game/store/prefabs/prefabs';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';

describe('Upstream Noibat and Okidogi ASC', () => {
  it('registers the distinct printed cards', () => {
    expect([getCardByName('Noibat ASC').set, getCardByName('Noibat ASC').setNumber]).toEqual(['ASC', '156']);
    expect([getCardByName('Okidogi ASC').set, getCardByName('Okidogi ASC').setNumber]).toEqual(['ASC', '122']);
  });

  for (const take of [false, true]) {
    it(`searches for at most one Tool and shuffles, even when declining: ${take}`, () => {
      const game = setupGame({ turn: 2,
        player1: { active: { card: 'Noibat ASC', energy: ['Water Energy SVE'] }, deck: ['Air Balloon SSH', 'Water Energy SVE', ...padDeck(5)] },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
      });
      let sawSearch = false, sawReveal = false, sawShuffle = false;
      game.overridePrompt(ChooseCardsPromptType, prompt => {
        sawSearch = true;
        const choose = prompt as ChooseCardsPrompt;
        const tool = choose.cards.cards.findIndex(c => c.fullName === 'Air Balloon SSH');
        const energy = choose.cards.cards.findIndex(c => c.fullName === 'Water Energy SVE');
        expect(choose.options.min).toBe(0);
        expect(choose.options.max).toBe(1);
        expect(choose.validate([choose.cards.cards[energy]])).toBe(false);
        expect(choose.validate([choose.cards.cards[tool]])).toBe(true);
        return take ? [tool] : [];
      });
      game.overridePrompt('Show cards', prompt => {
        sawReveal = true;
        const show = prompt as ShowCardsPrompt;
        expect(show.playerId).toBe(game.player2.id);
        expect(show.cards.map(c => c.fullName)).toEqual(['Air Balloon SSH']);
        return true;
      });
      game.overridePrompt('Shuffle deck', () => {
        sawShuffle = true;
        return game.player1.deck.cards.map((_, index) => index).reverse();
      });
      useAttack(game.store, game.state, 0, 'Knickknack Carrying');
      expect(sawSearch).toBe(true);
      expect(sawShuffle).toBe(true);
      expect(sawReveal).toBe(take);
      expect(game.player1.hand.cards.some(c => c.fullName === 'Air Balloon SSH')).toBe(take);
      expect(game.player1.deck.cards.some(c => c.fullName === 'Air Balloon SSH')).toBe(!take);
    });
  }

  it('can use Noibat’s attack when the deck is empty', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Noibat ASC' }, deck: [] },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const noibat = game.player1.active.getPokemonCard()!;
    expect(() => game.store.reduceEffect(game.state, new AttackEffect(game.player1, game.player2, noibat.attacks[0]))).not.toThrow();
    expect(game.player1.hand.cards.length).toBe(0);
  });

  it('shuffles without taking a card when no Tool is in the deck', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Noibat ASC', energy: ['Water Energy SVE'] }, deck: padDeck(5) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    let shuffled = false;
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      const choose = prompt as ChooseCardsPrompt;
      expect(choose.validate([])).toBe(true);
      expect(choose.validate([choose.cards.cards[0]])).toBe(false);
      return [];
    });
    game.overridePrompt('Shuffle deck', () => {
      shuffled = true;
      return game.player1.deck.cards.map((_, index) => index).reverse();
    });
    useAttack(game.store, game.state, 0, 'Knickknack Carrying');
    expect(shuffled).toBe(true);
    expect(game.player1.hand.cards.length).toBe(0);
    expect(game.player1.deck.cards.length).toBe(5);
  });

  for (const taken of [0, 1, 2, 3]) {
    it(`adds 60 damage for each of ${taken} opponent prizes taken last turn`, () => {
      const game = setupGame({ turn: 2,
        player1: { active: { card: 'Okidogi ASC' }, deck: padDeck(10) },
        player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
      });
      game.player1.prizesTakenLastTurn = 5;
      game.player2.prizesTakenLastTurn = taken;
      const okidogi = game.player1.active.getPokemonCard()!;
      const attack = new AttackEffect(game.player1, game.player2, okidogi.attacks[1]);
      game.store.reduceEffect(game.state, attack);
      expect(attack.damage).toBe(80 + 60 * taken);
    });
  }

  it('counts prizes from the opponent’s completed turn', () => {
    const game = setupGame({ turn: 2,
      player1: { active: { card: 'Okidogi ASC' }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    game.state.activePlayer = 1;
    TAKE_SPECIFIC_PRIZES(game.store, game.state, game.player2, game.player2.prizes.slice(0, 2));
    expect(game.player2.prizesTakenThisTurn).toBe(2);
    game.store.reduceEffect(game.state, new EndTurnEffect(game.player2));
    expect(game.player2.prizesTakenLastTurn).toBe(2);
    const okidogi = game.player1.active.getPokemonCard()!;
    const attack = new AttackEffect(game.player1, game.player2, okidogi.attacks[1]);
    game.store.reduceEffect(game.state, attack);
    expect(attack.damage).toBe(200);
  });
});
