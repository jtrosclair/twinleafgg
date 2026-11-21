import { ensureClientCards } from '../../client/cards';
import { DeckAnalyser } from '../../game/cards/deck-analyser';
import { GameMessage } from '../../game/game-message';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Format } from '../../game/store/card/card-types';
import { CardTarget, PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const ownActive: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingBench: CardTarget = { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 };
const board: CardTarget = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
const machine = 'Team Galactic\'s Invention G-107 Technical Machine G RR';

describe('printed classifications in gameplay', () => {
  beforeAll(ensureClientCards);

  it('Poké Turn returns a Pokémon SP and each attached card once', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Arceus V BRS' },
        bench: [{ card: 'Forretress G RR', energy: ['Metal Energy SVE'], tools: ['Bravery Charm PAL'], damage: 20 }],
        hand: ['Poke Turn PL'],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Rookidee SSH' }, deck: padDeck(16) },
    });
    const slot = game.player1.bench[0];
    const [pokemon, energy] = slot.cards;
    const [tool] = slot.tools;
    const [trainer] = game.player1.hand.cards;
    game.overridePrompt('Choose pokemon', () => [ownBench]);

    game.store.dispatch(new PlayCardAction(game.player1.id, 0, board));

    expect(slot.cards).toEqual([]);
    expect(slot.energies.cards).toEqual([]);
    expect(slot.tools).toEqual([]);
    expect(slot.damage).toBe(0);
    expect(game.player1.hand.cards.map(card => card.id).sort()).toEqual([pokemon.id, energy.id, tool.id].sort());
    expect(game.player1.discard.cards).toContain(trainer);
    game.store.cleanup();
  });

  it('retains Pokémon SP eligibility after a real Level-Up', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Gallade E4 RR', energy: ['Psychic Energy SVE'], damage: 20 },
        bench: [{ card: 'Arceus V BRS' }],
        hand: ['Gallade E4 LV.X RR', 'Poke Turn PL'],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Rookidee SSH' }, deck: padDeck(16) },
    });
    const [levelUp, trainer] = game.player1.hand.cards;
    const original = game.player1.active.getPokemonCard()!;
    const energy = game.player1.active.cards.find(card => card.fullName === 'Psychic Energy SVE')!;

    game.overridePrompt('Confirm', () => false);
    game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive));

    expect(game.player1.active.getPokemonCard()).toBe(levelUp as PokemonCard);
    expect(game.player1.active.damage).toBe(20);
    expect(game.player1.active.cards).toContain(energy);
    game.overridePrompt('Choose pokemon', () => [ownActive]);
    game.store.dispatch(new PlayCardAction(game.player1.id, 0, board));

    expect(game.player1.hand.cards).toEqual(jasmine.arrayContaining([levelUp, original, energy]));
    expect(game.player1.discard.cards).toContain(trainer);
    game.store.cleanup();
  });

  it('allows Delta Rainbow Energy to provide any type on a Delta Species Pokémon', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Pidgeot HP', energy: ['Delta Rainbow Energy HP'] },
        bench: [{ card: 'Rookidee SSH', energy: ['Delta Rainbow Energy HP'] }],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
    });
    const delta = new CheckProvidedEnergyEffect(game.player1, game.player1.active);
    const ordinary = new CheckProvidedEnergyEffect(game.player1, game.player1.bench[0]);

    game.store.reduceEffect(game.state, delta);
    game.store.reduceEffect(game.state, ordinary);

    expect(delta.energyMap.map(entry => entry.provides)).toEqual([[CardType.ANY]]);
    expect(ordinary.energyMap.map(entry => entry.provides)).toEqual([[CardType.COLORLESS]]);
    game.store.cleanup();
  });

  it('Rocket’s Hideout adds 20 HP to Dark Pokémon on both sides', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Dark Blastoise TR' },
        bench: [{ card: 'Rookidee SSH' }],
        hand: ['Rocket\'s Hideout N3'],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Dark Blastoise TR20' }, deck: padDeck(16) },
    });
    const slots = [
      [game.player1, game.player1.active],
      [game.player2, game.player2.active],
      [game.player1, game.player1.bench[0]],
    ] as const;

    game.store.dispatch(new PlayCardAction(game.player1.id, 0, board));

    expect(slots.map(([player, slot]) => {
      const hp = new CheckHpEffect(player, slot);
      game.store.reduceEffect(game.state, hp);
      return hp.hp - slot.getPokemonCard()!.hp;
    })).toEqual([20, 20, 0]);
    game.store.cleanup();
  });

  for (const [energyName, recipient] of [
    ['Aqua Energy MA', 'Team Aqua\'s Sealeo DCR'],
    ['Team Rocket\'s Energy DRI', 'Team Rocket\'s Exeggutor ASC'],
    ['Team Rocket\'s Energy DRI', 'Team Rocket\'s Dugtrio ASC'],
  ]) {
    it(`attaches ${energyName} to ${recipient}`, () => {
      const game = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Rookidee SSH' },
          bench: [{ card: recipient }],
          hand: [energyName],
          deck: padDeck(16),
        },
        player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
      });
      const [energy] = game.player1.hand.cards;

      game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownBench));

      expect(game.player1.bench[0].cards).toContain(energy);
      expect(game.player1.hand.cards).not.toContain(energy);
      game.store.cleanup();
    });
  }

  it('rejects owner-specific Special Energy on an ordinary Pokémon', () => {
    for (const energyName of ['Aqua Energy MA', 'Team Rocket\'s Energy DRI']) {
      const game = setupGame({
        turn: 5,
        player1: { active: { card: 'Rookidee SSH' }, hand: [energyName], deck: padDeck(16) },
        player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
      });
      const [energy] = game.player1.hand.cards;
      expect(() => game.store.dispatch(new PlayCardAction(game.player1.id, 0, ownActive)))
        .toThrow(jasmine.objectContaining({ message: GameMessage.CANNOT_PLAY_THIS_CARD }));
      expect(game.player1.hand.cards).toContain(energy);
      expect(game.player1.active.cards).not.toContain(energy);
      game.store.cleanup();
    }
  });

  it('Golden Flame attaches Fire Energy to Benched Ethan’s Sudowoodo', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Ethan\'s Ho-Oh ex DRI' },
        bench: [{ card: 'Ethan\'s Sudowoodo DRI' }, { card: 'Rookidee SSH' }],
        hand: ['Fire Energy SVE', 'Fire Energy SVE'],
        deck: padDeck(16),
      },
      player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
    });
    const energy = game.player1.hand.cards.slice();

    useAbility(game.store, game.state, 0, 'Golden Flame');

    expect(game.player1.bench[0].cards).toEqual(jasmine.arrayContaining(energy));
    expect(game.player1.bench[1].cards.length).toBe(1);
    game.store.cleanup();
  });

  it('Brock’s Training Method can find Brock’s Ninetales', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Rookidee SSH' },
        hand: ['Brock\'s Training Method G1'],
        deck: ['Brock\'s Ninetales G2', 'Arceus V BRS', ...padDeck(14)],
      },
      player2: { active: { card: 'Arceus V BRS' }, deck: padDeck(16) },
    });
    const ninetales = game.player1.deck.cards[0];
    game.overridePrompt('Choose cards', prompt => [(prompt as ChooseCardsPrompt).cards.cards.indexOf(ninetales)]);

    game.store.dispatch(new PlayCardAction(game.player1.id, 0, board));

    expect(game.player1.hand.cards).toEqual([ninetales]);
    game.store.cleanup();
  });

  it('Rob moves both the Technical Machine and a Pokémon Tool into the opponent’s deck', () => {
    const game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Sneasel LA', energy: ['Darkness Energy SVE'] },
        deck: padDeck(16),
      },
      player2: {
        active: { card: 'Arceus V BRS' },
        hand: [machine, 'Bravery Charm PAL', 'Nest Ball SVI'],
        deck: padDeck(16),
      },
    });
    const [technicalMachine, tool, item] = game.player2.hand.cards;
    let revealed = false;
    game.overridePrompt('Show cards', prompt => {
      expect((prompt as ShowCardsPrompt).cards).toEqual([technicalMachine, tool, item]);
      expect(game.player2.hand.cards).toEqual([technicalMachine, tool, item]);
      revealed = true;
      return true;
    });

    useAttack(game.store, game.state, 0, 'Rob');

    expect(revealed).toBe(true);
    expect(game.player2.deck.cards).toEqual(jasmine.arrayContaining([technicalMachine, tool]));
    expect(game.player2.hand.cards).toContain(item);
    expect(game.player2.hand.cards).not.toContain(technicalMachine);
    game.store.cleanup();
  });

  for (const units of [2, 3]) {
    it(`Damage Porter uses three Energy and its SP Pokémon’s damage counters (${units} Energy)`, () => {
      const game = setupGame({
        turn: 5,
        player1: {
          active: { card: 'Forretress G RR', energy: padDeck(units, 'Metal Energy SVE'), damage: 30 },
          hand: [machine],
          deck: padDeck(16),
        },
        player2: {
          active: { card: 'Arceus V BRS' },
          bench: [{ card: 'Rookidee SSH', energy: ['Water Energy SVE'] }],
          deck: padDeck(16),
        },
      });
      const [technicalMachine] = game.player1.hand.cards;
      game.overridePrompt('Choose pokemon', () => [ownActive]);
      game.store.dispatch(new PlayCardAction(game.player1.id, 0, board));
      expect(game.player1.active.cards).toContain(technicalMachine);

      game.overridePrompt('Choose pokemon', () => [opposingBench]);
      if (units === 2) {
        expect(() => useAttack(game.store, game.state, 0, 'Damage Porter')).toThrow(jasmine.objectContaining({ message: GameMessage.NOT_ENOUGH_ENERGY }));
        expect(game.player2.bench[0].damage).toBe(0);
      } else {
        useAttack(game.store, game.state, 0, 'Damage Porter');
        expect(game.player2.bench[0].damage).toBe(30);
        expect(game.player2.active.damage).toBe(0);
      }
      game.store.cleanup();
    });
  }
});

