import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { AfterEvolveEffect, CheckEvolveEffect, EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { Format, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { ClientSimulator } from '../../client/simulator';
import { StateSerializer } from '../../game/serializer/state-serializer';
import { Base64 } from '../../utils/base64';
import { Wobbuffet } from '../set-phantom-forces/wobbuffet';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility } from './card-test-helpers';

function game(hood = false) {
  return setupGame({ turn: 5,
    player1: { active: { card: 'Charmeleon BS', tools: hood ? ['Stealthy Hood UNB'] : [] }, hand: ['Charizard ex OBF'], deck: padDeck(10) },
    player2: { active: { card: 'Wobbuffet PHF' }, deck: padDeck(10) }
  });
}
function evolve(g: ReturnType<typeof game>) {
  const card = g.player1.hand.cards.find(c => c.fullName === 'Charizard ex OBF') as PokemonCard;
  g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card));
  return card;
}
describe('evolution ability checks from in-play target', () => {
  it('opponent Bide Barricade blocks unprotected Charizard ex ability', () => {
    const g = game(); const card = evolve(g);
    expect(g.player1.active.getPokemonCard()).toBe(card);
    expect(g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(0);
  });
  it('Stealthy Hood protects Charizard ex against opposing Bide Barricade as it evolves', () => {
    const g = game(true); const card = evolve(g);
    expect(g.player1.active.getPokemonCard()).toBe(card);
    expect(g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(1);
  });
  it('rejects evolution under Archeops without moving the evolution card', () => {
    const g = setupGame({ turn: 5, player1: { active: { card: 'Bulbasaur BS' }, hand: ['Ivysaur BS'], deck: padDeck(10) }, player2: { active: { card: 'Archeops NVI' }, deck: padDeck(10) } });
    const card = g.player1.hand.cards[0] as PokemonCard;
    const old = g.player1.active.getPokemonCard();
    const attempt = new EvolveEffect(g.player1, g.player1.active, card);
    expect(() => g.store.reduceEffect(g.state, attempt)).toThrow();
    expect(g.player1.hand.cards).toContain(card);
    expect(g.player1.active.getPokemonCard()).toBe(old);
  });
  it('creates no ability prompt if Archeops rejects Charizard evolution', () => {
    const g = setupGame({ turn: 5, player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF'], deck: padDeck(10) }, player2: { active: { card: 'Archeops NVI' }, deck: padDeck(10) } });
    const card = g.player1.hand.cards[0] as PokemonCard;
    const attempt = new EvolveEffect(g.player1, g.player1.active, card);
    expect(() => g.store.reduceEffect(g.state, attempt)).toThrow();
    expect(g.player1.hand.cards).toContain(card);
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
  it('does not deal Po Town damage when Archeops rejects the attempted evolution', () => {
    const g = setupGame({ turn: 5, player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF', 'Po Town BUS'], deck: padDeck(10) }, player2: { active: { card: 'Archeops NVI' }, deck: padDeck(10) } });
    const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
    g.player1.hand.moveCardTo(stadium, g.player1.stadium);
    const card = g.player1.hand.cards.find(c => c.fullName === 'Charizard ex OBF') as PokemonCard;
    const old = g.player1.active.getPokemonCard();
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
    expect(g.player1.active.getPokemonCard()).toBe(old);
    expect(g.player1.active.damage).toBe(0);
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
    expect(g.player1.active.triggerEvolutionAnimation).toBe(false);
  });
  for (const blocker of ['Archeops NVI', 'Aerodactyl FO', 'Dracovish DAA']) {
    it(`preflights ${blocker} before Po Town can deal damage`, () => {
      const g = setupGame({ turn: 5, player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF', 'Po Town BUS'], deck: padDeck(10) }, player2: { active: { card: blocker }, deck: padDeck(10) } });
      const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
      g.player1.hand.moveCardTo(stadium, g.player1.stadium);
      const card = g.player1.hand.cards[0] as PokemonCard;
      expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
      expect(g.player1.active.damage).toBe(0);
      expect(g.player1.hand.cards).toContain(card);
      expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
    });
  }
  const markedBlockers = [
    { card: 'Banette ROS 32', marker: 'BANETTE_ROS_BLOCK_EVOLVE_MARKER', onPlayer: false },
    { card: 'Mandibuzz FST 173', marker: 'MANDIBUZZ_FST_BONE_BLOCK_MARKER', onPlayer: false },
    { card: 'Spiritomb PHF', marker: 'SPIRITOMB_PHF_BLOCK_EVOLVE_MARKER', onPlayer: false },
    { card: 'Alolan Golem-GX CIN', marker: 'ALOLAN_GOLEM_GX_BLOCK_CARDS', onPlayer: true },
    { card: 'Chimecho CIN', marker: 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER', onPlayer: true }
  ];
  for (const blocker of markedBlockers) {
    it(`preflights ${blocker.card} before on-evolve side effects`, () => {
      if (blocker.card.endsWith('ROS 32')) getCardByName('Silcoon ROS');
      if (blocker.card.endsWith('FST 173')) getCardByName('Mudkip FST');
      const g = setupGame({ turn: 5, player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF', 'Po Town BUS'], deck: padDeck(10) }, player2: { active: { card: blocker.card }, deck: padDeck(10) } });
      const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
      g.player1.hand.moveCardTo(stadium, g.player1.stadium);
      const source = g.player2.active.getPokemonCard()!;
      (blocker.onPlayer ? g.player1.marker : g.player1.active.marker).addMarker(blocker.marker, source);
      const card = g.player1.hand.cards[0] as PokemonCard;
      expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
      expect(g.player1.active.damage).toBe(0);
      expect(g.player1.hand.cards).toContain(card);
      expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
    });
  }
  for (const blocker of ['Archeops NVI', 'Aerodactyl FO', 'Dracovish DAA']) {
    it(`allows deck evolution through the hand-only ${blocker} restriction`, () => {
      const g = setupGame({ turn: 5, player1: { active: { card: 'Glaceon V EVS' }, deck: ['Glaceon VMAX EVS', ...padDeck(10)] }, player2: { active: { card: blocker }, deck: padDeck(10) } });
      const card = g.player1.deck.cards[0] as PokemonCard;
      g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.deck));
      expect(g.player1.active.getPokemonCard()).toBe(card);
    });
  }
  for (const blocker of markedBlockers) {
    it(`allows deck evolution through the hand-only ${blocker.card} restriction`, () => {
      if (blocker.card.endsWith('ROS 32')) getCardByName('Silcoon ROS');
      if (blocker.card.endsWith('FST 173')) getCardByName('Mudkip FST');
      const g = setupGame({ turn: 5, player1: { active: { card: 'Glaceon V EVS' }, deck: ['Glaceon VMAX EVS', ...padDeck(10)] }, player2: { active: { card: blocker.card }, deck: padDeck(10) } });
      const source = g.player2.active.getPokemonCard()!;
      (blocker.onPlayer ? g.player1.marker : g.player1.active.marker).addMarker(blocker.marker, source);
      const card = g.player1.deck.cards[0] as PokemonCard;
      g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.deck));
      expect(g.player1.active.getPokemonCard()).toBe(card);
    });
  }
  it('preflights Palafin ex’s own evolution restriction before Po Town', () => {
    const g = setupGame({ turn: 5, player1: { active: { card: 'Finizen TWM' }, hand: ['Palafin ex TWM', 'Po Town BUS'], deck: padDeck(10) }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
    g.player1.hand.moveCardTo(stadium, g.player1.stadium);
    const card = g.player1.hand.cards[0] as PokemonCard;
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.hand.cards).toContain(card);
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
  it('rejects before reactions when multiple evolution blockers are active', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF', 'Po Town BUS'], deck: padDeck(10) },
      player2: { active: { card: 'Dracovish DAA' }, bench: [{ card: 'Archeops NVI' }], deck: padDeck(10) }
    });
    const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
    g.player1.hand.moveCardTo(stadium, g.player1.stadium);
    const card = g.player1.hand.cards[0] as PokemonCard;
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
    expect(g.player1.active.damage).toBe(0);
    expect(g.player1.hand.cards).toContain(card);
    expect(g.player1.active.triggerEvolutionAnimation).toBe(false);
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
  it('does not mutate or prompt from an unrelated Palafin when preflight rejects', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Palafin TWM' }, bench: [{ card: 'Bulbasaur BS' }], hand: ['Ivysaur BS'], deck: padDeck(10) },
      player2: { active: { card: 'Archeops NVI' }, deck: padDeck(10) }
    });
    g.player1.active.getPokemonCard()!.movedToActiveThisTurn = true;
    const card = g.player1.hand.cards[0] as PokemonCard;
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.bench[0], card))).toThrow();
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
    expect(g.player1.marker.markers.length).toBe(0);
  });
  it('does not leak clone-only Palafin prompts into an accepted evolution', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Palafin TWM' }, bench: [{ card: 'Bulbasaur BS' }], hand: ['Ivysaur BS'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    g.player1.active.getPokemonCard()!.movedToActiveThisTurn = true;
    const card = g.player1.hand.cards[0] as PokemonCard;
    g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.bench[0], card));
    expect(g.player1.bench[0].getPokemonCard()).toBe(card);
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(1);
    expect(g.player1.marker.markers.length).toBe(1);
  });
  it('rejects a preflight cancellation rather than silently continuing', () => {
    const g = game(false);
    class Canceller extends PokemonCard {
      public name = 'Cancel'; public fullName = 'Cancel TEST'; public set = 'TEST';
      public reduceEffect(_store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof CheckEvolveEffect) effect.preventDefault = true;
        return state;
      }
    }
    g.player2.bench[0].cards = [new Canceller()];
    const card = g.player1.hand.cards[0] as PokemonCard;
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).toThrow();
    expect(g.player1.hand.cards).toContain(card);
    expect(g.player1.active.getPokemonCard()!.name).toBe('Charmeleon');
  });
  it('uses the current format for Trainer overrides in both the probe and live state', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF', 'Po Town BUS'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const stadium = g.player1.hand.cards.find(card => card.fullName === 'Po Town BUS')!;
    g.player1.hand.moveCardTo(stadium, g.player1.stadium);
    (g.store as any).handler.gameSettings = {format: Format.RETRO};
    (g.store as any).handler.format = Format.RETRO;
    class FormatRequired extends PokemonCard {
      public name = 'Format Required'; public fullName = 'Format Required TEST'; public set = 'TEST';
      public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof CheckEvolveEffect && (store as any).handler.format !== Format.RETRO) {
          throw new Error('Preflight lost handler format');
        }
        return state;
      }
    }
    g.player1.bench[0].cards = [new FormatRequired()];
    const overrides = require('../../game/store/card/card-effect-overrides');
    const lookup = spyOn(overrides, 'getOverriddenReduceEffect').and.callThrough();
    evolve(g);
    const formats = lookup.calls.allArgs().filter((args: any[]) => args[0].fullName === 'Po Town BUS').map((args: any[]) => args[1]);
    expect(formats.length).toBeGreaterThan(1);
    expect(formats.every((format: Format) => format === Format.RETRO)).toBe(true);
  });
  it('does not re-run a disabled blocker’s permission probe after accepted preflight', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmeleon BS' }, hand: ['Charizard ex OBF'], deck: padDeck(10) },
      player2: { active: { card: 'Wobbuffet PHF' }, bench: [{ card: 'Archeops NVI' }], deck: padDeck(10) }
    });
    const wobbuffet = spyOn(Wobbuffet.prototype, 'reduceEffect').and.callThrough();
    evolve(g);
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Charizard ex OBF');
    const probes = wobbuffet.calls.allArgs().filter(args => args[2] instanceof PowerEffect
      && args[2].card.fullName === 'Archeops NVI').length;
    expect(probes).toBe(1);
  });
  it('does not trigger a hand-only Ability for an evolution from the deck', () => {
    const g = game(true);
    const card = g.player1.hand.cards[0] as PokemonCard;
    g.player1.hand.moveCardTo(card, g.player1.deck);
    g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.deck));
    expect(g.player1.active.getPokemonCard()).toBe(card);
    expect(g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(0);
  });
  it('accepts an already-staged card without a hand-play Ability trigger', () => {
    const g = game(true);
    const card = g.player1.hand.cards[0] as PokemonCard;
    g.player1.hand.moveCardTo(card, g.player1.active);
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card))).not.toThrow();
    expect(g.player1.active.getPokemonCard()).toBe(card);
    expect(g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(0);
  });
  it('leaves a deck-sourced evolution in its original position when rejected', () => {
    const g = setupGame({ turn: 5, player1: { active: { card: 'Finizen TWM' }, deck: ['Palafin ex TWM', ...padDeck(10)] }, player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) } });
    const card = g.player1.deck.cards[0] as PokemonCard;
    const before = g.player1.deck.cards.slice();
    expect(() => g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.deck))).toThrow();
    expect(g.player1.deck.cards).toEqual(before);
    expect(g.player1.active.getPokemonCard()!.name).toBe('Finizen');
    expect(g.state.prompts.filter(p => p.result === undefined).length).toBe(0);
  });
  it('clears a Special Condition before checking the post-evolution Ability', () => {
    const g = game(true);
    g.player1.active.specialConditions.push(SpecialCondition.POISONED);
    const seen: SpecialCondition[][] = [];
    const original = g.store.prompt.bind(g.store);
    spyOn(g.store, 'prompt').and.callFake(((state: State, prompt: any, then: any) => {
      if (prompt instanceof ConfirmPrompt) seen.push(g.player1.active.specialConditions.slice());
      return original(state, prompt, then);
    }) as any);
    evolve(g);
    expect(seen).toEqual([[]]);
  });
  it('emits one accepted notification per evolution, including nested evolutions', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmeleon BS' }, bench: [{ card: 'Bulbasaur BS' }], hand: ['Charizard ex OBF', 'Ivysaur BS'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const seen: string[] = [];
    const nested = g.player1.hand.cards.find(c => c.fullName === 'Ivysaur BS') as PokemonCard;
    class Observer extends PokemonCard {
      public name = 'Observer'; public fullName = 'Observer TEST'; public set = 'TEST';
      public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
        if (effect instanceof AfterEvolveEffect) {
          seen.push(effect.pokemonCard.fullName);
          if (effect.pokemonCard.fullName === 'Charizard ex OBF') {
            store.reduceEffect(state, new EvolveEffect(g.player1, g.player1.bench[0], nested));
          }
        }
        return state;
      }
    }
    g.player1.bench[1].cards = [new Observer()];
    evolve(g);
    expect(seen).toEqual(['Charizard ex OBF', 'Ivysaur BS']);
    expect(g.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(1);
  });
  it('triggers once when played from hand with the normal evolution action', () => {
    const g = game(true);
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    let confirmations = 0;
    g.overridePrompt('Confirm', () => { confirmations++; return false; });
    const index = g.player1.hand.cards.findIndex(c => c.fullName === 'Charizard ex OBF');
    g.store.dispatch(new PlayCardAction(g.player1.id, index, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Charizard ex OBF');
    expect(confirmations).toBe(1);
  });
  it('preserves another Pokémon’s markers and an unrelated global marker during normal hand evolution', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmeleon BS' }, bench: [{ card: 'Pikachu BS' }], hand: ['Charizard ex OBF'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    const source = g.player1.bench[0].getPokemonCard()!;
    g.player1.bench[0].marker.addMarker('BENCH_SENTINEL', source);
    g.player1.marker.addMarker('PLAYER_SENTINEL', source);
    g.overridePrompt('Confirm', () => false);
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.bench[0].marker.hasMarker('BENCH_SENTINEL', source)).toBe(true);
    expect(g.player1.marker.hasMarker('PLAYER_SENTINEL', source)).toBe(true);
  });
  it('triggers once from hand through Rare Candy', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Charmander BS', tools: ['Stealthy Hood UNB'] }, hand: ['Rare Candy SVI', 'Charizard ex OBF'], deck: padDeck(10) },
      player2: { active: { card: 'Wobbuffet PHF' }, deck: padDeck(10) }
    });
    getCardByName('Charmeleon BS');
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    g.player1.marker.addMarker(g.player1.ATTACK_USED_MARKER, g.player1.active.getPokemonCard()!);
    g.player1.active.specialConditions.push(SpecialCondition.POISONED);
    let confirmations = 0;
    g.overridePrompt('Confirm', () => { confirmations++; return false; });
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Charizard ex OBF');
    expect(confirmations).toBe(1);
    expect(g.player1.active.specialConditions).not.toContain(SpecialCondition.POISONED);
    expect(g.player1.marker.hasMarker(g.player1.ATTACK_USED_MARKER)).toBe(true);
  });
  it('evolves from the deck through Eevee Energy Evolution without moving through the hand', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Eevee SUM' }, hand: ['Water Energy SVE'], deck: ['Vaporeon HIF', ...padDeck(10)] },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    g.overridePrompt('Choose cards', () => [0]);
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Vaporeon HIF');
    expect(g.player1.active.cards.some(card => card.name === 'Water Energy')).toBe(true);
    expect(g.player1.hand.cards.some(card => card.fullName === 'Vaporeon HIF')).toBe(false);
  });
  it('does not heal Regenerative Energy when Clefable evolves from the deck', () => {
    spyOn(Math, 'random').and.returnValue(0.25);
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Clefable PLS' }, bench: [{ card: 'Glaceon V EVS', energy: ['Regenerative Energy SIT'], damage: 100 }], deck: ['Glaceon VMAX EVS', ...padDeck(10)] },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    useAbility(g.store, g.state, 0, 'Moon Guidance');
    expect(g.player1.bench[0].getPokemonCard()!.fullName).toBe('Glaceon VMAX EVS');
    expect(g.player1.bench[0].damage).toBe(100);
  });
  it('allows Clefable’s deck evolution while Archeops blocks hand evolution', () => {
    spyOn(Math, 'random').and.returnValue(0.25);
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Clefable PLS' }, bench: [{ card: 'Glaceon V EVS' }], deck: ['Glaceon VMAX EVS', ...padDeck(10)] },
      player2: { active: { card: 'Archeops NVI' }, deck: padDeck(10) }
    });
    useAbility(g.store, g.state, 0, 'Moon Guidance');
    expect(g.player1.bench[0].getPokemonCard()!.fullName).toBe('Glaceon VMAX EVS');
    expect(g.player1.deck.cards.some(card => card.fullName === 'Glaceon VMAX EVS')).toBe(false);
  });
  it('heals a Pokémon V with Regenerative Energy when evolving from hand', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Glaceon V EVS', energy: ['Regenerative Energy SIT'], damage: 100 }, hand: ['Glaceon VMAX EVS'], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    g.store.dispatch(new PlayCardAction(g.player1.id, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(g.player1.active.getPokemonCard()!.fullName).toBe('Glaceon VMAX EVS');
    expect(g.player1.active.damage).toBe(0);
  });
  it('restores snapshots before and after a resolved evolution without duplicate prompts', () => {
    const simulator = new ClientSimulator();
    const g = game(true); g.player1.canEvolve = true; g.player1.active.pokemonPlayedTurn = 1;
    const cards = Array.from(new Set(g.state.players.flatMap(player => [
      ...player.hand.cards, ...player.deck.cards, ...player.discard.cards, ...player.lostzone.cards,
      ...player.stadium.cards, ...player.supporter.cards, ...player.active.cards, ...player.active.tools,
      ...player.bench.flatMap(slot => [...slot.cards, ...slot.tools]), ...player.prizes.flatMap(prize => prize.cards)
    ])));
    cards.forEach((card, index) => { card.id = index; });
    g.state.cardNames = cards.map(card => card.fullName);
    const initial = new Base64().encode(new StateSerializer().serialize(g.state));
    simulator.loadSnapshot({stateData: initial});
    simulator.dispatch(new PlayCardAction(simulator.humanPlayerId, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    const confirms = simulator.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined);
    expect(confirms.length).toBe(1);
    simulator.resolvePrompt(confirms[0].id, false);
    const after = simulator.getStateData();
    simulator.loadSnapshot({stateData: after});
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Charizard ex OBF');
    expect(simulator.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(0);
    simulator.loadSnapshot({stateData: initial});
    expect(simulator.state.players[0].active.getPokemonCard()!.fullName).toBe('Charmeleon BS');
    expect(simulator.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(0);
    simulator.dispatch(new PlayCardAction(simulator.humanPlayerId, 0, {player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0}));
    expect(simulator.state.prompts.filter(p => p instanceof ConfirmPrompt && p.result === undefined).length).toBe(1);
    simulator.cleanup();
  });
});
