import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { UseStadiumAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition, Stage, SuperType, TrainerType } from '../../game/store/card/card-types';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { endTurn, playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const quarry = 'Fossil Excavation Site M5';
const skull = 'Antique Skull Fossil M5';
const shield = 'Antique Shield Fossil M5';
const helix = 'Antique Helix Fossil MEW';
const cranidos = 'Cranidos M5';
const energy = 'Fire Energy SVE';
const tool = 'Bravery Charm PAL';
const anchor = 'Mew ex MEW';
const bench = (index = 0) => ({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });

function dig(game: ReturnType<typeof setupGame>, ...names: string[]) {
  game.overridePrompt(ChooseCardsPromptType, prompt => names.map(name =>
    (prompt as ChooseCardsPrompt).cards.cards.findIndex(card => card.fullName === name)));
  game.store.dispatch(new UseStadiumAction(game.store.state.players[game.store.state.activePlayer].id));
}

describe('Fossil Quarry', () => {
  function quarryGame() {
    return setupGame({ turn: 5,
      player1: {
        active: { card: anchor },
        hand: [quarry, cranidos],
        deck: [skull, shield, ...padDeck(10)]
      },
      player2: { active: { card: anchor }, deck: [...padDeck(1), skull, ...padDeck(9)] }
    });
  }

  it('plays into the Stadium zone and benches both printed fossils as Basics', () => {
    const game = quarryGame();
    playTrainerCard(game.store, game.state, 0, quarry);
    expect(game.player1.stadium.cards.map(card => card.fullName)).toEqual([quarry]);
    expect(game.player1.discard.cards).toEqual([]);
    dig(game, skull, shield);
    expect(game.player1.bench.slice(0, 2).map(slot => slot.getPokemonCard()?.fullName)).toEqual([skull, shield]);
    for (const slot of game.player1.bench.slice(0, 2)) {
      expect(slot.getPokemonCard()?.hp).toBe(60);
      expect(slot.getPokemonCard()?.stage).toBe(Stage.BASIC);
      expect(slot.getPokemonCard()?.superType).toBe(SuperType.TRAINER);
      expect(slot.pokemonPlayedTurn).toBe(5);
    }
    expect(() => dig(game)).toThrow(new GameError(GameMessage.STADIUM_ALREADY_USED));

    endTurn(game.store, game.store.state);
    dig(game, skull);
    expect(game.store.state.players[1].bench[0].getPokemonCard()?.fullName).toBe(skull);
    endTurn(game.store, game.store.state);
    const player = game.store.state.players[0];
    const index = player.hand.cards.findIndex(card => card.fullName === cranidos);
    game.store.dispatch(new PlayCardAction(player.id, index, bench()));
    expect(game.store.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(cranidos);
  });

  it('allows zero results, shuffles the deck, and spends the Stadium use', () => {
    const game = quarryGame();
    let shuffles = 0;
    game.overridePrompt('Shuffle deck', () => {
      shuffles++;
      return game.player1.deck.cards.map((_, index) => index);
    });
    playTrainerCard(game.store, game.state, 0, quarry);
    dig(game);
    expect(shuffles).toBe(1);
    expect(game.player1.bench.every(slot => !slot.cards.length)).toBe(true);
    expect(() => dig(game)).toThrow(new GameError(GameMessage.STADIUM_ALREADY_USED));
  });

  it('only searches Antique Items and caps the choice at the available bench space', () => {
    const game = quarryGame();
    const otherTrainer = getCardByName('Switch SVI');
    otherTrainer.name = 'Antique Test Tool';
    (otherTrainer as any).trainerType = TrainerType.TOOL;
    otherTrainer.id = 3000;
    game.player1.deck.cards.push(otherTrainer);
    game.player1.bench.slice(0, 4).forEach(slot => slot.cards.push(getCardByName(anchor)));
    playTrainerCard(game.store, game.state, 0, quarry);
    game.overridePrompt(ChooseCardsPromptType, prompt => {
      const choice = prompt as ChooseCardsPrompt;
      expect(choice.options.max).toBe(1);
      expect(choice.validate([otherTrainer])).toBe(false);
      return [choice.cards.cards.findIndex(card => card.fullName === shield)];
    });
    game.store.dispatch(new UseStadiumAction(game.player1.id));
    expect(game.player1.bench[4].getPokemonCard()?.fullName).toBe(shield);
  });
});

describe('Antique Fossils', () => {
  for (const [card, attack, energies, counters, knocksOut] of [
    ['Druddigon BRS', 'Revenge', ['Fire Energy SVE', 'Water Energy SVE'], 30, false],
    ['Dragapult ex TWM', 'Jet Headbutt', ['Psychic Energy SVE'], 30, true],
    ['Banette M5', 'Doll Catch', ['Psychic Energy SVE'], 0, true]
  ] as const) {
    it(`resolves Spiky Skull against ${card}`, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card, energy: [...energies] }, deck: padDeck(10) },
        player2: { active: { card: skull }, bench: [{ card: anchor }], deck: padDeck(10) }
      });
      const attacker = game.player1.active;
      useAttack(game.store, game.state, 0, attack);
      expect(attacker.damage).toBe(counters);
      expect(game.player2.discard.cards.some(card => card.fullName === skull)).toBe(knocksOut);
      expect(game.player1.getPrizeLeft()).toBe(knocksOut ? 5 : 6);
    });
  }

  for (const defender of [anchor, skull, shield, helix]) {
    it(`applies Toxic Powder only when ${defender} can be Poisoned`, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: 'Brute Bonnet PAR', tools: ['Ancient Booster Energy Capsule PAR'] }, deck: padDeck(10) },
        player2: { active: { card: defender }, deck: padDeck(10) }
      });
      useAbility(game.store, game.state, 0, 'Toxic Powder');
      expect(game.player2.active.specialConditions.includes(SpecialCondition.POISONED)).toBe(defender === anchor);
    });
  }

  for (const fossil of [skull, shield, helix]) {
    it(`${fossil} plays from hand and discards its attachments when removed from play`, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: anchor }, hand: [fossil, energy, tool], deck: padDeck(10) },
        player2: { active: { card: anchor }, deck: padDeck(10) }
      });
      playTrainerCard(game.store, game.state, 0, fossil);
      expect(game.player1.bench[0].getPokemonCard()?.fullName).toBe(fossil);
      const playToFossil = (name: string) => {
        const handIndex = game.player1.hand.cards.findIndex(card => card.fullName === name);
        game.store.dispatch(new PlayCardAction(game.player1.id, handIndex, bench()));
      };
      playToFossil(energy);
      playToFossil(tool);
      useAbility(game.store, game.state, 0, getCardByName(fossil).name);
      expect(game.player1.bench[0].cards).toEqual([]);
      expect(game.player1.bench[0].tools).toEqual([]);
      expect(game.player1.bench[0].energies.cards).toEqual([]);
      expect(game.player1.discard.cards.map(card => card.fullName).sort()).toEqual([fossil, energy, tool].sort());
    });
  }
});


