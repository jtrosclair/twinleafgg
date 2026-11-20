import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { ConfirmCardsPrompt } from '../../game/store/prompts/confirm-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { SelectPrompt } from '../../game/store/prompts/select-prompt';
import { playTrainerCard, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const trickShovel = 'Trick Shovel FLF';
const sandshrew = 'Sandshrew FST 131';
const rockruff = 'Rockruff JTG';
const mew = 'Mew ex MEW';
const ownTop = 'Water Energy SVE';
const otherTop = 'Fire Energy SVE';

function shovelGame(ownDeck = [ownTop, ...padDeck(9)], otherDeck = [otherTop, ...padDeck(9)]) {
  return setupGame({ turn: 4,
    player1: { active: { card: mew }, hand: [trickShovel], deck: ownDeck },
    player2: { active: { card: mew }, deck: otherDeck }
  });
}

function recordLook(game: ReturnType<typeof setupGame>, selectedDeck: number, discard: boolean) {
  const choices: string[][] = [];
  const reveals: ConfirmCardsPrompt[] = [];
  game.overridePrompt('Select', raw => {
    const prompt = raw as SelectPrompt;
    choices.push(prompt.values.slice());
    return selectedDeck;
  });
  game.overridePrompt('Confirm cards', raw => {
    reveals.push(raw as ConfirmCardsPrompt);
    return discard ? true : null;
  });
  return { choices, reveals };
}

describe('looking at the top card of a deck', () => {
  for (const [deckIndex, discard] of [[0, false], [0, true], [1, false], [1, true]] as const) {
    it(`identifies deck ${deckIndex} and ${discard ? 'discards' : 'returns'} the same physical card`, () => {
      const game = shovelGame();
      const owner = game.state.players[deckIndex];
      const original = owner.deck.cards.slice();
      const { reveals, choices } = recordLook(game, deckIndex, discard);
      playTrainerCard(game.store, game.state, 0, trickShovel);
      expect(choices[0]).toEqual([GameMessage.REVEAL_YOUR_TOP_DECK, GameMessage.REVEAL_OPPONENT_TOP_DECK]);
      expect(reveals.length).toBe(1);
      const reveal = reveals[0];
      expect(reveal.playerId).toBe(game.player1.id);
      expect(reveal.options.allowCancel).toBe(true);
      expect(reveal.message).toBe(GameMessage.DISCARD_FROM_TOP_OF_DECK);
      expect(reveal.cards).toEqual([original[0]]);
      expect(owner.deck.cards).toEqual(discard ? original.slice(1) : original);
      expect(owner.discard.cards.includes(original[0])).toBe(discard);
    });
  }

  for (const onlyDeck of [0, 1]) {
    it(`only looks at the available deck when deck ${1 - onlyDeck} is empty`, () => {
      const game = onlyDeck === 0 ? shovelGame([ownTop], []) : shovelGame([], [otherTop]);
      const { reveals, choices } = recordLook(game, 0, false);
      playTrainerCard(game.store, game.state, 0, trickShovel);
      expect(choices).toEqual([]);
      expect(reveals[0]?.playerId).toBe(game.player1.id);
      expect(reveals[0]?.cards[0]?.fullName).toBe(onlyDeck === 0 ? ownTop : otherTop);
    });
  }

  it('rejects Trick Shovel before moving it when both decks are empty', () => {
    const game = shovelGame([], []);
    const { reveals, choices } = recordLook(game, 0, false);
    expect(() => playTrainerCard(game.store, game.state, 0, trickShovel))
      .toThrow(new GameError(GameMessage.CANNOT_PLAY_THIS_CARD));
    expect(game.store.state.players[0].hand.cards.map(card => card.fullName)).toEqual([trickShovel]);
    expect(choices).toEqual([]);
    expect(reveals).toEqual([]);
  });

  for (const card of [sandshrew, rockruff]) {
    for (const hasTopCard of [true, false]) {
      it(`resolves ${card}'s Dig It Up with ${hasTopCard ? 'one card' : 'no cards'} in its deck`, () => {
        const game = setupGame({ turn: 4,
          player1: {
            active: { card, energy: ['Fighting Energy SVE'] },
            deck: hasTopCard ? [ownTop] : []
          },
          player2: { active: { card: mew }, deck: padDeck(9) }
        });
        const { reveals } = recordLook(game, 0, true);
        useAttack(game.store, game.state, 0, 'Dig It Up');
        expect(reveals.map(reveal => reveal.message)).toEqual(hasTopCard ? [GameMessage.DISCARD_FROM_TOP_OF_DECK] : []);
        expect(game.player1.discard.cards.map(discard => discard.fullName)).toEqual(hasTopCard ? [ownTop] : []);
        expect(game.store.state.activePlayer).toBe(1);
      });
    }
  }
});

describe('Show Cards source and viewer', () => {
  for (const ownDeck of [false, true]) {
    it(`identifies the source of ${ownDeck ? 'Arc Phone’s private look' : 'Hand Scope’s opposing hand reveal'}`, () => {
      const name = ownDeck ? 'Arc Phone LOR 152' : 'Hand Scope PHF';
      const game = setupGame({ turn: 4,
        player1: { active: { card: mew }, hand: [name], deck: [ownTop, ...padDeck(9)] },
        player2: { active: { card: mew }, hand: [otherTop], deck: padDeck(10) }
      });
      game.overridePrompt('Choose prize', () => null);
      let reveal: ShowCardsPrompt | undefined;
      game.overridePrompt('Show cards', prompt => { reveal = prompt as ShowCardsPrompt; return true; });
      playTrainerCard(game.store, game.state, 0, name);
      const owner = ownDeck ? game.player1 : game.player2;
      expect(reveal?.playerId).toBe(game.player1.id);
      expect(reveal?.sourcePlayerId).toBe(owner.id);
      expect(reveal?.options.sourcePlayerId).toBe(owner.id);
      expect(reveal?.message).toBe(ownDeck ? GameMessage.CARDS_SHOWED_BY_EFFECT : GameMessage.CARDS_SHOWED_BY_THE_OPPONENT);
      expect(reveal?.cards.map(card => card.fullName)).toEqual([ownDeck ? ownTop : otherTop]);
    });
  }
});