describe('printed deck construction rules', () => {
  beforeAll(ensureClientCards);

  function legal(cards: string[]): boolean {
    return new DeckAnalyser([...cards, ...padDeck(60 - cards.length)]).isValid(Format.UNLIMITED);
  }

  it('allows multiple Diamond & Pearl letter names alongside older Unown', () => {
    expect(legal([
      ...padDeck(4, 'Unown [E] N2'),
      ...padDeck(4, 'Unown [A] DP'),
      ...padDeck(4, 'Unown [B] DP'),
    ])).toBe(true);
  });

  it('enforces the four-copy limit for each Diamond & Pearl Unown letter', () => {
    expect(legal(padDeck(5, 'Unown [A] DP'))).toBe(false);
  });

  it('enforces the shared limit for the registered pre–Diamond & Pearl Unown prints', () => {
    expect(legal([...padDeck(4, 'Unown [E] N2'), 'Unown UF'])).toBe(false);
  });

  it('applies the Arceus Rule to the DP50 promo', () => {
    expect(legal(padDeck(5, 'Arceus DPP'))).toBe(true);
  });

  it('enforces the four-copy limit for other cards regardless of deck order', () => {
    const copies = padDeck(5, 'Rookidee SSH');
    expect(legal(['Arceus Metal AR', ...copies])).toBe(false);
    expect(legal([...copies, 'Arceus Metal AR'])).toBe(false);
  });
});