describe('Antique Helix Fossil', () => {
  it('is an eligible Antique Item while in the deck', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: anchor }, hand: [quarry], deck: [helix, ...padDeck(10)] },
      player2: { active: { card: anchor }, deck: padDeck(10) }
    });
    playTrainerCard(game.store, game.state, 0, quarry);
    dig(game, helix);
    expect(game.player1.bench[0].getPokemonCard()?.fullName).toBe(helix);
  });

  for (const active of [false, true]) {
    it(`only locks the opponent's Stadium play while Active (${active})`, () => {
      const stadium = 'Path to the Peak CRE';
      const game = setupGame({ turn: 5,
        player1: { active: { card: anchor }, hand: [helix, 'Switch SVI', quarry], deck: padDeck(10) },
        player2: { active: { card: anchor }, hand: [stadium], deck: padDeck(10) }
      });
      playTrainerCard(game.store, game.state, 0, helix);
      if (active) {
        playTrainerCard(game.store, game.state, 0, 'Switch SVI');
        expect(game.player1.active.getPokemonCard()?.fullName).toBe(helix);
      }
      playTrainerCard(game.store, game.state, 0, quarry);
      endTurn(game.store, game.store.state);
      const playStadium = () => playTrainerCard(game.store, game.store.state, 1, stadium);
      if (active) {
        expect(playStadium).toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
        expect(game.player2.hand.cards.some(card => card.fullName === stadium)).toBe(true);
        expect(game.player1.stadium.cards[0]?.fullName).toBe(quarry);
      } else {
        playStadium();
        expect(game.player2.stadium.cards[0]?.fullName).toBe(stadium);
      }
    });
  }
});
