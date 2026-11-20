import { ClientSimulator } from '../../client/simulator';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { GameMessage } from '../../game/game-message';
import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Store } from '../../game/store/store';
import { Base64 } from '../../utils/base64';
import { padDeck, setupGame } from './test-helpers';

const empoleon = 'Empoleon V BST';
const klefki = 'Klefki SVI';
const mew = 'Mew ex MEW';
const flutter = 'Flutter Mane TEF';
const bruteBonnet = 'Brute Bonnet PAR';
const board = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BOARD, index: 0 };
const active = { ...board, slot: SlotType.ACTIVE };

function expectAbility(store: StoreLike, state: State, owner: number, enabled: boolean, card?: PokemonCard): void {
  const player = state.players[owner];
  const recipient = card ?? player.active.getPokemonCard()!;
  const power = recipient.powers[0];
  expect(power).toBeDefined();
  const discovery = new CheckPokemonPowersEffect(player, recipient);
  store.reduceEffect(state, discovery);
  expect(discovery.powers.includes(power)).toBe(enabled);
  const probe = () => store.reduceEffect(state, new PowerEffect(player, power, recipient));
  if (enabled) {
    expect(probe).not.toThrow();
  } else {
    expect(probe).toThrow(jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_ABILITY }));
  }
}

describe('Active Ability lock precedence', () => {
  for (const first of [0, 1]) {
    it(`honors the first player when starting Empoleon and Klefki reveal together (${first})`, () => {
      const { store, state } = setupGame({
        turn: 1, player1: { active: { card: empoleon } }, player2: { active: { card: klefki } }
      });
      state.activePlayer = first;
      // Query the second player's Ability first to rule out reducer order.
      expectAbility(store, state, 1, first === 1);
      expectAbility(store, state, 0, first === 0);
    });
  }

  it("keeps the earlier opposing lock when the turn player switches in Klefki", () => {
    const { store, player1 } = setupGame({
      turn: 5,
      player1: { active: { card: mew }, bench: [{ card: klefki }], hand: ['Switch SVI'] },
      player2: { active: { card: empoleon } }
    });
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expect(store.state.players[0].active.getPokemonCard()?.fullName).toBe(klefki);
    expectAbility(store, store.state, 0, false);
    expectAbility(store, store.state, 1, true);
  });

  it('records a later switch even when the switching caller omits the Store', () => {
    const { store, player1, player2 } = setupGame({
      turn: 5, player1: { active: { card: empoleon }, bench: [{ card: mew }] },
      player2: { active: { card: klefki } }
    });
    expectAbility(store, store.state, 0, true);
    player1.switchPokemon(player1.bench[0]);
    player1.switchPokemon(player1.bench[0]);
    expectAbility(store, store.state, 0, false);
    expectAbility(store, store.state, 1, true);
    expect(store.state.activeAbilityLockOrder?.map(entry => entry.playerId)).toEqual([player2.id, player1.id]);
  });

  it('retains precedence after a turn change and through two compact simulator snapshots', () => {
    const { store, state, player1 } = setupGame({
      turn: 1,
      player1: { active: { card: klefki }, deck: padDeck(5) },
      player2: { active: { card: empoleon }, deck: padDeck(5) }
    });
    const cards = state.players.flatMap(player => [player.active, ...player.bench, player.deck, ...player.prizes]
      .flatMap(list => list.cards));
    cards.forEach((card, index) => { card.id = index; });
    state.cardNames = cards.map(card => card.fullName);
    expectAbility(store, state, 0, true);
    store.dispatch(new PassTurnAction(player1.id));
    expect(store.state.activePlayer).toBe(1);
    const sim = new ClientSimulator();
    const restored = new ClientSimulator();
    try {
      sim.loadSnapshot({ stateData: new Base64().encode(new StateSerializer().serialize(store.state)) });
      restored.loadSnapshot({ stateData: sim.getStateData() });
      const checkStore = new Store({ onStateChange: () => undefined });
      checkStore.restoreState(restored.state);
      expectAbility(checkStore, restored.state, 0, true);
      expectAbility(checkStore, restored.state, 1, false);
    } finally {
      sim.cleanup();
      restored.cleanup();
    }
  });

  it('lets a later lock apply if the earlier source is suppressed by a Stadium', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: empoleon }, hand: ['Path to the Peak CRE'] },
      player2: { active: { card: klefki } }
    });
    expectAbility(store, store.state, 1, false);
    store.dispatch(new PlayCardAction(player1.id, 0, board));
    expectAbility(store, store.state, 1, true);
  });

  it('lets a protected Klefki retain its lock even when Empoleon was earlier', () => {
    const { store, state } = setupGame({
      turn: 5, player1: { active: { card: empoleon } },
      player2: { active: { card: klefki, tools: ['Stealthy Hood UNB'] } }
    });
    expectAbility(store, state, 0, false);
    expectAbility(store, state, 1, true);
  });

  it('does not let the older Basic-only lock suppress an evolved Neutralizing Gas', () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Koffing RCL' }, hand: ['Galarian Weezing SHF'] },
      player2: { active: { card: klefki } }
    });
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expectAbility(store, store.state, 0, true);
    expectAbility(store, store.state, 1, false);
  });

  it('promotes the next player first after both Actives are Knocked Out by Explosion', () => {
    const { store, player1 } = setupGame({
      turn: 5,
      player1: {
        active: { card: 'Electrode FST 88', energy: ['Lightning Energy SVE'] },
        bench: [{ card: empoleon }],
        deck: padDeck(5)
      },
      player2: { active: { card: mew, damage: 60 }, bench: [{ card: klefki }], deck: padDeck(5) }
    });
    store.dispatch(new AttackAction(player1.id, 'Explosion'));
    expect(store.state.players.map(player => player.active.getPokemonCard()?.fullName)).toEqual([empoleon, klefki]);
    expectAbility(store, store.state, 0, false);
    expectAbility(store, store.state, 1, true);
  });

  it('applies Midnight Fluttering only to the opposing Active and honors the earlier lock', () => {
    const { store, state, player2 } = setupGame({
      turn: 5, player1: { active: { card: flutter } },
      player2: { active: { card: empoleon }, bench: [{ card: bruteBonnet }] }
    });
    expectAbility(store, state, 0, true);
    expectAbility(store, state, 1, false);
    const bonnet = player2.bench[0].getPokemonCard()!;
    const discovery = new CheckPokemonPowersEffect(player2, bonnet);
    store.reduceEffect(state, discovery);
    expect(discovery.powers).toEqual(bonnet.powers);
  });

  it('retains both Abilities when two Klefki face each other', () => {
    const { store, state } = setupGame({
      turn: 5, player1: { active: { card: klefki } }, player2: { active: { card: klefki } }
    });
    expectAbility(store, state, 0, true);
    expectAbility(store, state, 1, true);
  });

  it('limits Bide Barricade to non-Psychic Pokémon in play, hand and discard', () => {
    const squawk = 'Squawkabilly ex PAL';
    const { store, state, player2 } = setupGame({
      turn: 5, player1: { active: { card: 'Wobbuffet GEN' } },
      player2: { active: { card: mew }, bench: [{ card: squawk }], hand: [squawk], discard: [squawk], deck: [squawk] }
    });
    const choices = (card: PokemonCard) => {
      const check = new CheckPokemonPowersEffect(player2, card);
      store.reduceEffect(state, check);
      return check.powers;
    };
    expect(choices(player2.active.getPokemonCard()!)).not.toEqual([]);
    expect(choices(player2.bench[0].getPokemonCard()!)).toEqual([]);
    expect(choices(player2.hand.cards[0] as PokemonCard)).toEqual([]);
    expect(choices(player2.discard.cards[0] as PokemonCard)).toEqual([]);
    expect(choices(player2.deck.cards[0] as PokemonCard)).not.toEqual([]);
  });
});
