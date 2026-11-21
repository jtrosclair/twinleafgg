import { ensureClientCards } from '../../client/cards';
import { AttackAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { Prompt } from '../../game/store/prompts/prompt';
import { State } from '../../game/store/state/state';
import { padDeck, setupGame, SetupGameResult } from './test-helpers';

const energy = 'Water Energy SVE';
const shedinja = 'Shedinja LOT';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

const cases = [
  ['Manectric VIV', 'Electrike VIV', ConfirmPrompt],
  ['Banette VIV', 'Shuppet VIV', ConfirmPrompt],
  ['Ninjask VIV', 'Nincada LOT', ConfirmPrompt],
  ['Clefable RCL', 'Clefairy RCL', ConfirmPrompt],
  ['Granbull FST 116', 'Snubbull FST 115', ChooseCardsPrompt],
  ['Feraligatr FST 57', 'Croconaw FST 56', CoinFlipEffect],
  ['Thievul EVS', 'Nickit EVS', ConfirmPrompt],
  ['Ninjask LOT', 'Nincada LOT', ConfirmPrompt],
  ['Pupitar LOT', 'Larvitar LOT', ConfirmPrompt],
  ['Blissey GRI', 'Chansey GRI', ConfirmPrompt],
  ['Hariyama M1L', 'Makuhita M1L', ConfirmPrompt],
  ['Tinkatuff MEG', 'Tinkatink MEG', ConfirmPrompt],
  ['Ninjask M1S', 'Nincada M1S', ConfirmPrompt],
] as const;

function battle(name: string, previous: string, source: 'hand' | 'deck' | 'discard', suppressed = false) {
  const g = setupGame({
    turn: 5,
    player1: {
      active: { card: previous, damage: 10 },
      hand: source === 'hand' ? [name] : [],
      discard: [...(source === 'discard' ? [name] : []), 'Air Balloon SSH', shedinja],
      deck: [...(source === 'deck' ? [name] : []), shedinja, ...padDeck(12)],
    },
    player2: {
      active: { card: suppressed ? 'Wobbuffet PHF' : 'Finneon MT', energy: [energy] },
      bench: [{ card: 'Electrike VIV' }],
      hand: ['Manectric VIV', energy],
      deck: padDeck(12),
    },
  });
  const { player2 } = g;
  player2.hand.moveCardTo(player2.hand.cards[0], player2.bench[0]);
  return g;
}

function playFromHand(g: SetupGameResult) {
  const { store, player1 } = g;
  player1.canEvolve = true;
  player1.active.pokemonPlayedTurn = 1;
  store.dispatch(new PlayCardAction(player1.id, 0, {
    player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0
  }));
}

describe('Printed hand evolution Abilities', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  afterEach(() => game?.store.cleanup());

  for (const [name, previous, PromptType] of cases) {
    it(`${name} offers its effect only after the card reaches play`, () => {
      game = battle(name, previous, 'hand');
      const { store, state, player1 } = game;
      const card = player1.hand.cards[0] as PokemonCard;
      const staged: boolean[] = [];
      const recordEvolution = () => {
        staged.push(player1.active.getPokemonCard() === card && !player1.hand.cards.includes(card));
      };
      if (PromptType === CoinFlipEffect) {
        const reduceEffect = store.reduceEffect.bind(store);
        spyOn(store, 'reduceEffect').and.callFake((current: State, effect: Effect) => {
          if (effect instanceof CoinFlipEffect) recordEvolution();
          return reduceEffect(current, effect);
        });
      } else {
        const prompt = store.prompt.bind(store);
        spyOn(store, 'prompt').and.callFake((current: State, offered: Prompt<unknown>[] | Prompt<unknown>, then: (results: unknown) => void) => {
          if (offered instanceof PromptType) recordEvolution();
          return prompt(current, offered, then);
        });
      }
      store.reduceEffect(state, new EvolveEffect(player1, player1.active, card));
      expect(staged).toEqual([true]);
      expect(player1.active.getPokemonCard()).toBe(card);
    });

    for (const zone of ['deck', 'discard'] as const) {
      it(`${name} evolves from ${zone} without triggering`, () => {
        game = battle(name, previous, zone);
        const { store, state, player1, player2 } = game;
        const card = player1[zone].cards[0] as PokemonCard;
        const deck = player1.deck.cards.filter(other => other !== card);
        const opposingDeck = player2.deck.cards.slice();
        store.reduceEffect(state, new EvolveEffect(player1, player1.active, card, player1[zone]));
        expect(player1.active.getPokemonCard()).toBe(card);
        expect(state.prompts.filter(offered => offered.result === undefined)).toEqual([]);
        expect(player1.deck.cards).toEqual(deck);
        expect(player1.hand.cards).toEqual([]);
        expect(player2.deck.cards).toEqual(opposingDeck);
      });
    }
  }

  for (const [name, previous] of cases.filter(([name]) => ['Manectric VIV', 'Thievul EVS', 'Ninjask M1S'].includes(name))) {
    it(`${name} is suppressed by Bide Barricade after evolving`, () => {
      game = battle(name, previous, 'hand', true);
      const { store, state, player1 } = game;
      const card = player1.hand.cards[0] as PokemonCard;
      store.reduceEffect(state, new EvolveEffect(player1, player1.active, card));
      expect(player1.active.getPokemonCard()).toBe(card);
      expect(state.prompts.filter(prompt => prompt.result === undefined)).toEqual([]);
      expect(player1.hand.cards).toEqual([]);
    });
  }

  for (const accept of [true, false]) {
    it(`High Speed respects the player's choice (${accept}) on the normal play action`, () => {
      game = battle('Manectric VIV', 'Electrike VIV', 'hand');
      const { player1, overridePrompt } = game;
      const before = player1.deck.cards.slice();
      const confirm = jasmine.createSpy('High Speed').and.returnValue(accept);
      overridePrompt('Confirm', confirm);
      playFromHand(game);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(player1.hand.cards).toEqual(accept ? before.slice(0, 3) : []);
      expect(player1.deck.cards).toEqual(accept ? before.slice(3) : before);
    });
  }

  it('Moonlit Miracle can evolve Electrike from the top of the deck without drawing cards', () => {
    game = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Clefable BRS 54', energy: [energy] },
        bench: [{ card: 'Electrike VIV' }],
        deck: ['Manectric VIV', ...padDeck(12)],
      },
      player2: { active: { card: 'Finneon MT' }, deck: padDeck(12) },
    });
    const { store, player1, overridePrompt } = game;
    spyOn(Math, 'random').and.returnValue(0.1);
    const manectric = player1.deck.cards[0] as PokemonCard;
    const confirm = jasmine.createSpy('High Speed').and.returnValue(true);
    overridePrompt('Confirm', confirm);
    overridePrompt('Choose pokemon', () => [ownBench]);
    overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(manectric)]);
    store.dispatch(new AttackAction(player1.id, 'Moonlit Miracle'));
    expect(player1.bench[0].getPokemonCard()).toBe(manectric);
    expect(player1.deck.cards.length).toBe(12);
    expect(player1.hand.cards).toEqual([]);
    expect(confirm).not.toHaveBeenCalled();
  });

  it('Off-turn hand evolution does not offer High Speed', () => {
    game = battle('Manectric VIV', 'Electrike VIV', 'hand');
    const { store, state, player1 } = game;
    state.activePlayer = 1;
    const card = player1.hand.cards[0] as PokemonCard;
    store.reduceEffect(state, new EvolveEffect(player1, player1.active, card));
    expect(player1.active.getPokemonCard()).toBe(card);
    expect(state.prompts.filter(prompt => prompt instanceof ConfirmPrompt && prompt.result === undefined)).toEqual([]);
    expect(player1.hand.cards).toEqual([]);
  });

  it('leaves the evolved Tinkatuff in play when Haphazard Hammer is declined', () => {
    game = battle('Tinkatuff MEG', 'Tinkatink MEG', 'hand');
    const { player1, player2, overridePrompt } = game;
    const confirm = jasmine.createSpy('Haphazard Hammer').and.returnValue(false);
    overridePrompt('Confirm', confirm);
    spyOn(Math, 'random').and.returnValue(0.1);
    const energyCard = player2.active.energies.cards[0];
    playFromHand(game);
    expect(confirm).toHaveBeenCalledTimes(1);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Tinkatuff MEG');
    expect(player2.active.energies.cards).toEqual([energyCard]);
  });

  for (const heads of [true, false]) {
    it(`uses the Haphazard Hammer coin result (${heads}) after accepting the Ability`, () => {
      game = battle('Tinkatuff MEG', 'Tinkatink MEG', 'hand');
      const { player2, overridePrompt } = game;
      const energyCard = player2.active.energies.cards[0];
      overridePrompt('Confirm', () => true);
      overridePrompt('Choose cards', offered => [(offered as ChooseCardsPrompt).cards.cards.indexOf(energyCard)]);
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      playFromHand(game);
      expect(player2.active.energies.cards).toEqual(heads ? [] : [energyCard]);
      expect(player2.discard.cards).toEqual(heads ? [energyCard] : []);
    });
  }

  for (const accept of [true, false]) {
    it(`Cast-Off Shell leaves the deck untouched when declined (${!accept})`, () => {
      game = battle('Ninjask M1S', 'Nincada M1S', 'hand');
      const { player1, overridePrompt } = game;
      const before = player1.deck.cards.slice();
      const confirm = jasmine.createSpy('Cast-Off Shell').and.returnValue(accept);
      overridePrompt('Confirm', confirm);
      playFromHand(game);
      expect(confirm).toHaveBeenCalledTimes(1);
      expect(player1.active.getPokemonCard()?.fullName).toBe('Ninjask M1S');
      if (accept) {
        expect(player1.bench[0].getPokemonCard()?.id).toBe(before[0].id);
        expect(player1.deck.cards.length).toBe(before.length - 1);
      } else {
        expect(player1.bench[0].getPokemonCard()).toBeUndefined();
        expect(player1.deck.cards).toEqual(before);
      }
    });
  }

  it('requires the Rowdy coin flip after Feraligatr evolves from hand', () => {
    game = battle('Feraligatr FST 57', 'Croconaw FST 56', 'hand');
    const { player1, player2 } = game;
    spyOn(Math, 'random').and.returnValue(0.1);
    const topFive = player2.deck.cards.slice(0, 5);
    playFromHand(game);
    expect(player1.active.getPokemonCard()?.fullName).toBe('Feraligatr FST 57');
    expect(player2.discard.cards).toEqual(topFive);
  });

  for (const [name, previous] of [['Ninjask VIV', 'Nincada LOT'], ['Ninjask M1S', 'Nincada M1S']]) {
    it(`${name} evolves normally when its Bench has no space for Shedinja`, () => {
      game = battle(name, previous, 'hand');
      const { store, state, player1 } = game;
      for (const slot of player1.bench) {
        player1.deck.moveCardTo(player1.deck.cards[1], slot);
      }
      const card = player1.hand.cards[0] as PokemonCard;
      expect(() => store.reduceEffect(state, new EvolveEffect(player1, player1.active, card))).not.toThrow();
      expect(player1.active.getPokemonCard()).toBe(card);
      expect(state.prompts.filter(prompt => prompt.result === undefined)).toEqual([]);
    });
  }
});
