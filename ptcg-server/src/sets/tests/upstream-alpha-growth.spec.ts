import { ensureClientCards } from '../../client/cards';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { State } from '../../game/store/state/state';
import { Store } from '../../game/store/store';
import { Effect } from '../../game/store/effects/effect';
import { AfterAttachEnergyFromHandEffect, AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { GameMessage } from '../../game/game-message';
import { PayHandEnergyAttachmentCostEffect } from '../../game/store/effects/game-effects';
import { padDeck, setupGame, SetupGameConfig, SetupGameResult } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const water = 'Water Energy SVE';
const grass = 'Grass Energy SVE';
const psychic = 'Psychic Energy SVE';
const aurora = 'Aurora Energy SSH';
const goodra = 'Goodra FST 197';
const kyogre = 'Primal Kyogre-EX PRC';
const kyogreAOR = 'Primal Kyogre-EX AOR';
const opponent = { active: { card: 'Finneon MT' }, deck: padDeck(6) };
const growthPrints = ['Swampert PRC 36', 'Whiscash PRC 41', 'Gorebyss PRC 52', kyogre, 'Kingdra PRC 108', 'Primal Kyogre-EX PRC 149'];

function pending(state: State) {
  const result = state.prompts.find(prompt => prompt.result === undefined);
  if (!result) throw new Error('Missing pending prompt');
  return result;
}

function resolve(store: Store, raw: unknown) {
  const prompt = pending(store.state);
  const decoded = prompt.decode(raw, store.state);
  if (!prompt.validate(decoded, store.state)) throw new Error('Invalid test prompt result');
  store.dispatch(new ResolvePromptAction(prompt.id, decoded));
}

function attach(store: Store, to = active, handIndex = 0) {
  store.dispatch(new PlayCardAction(store.state.players[0].id, handIndex, to));
}

describe('α Growth and Aurora Energy payment timing', () => {
  beforeAll(ensureClientCards);
  let game: SetupGameResult | undefined;
  let manual: Store | undefined;
  afterEach(() => {
    manual?.cleanup();
    game?.store.cleanup();
  });

  function open(config: SetupGameConfig) {
    game = setupGame(config);
    const store = new Store({ onStateChange: () => undefined });
    store.state = game.state;
    manual = store;
    return { store, owner: game.player1, foe: game.player2 };
  }

  for (const card of growthPrints) {
    it(`${card} attaches two cards before either completion and spends one turn attachment`, () => {
      const { store, owner } = open({ turn: 5,
        player1: { active: { card }, hand: [water, grass, psychic], deck: padDeck(5) }, player2: opponent
      });
      const [first, second] = owner.hand.cards;
      const snapshots: number[][] = [];
      const reduce = store.reduceEffect.bind(store);
      spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AfterAttachEnergyFromHandEffect) snapshots.push(effect.target.energies.cards.map(item => item.id));
        return reduce(state, effect);
      });
      attach(store);
      expect(owner.active.energies.cards).toEqual([]);
      expect(owner.energyPlayedTurn).not.toBe(5);
      const prompt = pending(store.state) as ChooseCardsPrompt;
      expect(prompt.message).toBe(GameMessage.CHOOSE_CARD_TO_ATTACH);
      resolve(store, [prompt.cards.cards.indexOf(second)]);
      expect(snapshots).toEqual([[first.id, second.id], [first.id, second.id]]);
      expect(owner.energyPlayedTurn).toBe(5);
      expect(() => attach(store)).toThrow();
    });
  }

  it('can decline the second card and commit a normal manual attachment', () => {
    const { store, owner } = open({ turn: 5, player1: { active: { card: kyogre }, hand: [water, grass] }, player2: opponent });
    attach(store);
    resolve(store, []);
    expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([water]);
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([grass]);
    expect(owner.energyPlayedTurn).toBe(5);
  });

  it('holds Aurora Energy in hand and saves the turn allowance until the discard is paid', () => {
    const { store, owner } = open({ turn: 5,
      player1: { active: { card: kyogreAOR }, hand: [aurora, water] }, player2: opponent
    });
    const [energy, payment] = owner.hand.cards;
    attach(store);
    expect(owner.active.cards).not.toContain(energy);
    expect(owner.hand.cards).toEqual([energy, payment]);
    expect(owner.energyPlayedTurn).not.toBe(5);
    expect((pending(store.state) as ChooseCardsPrompt).cards.cards).toEqual([payment]);
    resolve(store, [0]);
    expect(owner.discard.cards).toEqual([payment]);
    expect(owner.active.energies.cards).toEqual([energy]);
    expect(owner.energyPlayedTurn).toBe(5);
  });

  it('vetoes a manual attachment with an unpayable Aurora Energy cost', () => {
    const { store } = open({ turn: 5, player1: { active: { card: kyogre }, hand: [aurora] }, player2: opponent });
    expect(() => attach(store)).toThrow();
    const owner = store.state.players[0];
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([aurora]);
    expect(owner.active.energies.cards).toEqual([]);
    expect(owner.energyPlayedTurn).not.toBe(5);
  });

  it('two Aurora Energy cards require two other cards in the same payment', () => {
    const { store, owner } = open({ turn: 5,
      player1: { active: { card: kyogre }, hand: [aurora, aurora, water, grass] }, player2: opponent
    });
    const [first, second, cost1, cost2] = owner.hand.cards;
    attach(store);
    let prompt = pending(store.state) as ChooseCardsPrompt;
    resolve(store, [prompt.cards.cards.indexOf(second)]);
    prompt = pending(store.state) as ChooseCardsPrompt;
    expect(prompt.options.min).toBe(2);
    expect(prompt.cards.cards).toEqual([cost1, cost2]);
    expect(owner.active.energies.cards).toEqual([]);
    resolve(store, [0, 1]);
    expect(owner.discard.cards).toEqual([cost1, cost2]);
    expect(owner.active.energies.cards).toEqual([first, second]);
  });

  it('does not offer the other Energy as an extra when it is needed to pay Aurora’s cost', () => {
    const { store, owner } = open({ turn: 5, player1: { active: { card: kyogre }, hand: [aurora, water] }, player2: opponent });
    attach(store);
    expect((pending(store.state) as ChooseCardsPrompt).message).toBe(GameMessage.CHOOSE_CARD_TO_DISCARD);
    resolve(store, [0]);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([water]);
  });

  it('does not pay half of a two-card discard when an effect removes one payment', () => {
    const { store, owner } = open({ turn: 5,
      player1: { active: { card: kyogre }, hand: [aurora, aurora, water, grass] }, player2: opponent
    });
    const initialHand = [...owner.hand.cards];
    const reduce = store.reduceEffect.bind(store);
    spyOn(store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PayHandEnergyAttachmentCostEffect) effect.cards = effect.cards?.slice(0, 1);
      return reduce(state, effect);
    });
    attach(store);
    resolve(store, [0]);
    resolve(store, [0, 1]);
    expect(owner.hand.cards).toEqual(initialHand);
    expect(owner.active.energies.cards).toEqual([]);
    expect(owner.discard.cards).toEqual([]);
    expect(owner.energyPlayedTurn).not.toBe(5);
  });

  for (const heads of [true, false]) {
    it(`Slimy Room flips before Aurora's payment (${heads ? 'heads' : 'tails'})`, () => {
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      const { store, owner } = open({ turn: 5, player1: { active: { card: kyogreAOR }, hand: [aurora, water] },
        player2: { active: { card: goodra }, deck: padDeck(5) }
      });
      const [energy, cost] = owner.hand.cards;
      attach(store);
      expect(pending(store.state).type).toBe('WaitPrompt');
      expect(owner.hand.cards).toEqual([energy, cost]);
      resolve(store, true);
      if (heads) {
        expect((pending(store.state) as ChooseCardsPrompt).message).toBe(GameMessage.CHOOSE_CARD_TO_DISCARD);
        resolve(store, [0]);
        expect(owner.discard.cards).toEqual([cost]);
        expect(owner.active.energies.cards).toEqual([energy]);
      } else {
        expect(owner.discard.cards).toEqual([energy]);
        expect(owner.hand.cards).toEqual([cost]);
        expect(owner.active.energies.cards).toEqual([]);
      }
      expect(owner.energyPlayedTurn === 5).toBe(heads);
    });
  }

  for (const origin of ['deck', 'discard'] as const) {
    it(`attaches Aurora from ${origin} without paying or flipping`, () => {
      const { store, owner } = open({ turn: 5, player1: { active: { card: kyogre }, [origin]: [aurora] },
        player2: { active: { card: goodra }, deck: padDeck(5) }
      });
      const energy = owner[origin].cards[0] as EnergyCard;
      store.reduceEffect(store.state, new AttachEnergyEffect(owner, energy, owner.active, origin));
      expect(owner.active.energies.cards).toEqual([energy]);
      expect(store.state.prompts.filter(prompt => prompt.result === undefined)).toEqual([]);
    });
  }

  it('a successful card spends the turn attachment even if Slimy Room discards the other card', () => {
    const { store, owner } = open({ turn: 5, player1: { active: { card: kyogre }, hand: [water, grass] },
      player2: { active: { card: goodra }, deck: padDeck(5) }
    });
    spyOn(Math, 'random').and.returnValues(0.9, 0.1);
    attach(store);
    resolve(store, [0]);
    resolve(store, true);
    expect(owner.active.energies.cards).toEqual([]);
    resolve(store, true);
    expect(owner.discard.cards.map(card => card.fullName)).toEqual([water]);
    expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([grass]);
    expect(owner.energyPlayedTurn).toBe(5);
  });

  it('permits two Grass attachments through Celebi’s Forest Breath without spending the normal attachment', () => {
    const { store, owner } = open({ turn: 5, player1: {
      active: { card: 'Celebi TM' }, bench: [{ card: kyogre }], hand: [grass, grass, water], deck: padDeck(5)
    }, player2: opponent });
    store.dispatch(new UseAbilityAction(owner.id, 'Forest Breath', active));
    resolve(store, [{ index: 0, to: bench }]);
    expect(owner.bench[0].energies.cards).toEqual([]);
    resolve(store, [0]);
    expect(owner.bench[0].energies.cards.map(card => card.fullName)).toEqual([grass, grass]);
    expect(owner.energyPlayedTurn).not.toBe(5);
    attach(store);
    expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([water]);
  });

  it('heals from Precious Touch only after its Aurora Energy is paid and attached', () => {
    const { store, owner } = open({ turn: 5, player1: {
      active: { card: 'Sylveon VMAX EVS', energy: [psychic] }, bench: [{ card: kyogre, damage: 140 }], hand: [aurora, water], deck: padDeck(5)
    }, player2: opponent });
    store.dispatch(new AttackAction(owner.id, 'Precious Touch'));
    resolve(store, [{ index: 0, to: bench }]);
    expect(owner.bench[0].damage).toBe(140);
    expect(owner.bench[0].energies.cards).toEqual([]);
    resolve(store, [0]);
    expect(owner.bench[0].damage).toBe(20);
    expect(owner.bench[0].energies.cards.map(card => card.fullName)).toEqual([aurora]);
  });

  it('Crazy Code pays Aurora’s cost without invoking α Growth or spending the manual attachment', () => {
    const { store, owner } = open({ turn: 5, player1: {
      active: { card: kyogre }, bench: [{ card: 'Porygon-Z UNB' }], hand: [aurora, grass, water], deck: padDeck(5)
    }, player2: opponent });
    store.dispatch(new UseAbilityAction(owner.id, 'Crazy Code', bench));
    resolve(store, [{ index: 0, to: active }]);
    expect((pending(store.state) as ChooseCardsPrompt).message).toBe(GameMessage.CHOOSE_CARD_TO_DISCARD);
    resolve(store, [0]);
    expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([aurora]);
    expect(owner.hand.cards.map(card => card.fullName)).toEqual([water]);
    expect(owner.energyPlayedTurn).not.toBe(5);
  });

  it('Moomoo Malt heals once for each Energy before Jet Energy moves the Kyogre', () => {
    const { store, owner } = open({ turn: 5,
      player1: { active: { card: 'Miltank CIN' }, bench: [{ card: kyogre, damage: 200 }], hand: ['Jet Energy PAL', water], deck: padDeck(5) },
      player2: opponent
    });
    attach(store, bench);
    resolve(store, [0]);
    expect(owner.active.getPokemonCard()?.fullName).toBe(kyogre);
    expect(owner.active.damage).toBe(20);
  });

  it('counts both Rainbow Energy cards and both Frozen City triggers together', () => {
    const { store, owner, foe } = open({ turn: 5, player1: { active: { card: kyogre }, hand: ['Rainbow Energy SUM', 'Rainbow Energy SUM'] },
      player2: { ...opponent, hand: ['Frozen City PLF'] }
    });
    foe.hand.moveCardTo(foe.hand.cards[0], foe.stadium);
    attach(store);
    resolve(store, [0]);
    expect(owner.active.energies.cards.length).toBe(2);
    expect(owner.active.damage).toBe(60);
  });

  it('Primarina opens the same simultaneous choice on a Pokémon without α Growth', () => {
    const { store, owner } = open({ turn: 5,
      player1: { active: { card: 'Finneon MT' }, bench: [{ card: 'Primarina LOT' }], hand: [water, grass] }, player2: opponent
    });
    attach(store);
    expect(owner.active.energies.cards).toEqual([]);
    resolve(store, [0]);
    expect(owner.active.energies.cards.map(card => card.fullName)).toEqual([water, grass]);
  });
});
