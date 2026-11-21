import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { ConfirmPrompt } from '../../game/store/prompts/confirm-prompt';
import { Prompt } from '../../game/store/prompts/prompt';
import { GamePhase, State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const clefable = 'Mega Clefable ex M3';
const meowstic = 'Meowstic SSP';
const shinx = 'Shinx PAL';
const toy = 'Chill Teaser Toy SSP';
const nidoqueen = 'Nidoqueen M6';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const opposingBench = { ...bench, player: PlayerType.TOP_PLAYER };
const opposingActive = { ...active, player: PlayerType.TOP_PLAYER };

describe('Benched Pokémon selected by an Ability', () => {
  for (const [basic, evolution] of [["Hop's Wooloo JTG", "Hop's Dubwool JTG"], ['Makuhita M1L', 'Hariyama M1L']]) {
    for (const [incoming, oldActive, switched] of [[clefable, mew, false], [mew, clefable, true]] as const) {
      it(`${evolution} checks the chosen ${incoming} after evolving from hand`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: basic }, hand: [evolution], deck: padDeck(8) },
          player2: { active: { card: oldActive }, bench: [{ card: incoming }], deck: padDeck(8) },
        });
        let compared = false;
        g.overridePrompt('Confirm', prompt => {
          expect(prompt.playerId).toBe(g.player1.id);
          expect(g.player1.active.getPokemonCard()?.fullName).toBe(evolution);
          return true;
        });
        g.overridePrompt('Choose pokemon', prompt => {
          expect(prompt.playerId).toBe(g.player1.id);
          compared = true;
          return [opposingBench];
        });
        g.store.dispatch(new PlayCardAction(g.player1.id, 0, active));
        expect(compared).toBe(true);
        expect(g.player2.active.getPokemonCard()?.fullName).toBe(switched ? incoming : oldActive);
      });
    }

    for (const evolveFromDeck of [false, true]) {
      it(`${evolution} evolves without a prompt ${evolveFromDeck ? 'from the deck' : 'against an empty Bench'}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: basic }, hand: [evolution], deck: padDeck(8) },
          player2: { active: { card: mew }, bench: evolveFromDeck ? [{ card: mew }] : [], deck: padDeck(8) },
        });
        let prompts = 0;
        g.overridePrompt('Confirm', () => { ++prompts; return false; });
        if (evolveFromDeck) {
          const card = g.player1.hand.cards[0] as PokemonCard;
          g.player1.hand.moveCardTo(card, g.player1.deck);
          g.store.reduceEffect(g.state, new EvolveEffect(g.player1, g.player1.active, card, g.player1.deck));
        } else {
          g.store.dispatch(new PlayCardAction(g.player1.id, 0, active));
        }
        expect(g.player1.active.getPokemonCard()?.fullName).toBe(evolution);
        expect(prompts).toBe(0);
      });
    }
  }

  for (const [target, switched] of [[clefable, false], ['Pidgey MEW', true]] as const) {
    it(`pays one Beckoning Tail cost and checks the switch against ${target}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: meowstic }, hand: [toy, toy], deck: padDeck(8) },
        player2: { active: { card: mew }, bench: [{ card: target }], deck: padDeck(8) },
      });
      g.overridePrompt('Choose cards', () => [0]);
      g.overridePrompt('Choose pokemon', () => {
        expect(g.player1.discard.cards.map(card => card.fullName)).toEqual([toy]);
        return [opposingBench];
      });
      useAbility(g.store, g.state, 0, 'Beckoning Tail');
      expect(g.player2.active.getPokemonCard()?.fullName).toBe(switched ? target : mew);
      expect(() => useAbility(g.store, g.state, 0, 'Beckoning Tail'))
        .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
      expect(g.player1.hand.cards.map(card => card.fullName)).toEqual([toy]);
    });
  }

  it('keeps Midnight Fluttering from consuming any Beckoning Tail cost', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: meowstic }, hand: [toy], deck: padDeck(8) },
      player2: { active: { card: 'Flutter Mane TEF' }, bench: [{ card: 'Pidgey MEW' }], deck: padDeck(8) },
    });
    expect(() => useAbility(g.store, g.state, 0, 'Beckoning Tail')).toThrow();
    expect(g.player1.hand.cards.map(card => card.fullName)).toEqual([toy]);
    expect(g.player1.discard.cards).toEqual([]);
    expect(g.state.prompts.length).toBe(0);
  });

  for (const [heads, target, switched] of [[true, clefable, false], [true, 'Pidgey MEW', true], [false, 'Pidgey MEW', false]] as const) {
    it(`applies ${heads ? 'heads' : 'tails'} and Ability protection for Maternal Call into ${target}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: nidoqueen }, deck: padDeck(8) },
        player2: { active: { card: mew }, bench: [{ card: target }], deck: padDeck(8) },
      });
      let picks = 0;
      spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
      g.overridePrompt('Choose pokemon', () => { ++picks; return [opposingBench]; });
      useAbility(g.store, g.state, 0, 'Maternal Call');
      expect(picks).toBe(heads ? 1 : 0);
      expect(g.player2.active.getPokemonCard()?.fullName).toBe(switched ? target : mew);
    });
  }
});

describe('Big Roar protection and ownership', () => {
  for (const [opponentActive, opponentBench, switches] of [[clefable, mew, false], [mew, clefable, true]] as const) {
    it(`checks the current Active ${opponentActive} and lets the opponent choose`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: shinx }, deck: padDeck(8) },
        player2: { active: { card: opponentActive }, bench: [{ card: opponentBench }], deck: padDeck(8) },
      });
      let prompts = 0;
      g.overridePrompt('Choose pokemon', prompt => {
        ++prompts;
        expect(prompt.playerId).toBe(g.player2.id);
        return [bench];
      });
      useAbility(g.store, g.state, 0, 'Big Roar');
      expect(prompts).toBe(switches ? 1 : 0);
      expect(g.player2.active.getPokemonCard()?.fullName).toBe(switches ? opponentBench : opponentActive);
      expect(() => useAbility(g.store, g.state, 0, 'Big Roar')).toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    });
  }

  it('cannot use Big Roar against an empty Bench', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: shinx }, deck: padDeck(8) }, player2: { active: { card: mew }, deck: padDeck(8) },
    });
    expect(() => useAbility(g.store, g.state, 0, 'Big Roar')).toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
    expect(g.state.prompts.length).toBe(0);
  });
});

describe('Ability counters after a switch or damage', () => {
  for (const [defender, damage] of [[mew, 20], [clefable, 0], ['Cornerstone Mask Ogerpon ex TWM', 20]] as const) {
    it(`resolves Tachyon Bits once and uses the printed damage counters against ${defender}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: mew }, bench: [{ card: 'Iron Valiant ex SVP' }], deck: padDeck(8),
          hand: ['Switch SVI', 'Switch SVI', 'Switch SVI'] },
        player2: { active: { card: defender }, deck: padDeck(8) },
      });
      let confirmed = 0;
      const prompt = g.store.prompt.bind(g.store);
      spyOn(g.store, 'prompt').and.callFake((state: State, prompts: Prompt<any>[] | Prompt<any>, then: (results: any) => void) => {
        if (prompts instanceof ConfirmPrompt) ++confirmed;
        return prompt(state, prompts, then);
      });
      g.overridePrompt('Confirm', () => {
        g.overridePrompt('Choose pokemon', () => [opposingActive]);
        return true;
      });
      const original = g.store.reduceEffect.bind(g.store);
      let placement = 0;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof PlaceDamageCountersEffect && effect.sourcePower?.name === 'Tachyon Bits') ++placement;
        return original(state, effect);
      });
      for (let i = 0; i < 3; i++) {
        g.overridePrompt('Choose pokemon', () => [bench]);
        g.store.dispatch(new PlayCardAction(g.player1.id, 0, { ...active, slot: SlotType.BOARD }));
      }
      expect(confirmed).toBe(1);
      expect(placement).toBe(1);
      expect(g.player2.active.damage).toBe(damage);
    });
  }

  it('can decline the first promotion and use Tachyon Bits on a later switch in the same turn', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: mew }, bench: [{ card: 'Iron Valiant ex PAR' }], deck: padDeck(8),
        hand: ['Switch SVI', 'Switch SVI', 'Switch SVI'] },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    g.overridePrompt('Confirm', () => false);
    for (let i = 0; i < 3; i++) {
      if (i === 2) {
        g.overridePrompt('Confirm', () => {
          g.overridePrompt('Choose pokemon', () => [opposingActive]);
          return true;
        });
      }
      g.overridePrompt('Choose pokemon', () => [bench]);
      g.store.dispatch(new PlayCardAction(g.player1.id, 0, { ...active, slot: SlotType.BOARD }));
    }
    expect(g.player2.active.damage).toBe(20);
  });

  for (const [phase, activePlayer, triggers] of [
    [GamePhase.ATTACK, 0, true], [GamePhase.BETWEEN_TURNS, 0, false], [GamePhase.ATTACK, 1, false],
  ] as const) {
    it(`checks turn ownership and phase ${phase} for a Tachyon Bits promotion`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: mew }, bench: [{ card: 'Iron Valiant ex PAR' }], deck: padDeck(8) },
        player2: { active: { card: mew }, deck: padDeck(8) },
      });
      g.state.phase = phase;
      g.state.activePlayer = activePlayer;
      g.player1.switchPokemon(g.player1.bench[0], g.store, g.state);
      expect(g.state.prompts.some(prompt => prompt instanceof ConfirmPrompt)).toBe(triggers);
    });
  }

  for (const [attacker, attack, expected] of [
    ['Cornerstone Mask Ogerpon ex TWM', 'Demolish', 30],
    [clefable, 'Shooting Moon', 0],
    ['Pidgey MEW', 'Tackle', 30],
  ] as const) {
    it(`applies Counterattack as Ability counters after ${attack} from ${attacker}`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: attacker, energy: ['Fighting Energy SVE', 'Psychic Energy SVE', 'Psychic Energy SVE'] },
          deck: padDeck(8) },
        player2: { active: { card: 'Hitmonchan MEW' }, bench: [{ card: mew }], deck: padDeck(8) },
      });
      const original = g.store.reduceEffect.bind(g.store);
      let counters = 0;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof PlaceDamageCountersEffect && effect.sourcePower?.name === 'Counterattack') ++counters;
        return original(state, effect);
      });
      useAttack(g.store, g.state, 0, attack);
      expect(counters).toBe(1);
      expect(g.player1.active.damage).toBe(expected);
    });
  }
});
