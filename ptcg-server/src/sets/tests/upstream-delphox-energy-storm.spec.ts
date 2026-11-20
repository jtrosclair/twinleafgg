import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

describe('Delphox M4 / CRI Energy Storm', () => {
  it('counts Energy units across both boards, including one per Blend and three from Ignition', () => {
    const blend = 'Blend Energy GRPD DRX';
    const game = setupGame({ turn: 3,
      player1: {
        active: { card: 'Delphox M4', energy: ['Fire Energy SVE', 'Fire Energy SVE', 'Ignition Energy SV11W'] },
        bench: [{ card: 'Mew ex MEW', energy: [blend] }],
        deck: padDeck(10)
      },
      player2: {
        active: { card: 'Dragapult ex TWM' },
        bench: [{ card: 'Mew ex MEW', energy: [blend] }, { card: 'Cleffa OBF' }],
        deck: padDeck(10)
      }
    });
    useAttack(game.store, game.state, 0, 'Energy Storm');
    expect(game.player1.getPrizeLeft()).toBe(6);
    expect(game.player2.active.damage).toBe(210);
  });
});

describe('Delphox M4 / CRI Flare Magic', () => {
  it('can be used from the Bench and draws to seven once per turn', () => {
    const fire = 'Fire Energy SVE';
    const game = setupGame({ turn: 3,
      player1: {
        active: { card: 'Mew ex MEW' },
        bench: [{ card: 'Delphox M4' }],
        hand: [fire, fire],
        deck: padDeck(15)
      },
      player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
    });
    const use = () => useAbility(game.store, game.store.state, 0, 'Flare Magic');
    use();
    expect(game.player1.hand.cards.length).toBe(7);
    expect(game.player1.discard.cards.map(card => card.fullName)).toEqual([fire]);
    expect(() => use()).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));

    endTurn(game.store, game.store.state);
    endTurn(game.store, game.store.state);
    // Make room to draw again and preserve the unspent Basic Fire Energy.
    const player = game.store.state.players[0];
    player.hand.moveCardTo(player.hand.cards[1], player.discard);
    use();
    expect(player.hand.cards.length).toBe(7);
    expect(player.discard.cards.filter(card => card.fullName === fire).length).toBe(2);
  });

  for (const [handSize, deckSize] of [[1, 0], [8, 6]]) {
    it(`does not discard the cost when ${handSize} cards in hand and ${deckSize} in deck leave no draw`, () => {
      const game = setupGame({ turn: 3,
        player1: {
          active: { card: 'Delphox M4' },
          hand: ['Fire Energy SVE', ...padDeck(handSize - 1)], deck: padDeck(deckSize)
        },
        player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
      });
      expect(() => useAbility(game.store, game.state, 0, 'Flare Magic'))
        .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
      expect(game.store.state.players[0].hand.cards.length).toBe(handSize);
      expect(game.store.state.players[0].discard.cards.length).toBe(0);
    });
  }

  it('retains the same Pokémon’s use when it switches to the Bench', () => {
    const game = setupGame({ turn: 3,
      player1: {
        active: { card: 'Delphox M4' }, bench: [{ card: 'Mew ex MEW' }],
        hand: ['Fire Energy SVE', 'Fire Energy SVE', 'Switch SVI'], deck: padDeck(15)
      },
      player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
    });
    useAbility(game.store, game.state, 0, 'Flare Magic');
    playTrainerCard(game.store, game.state, 0, 'Switch SVI');
    expect(game.player1.bench[0].getPokemonCard()?.fullName).toBe('Delphox M4');
    expect(() => useAbility(game.store, game.state, 0, 'Flare Magic'))
      .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
  });

  it('allows the same card to use Flare Magic after leaving play and re-entering through Grand Tree', () => {
    const turo = "Professor Turo's Scenario PAR";
    const game = setupGame({ turn: 3,
      player1: {
        active: { card: 'Mew ex MEW' }, bench: [{ card: 'Delphox M4' }, { card: 'Fennekin M4' }],
        hand: ['Fire Energy SVE', 'Fire Energy SVE', turo],
        deck: [...padDeck(15), 'Braixen M4']
      },
      player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(10) }
    });
    game.player1.stadium.cards = [getCardByName('Great Tree SCR')];
    const delphox = game.player1.bench[0].getPokemonCard()!;
    useAbility(game.store, game.state, 0, 'Flare Magic');
    game.overridePrompt(ChoosePokemonPromptType, () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 }]);
    playTrainerCard(game.store, game.state, 0, turo);
    expect(game.player1.hand.cards).toContain(delphox);
    game.player1.hand.moveCardTo(delphox, game.player1.deck);
    game.overridePrompt(ChoosePokemonPromptType, () => [{ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 1 }]);
    game.overridePrompt(ChooseCardsPromptType, first => {
      game.overridePrompt(ChooseCardsPromptType, second => [(second as ChooseCardsPrompt).cards.cards.indexOf(delphox)]);
      return [(first as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === 'Braixen M4')];
    });
    game.store.dispatch(new UseStadiumAction(game.player1.id));
    expect(game.player1.bench[1].getPokemonCard()).toBe(delphox);
    useAbility(game.store, game.state, 0, 'Flare Magic');
    expect(game.player1.hand.cards.length).toBe(7);
  });
});
