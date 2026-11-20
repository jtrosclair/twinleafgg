import { GameMessage } from '../../game/game-message';
import { RetreatAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { setupGame } from './test-helpers';

const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { ...active, slot: SlotType.BENCH };
const empoleon = 'Empoleon V BST';
const comfey = 'Comfey LOR';
const mew = 'Mew ex MEW';
const bonnet = 'Brute Bonnet PAR';
const capsule = 'Ancient Booster Energy Capsule PAR';
const psychic = 'Psychic Energy SVE';

describe("Empoleon V's Emperor's Eyes", () => {
  for (const printing of [empoleon, 'Empoleon V2 BST', 'Empoleon V3 BST']) {
    for (const target of [active, bench]) {
      it(`${printing} removes an opposing Basic's Ability at ${target.slot}`, () => {
        const { store, state, player1 } = setupGame({
          turn: 5,
          player1: {
            active: target === active ? { card: bonnet, tools: [capsule] } : { card: mew },
            bench: target === bench ? [{ card: bonnet, tools: [capsule] }] : []
          },
          player2: { active: { card: printing } }
        });
        const slot = target === active ? player1.active : player1.bench[0];
        const card = slot.getPokemonCard()!;
        const check = new CheckPokemonPowersEffect(player1, card);
        store.reduceEffect(state, check);
        expect(check.powers).toEqual([]);
        expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Toxic Powder', target)))
          .toThrow(jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_ABILITY }));
        expect(store.state.players[0].active.specialConditions).toEqual([]);
        expect(store.state.players[1].active.specialConditions).toEqual([]);
      });
    }
  }

  it('leaves its own Basics and opposing Rule Box and Evolution Pokémon alone', () => {
    const { store, state, player1, player2 } = setupGame({
      turn: 5,
      player1: { active: { card: mew }, bench: [{ card: 'Kirlia SIT' }, { card: 'Radiant Greninja ASR' }, { card: 'Tapu Koko Prism Star TEU' }] },
      player2: { active: { card: empoleon }, bench: [{ card: comfey }] }
    });
    for (const [player, slot] of [[player1, player1.active], ...player1.bench.slice(0, 3).map(slot => [player1, slot] as const),
      [player2, player2.bench[0]]] as const) {
      const card = slot.getPokemonCard()!;
      const check = new CheckPokemonPowersEffect(player, card);
      store.reduceEffect(state, check);
      expect(check.powers).toEqual(card.powers);
    }
  });

  it('leaves a Basic protected by Stealthy Hood and resumes suppression when it is removed', () => {
    const { store, state, player1 } = setupGame({
      turn: 5, player1: { active: { card: comfey, tools: ['Stealthy Hood UNB'] } },
      player2: { active: { card: empoleon } }
    });
    const card = player1.active.getPokemonCard()!;
    const check = () => {
      const discovery = new CheckPokemonPowersEffect(player1, card);
      store.reduceEffect(state, discovery);
      return discovery.powers;
    };
    expect(check().map(power => power.name)).toEqual(['Flower Selecting']);
    player1.discard.cards.push(...player1.active.tools.splice(0));
    expect(check()).toEqual([]);
  });

  it('does not remove Hide ’n’ Sneak through its target protection', () => {
    const { store, state, player1 } = setupGame({
      turn: 5, player1: { active: { card: 'Shuppet M5' } },
      player2: { active: { card: empoleon } }
    });
    const card = player1.active.getPokemonCard()!;
    const check = new CheckPokemonPowersEffect(player1, card);
    store.reduceEffect(state, check);
    expect(check.powers).toEqual(card.powers);
    expect(() => store.reduceEffect(state, new PowerEffect(player1, card.powers[0], card))).not.toThrow();
  });

  it('stops applying the lock as soon as Empoleon leaves the Active Spot', () => {
    const { store, state, player1, player2 } = setupGame({
      turn: 5, player1: { active: { card: comfey } },
      player2: { active: { card: empoleon }, bench: [{ card: mew }] }
    });
    player2.switchPokemon(player2.bench[0], store, state);
    const card = player1.active.getPokemonCard()!;
    const check = new CheckPokemonPowersEffect(player1, card);
    store.reduceEffect(state, check);
    expect(check.powers).toEqual(card.powers);
  });

  it('lets an Empoleon under Path to the Peak be affected by Toxic Powder', () => {
    const { store, player1 } = setupGame({
      turn: 5,
      player1: { active: { card: bonnet, tools: [capsule] }, hand: ['Path to the Peak CRE'] },
      player2: { active: { card: empoleon } }
    });
    store.dispatch(new PlayCardAction(player1.id, 0, { ...active, slot: SlotType.BOARD }));
    store.dispatch(new UseAbilityAction(player1.id, 'Toxic Powder', active));
    expect(store.state.players[1].active.specialConditions.length).toBe(1);
  });

  it("lets the opponent retreat when Emperor's Eyes removes Block", () => {
    const { store, player1 } = setupGame({
      turn: 5, player1: { active: { card: empoleon, energy: [psychic, psychic] }, bench: [{ card: mew }] },
      player2: { active: { card: 'Snorlax PGO' } }
    });
    store.dispatch(new RetreatAction(player1.id, 0));
    expect(store.state.players[0].active.getPokemonCard()?.fullName).toBe(mew);
  });

  it('leaves out-of-play Abilities and non-Ability powers alone', () => {
    const pokepower = { name: 'Poké-Power probe', powerType: PowerType.POKEPOWER, text: '' };
    const { store, state, player1 } = setupGame({
      turn: 5, player1: { active: { card: comfey }, hand: [bonnet], discard: [comfey] },
      player2: { active: { card: empoleon } }
    });
    for (const card of [...player1.hand.cards, ...player1.discard.cards] as PokemonCard[]) {
      const probe = { ...card.powers[0], name: 'Availability probe' };
      expect(() => store.reduceEffect(state, new PowerEffect(player1, probe, card))).not.toThrow();
    }
    expect(() => store.reduceEffect(state, new PowerEffect(player1, pokepower, player1.active.getPokemonCard()!))).not.toThrow();
  });
});
