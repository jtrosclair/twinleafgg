import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { State } from '../../game/store/state/state';
import { useAbility, useAttack } from './card-test-helpers';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const gardevoir = 'Gardevoir ex SVI';
const dodrio = 'Dodrio MEW';
const samurott = 'Samurott SV11W';
const mew = 'Mew ex MEW';
const pidgey = 'Pidgey MEW';
const psychic = 'Psychic Energy SVE';
const water = 'Water Energy SVE';
const turbo = 'Double Turbo Energy BRS';
const fire = 'Fire Energy SVE';
const ownActive = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };
const bench2 = { ...ownBench, index: 1 };
const bench3 = { ...ownBench, index: 2 };

describe('Psychic Embrace validates a complete batch', () => {
  it('checks effective Psychic type and remaining HP before moving any Energy', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: gardevoir }, bench: [
        { card: mew, damage: 240, tools: ["Hero's Cape TEF"] },
        { card: pidgey }, { card: 'Carbink ASC' },
      ], discard: [psychic, psychic, psychic, fire, turbo], deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    const original = game.store.reduceEffect.bind(game.store);
    let typedAttachments = 0;
    let typedCounters = 0;
    spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof AttachEnergyEffect) {
        ++typedAttachments;
        expect(effect.sourceZone).toBe('discard');
        expect(effect.sourceCard?.fullName).toBe(gardevoir);
      }
      if (effect instanceof PlaceDamageCountersEffect) {
        ++typedCounters;
        expect(effect.sourcePower?.name).toBe('Psychic Embrace');
      }
      return original(state, effect);
    });
    game.overridePrompt('Attach energy', raw => {
      const prompt = raw as AttachEnergyPrompt;
      const energy = prompt.cardList.cards;
      const ids = energy.map((card, index) => card.fullName === psychic ? index : -1).filter(index => index !== -1);
      const first = { to: ownBench, card: energy[ids[0]] };
      expect(prompt.validateAssignments([first, { to: ownBench, card: energy[ids[1]] }])).toBe(false);
      expect(prompt.validateAssignments([{ to: bench2, card: energy[ids[0]] }])).toBe(false);
      expect(prompt.validateAssignments([{ to: bench3, card: energy[ids[0]] }])).toBe(true);
      expect(prompt.validateAssignments([{ to: ownActive, card: energy.find(card => card.fullName === fire)! }])).toBe(false);
      expect(prompt.validateAssignments([{ to: ownActive, card: energy.find(card => card.fullName === turbo)! }])).toBe(false);
      expect(game.player1.bench[0].damage).toBe(240);
      return [{ index: ids[0], to: ownBench }, { index: ids[1], to: bench3 }, { index: ids[2], to: ownActive }];
    });
    useAbility(game.store, game.state, 0, 'Psychic Embrace');
    expect(typedAttachments).toBe(3);
    expect(typedCounters).toBe(3);
    expect(game.player1.active.damage).toBe(20);
    expect(game.player1.bench.slice(0, 3).map(slot => slot.damage)).toEqual([260, 0, 20]);
    expect(game.player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([psychic]);
    expect(game.player1.discard.cards.map(card => card.fullName).sort()).toEqual([fire, turbo].sort());
    expect(game.player1.energyPlayedTurn).not.toBe(game.state.turn);
  });

  it('refuses a knockout batch atomically and lets the player submit a legal replacement', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: gardevoir, damage: 280 }, discard: [psychic, psychic], deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    game.overridePrompt('Attach energy', () => [{ index: 0, to: ownActive }, { index: 1, to: ownActive }]);
    expect(() => useAbility(game.store, game.state, 0, 'Psychic Embrace'))
      .toThrowError(/Invalid auto-resolved prompt result/);
    expect(game.player1.active.damage).toBe(280);
    expect(game.player1.discard.cards.length).toBe(2);
    expect(game.player1.active.energies.cards).toEqual([]);

    const prompt = game.state.prompts.find(p => p instanceof AttachEnergyPrompt && p.result === undefined) as AttachEnergyPrompt;
    const selection = prompt.decode([{ index: 0, to: ownActive }], game.state);
    game.store.dispatch(new ResolvePromptAction(prompt.id, selection));
    expect(game.player1.active.damage).toBe(300);
    expect(game.player1.discard.cards.length).toBe(1);
    expect(game.player1.active.energies.cards.length).toBe(1);
  });

  for (const [damage, energy] of [[290, psychic], [0, fire]] as const) {
    it('does not present an empty Psychic Embrace choice', () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: gardevoir, damage }, discard: [energy], deck: padDeck(8) },
        player2: { active: { card: mew }, deck: padDeck(8) }
      });
      expect(() => useAbility(game.store, game.state, 0, 'Psychic Embrace'))
        .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
      expect(game.player1.discard.cards.length).toBe(1);
    });
  }
});

describe('Strong Currents resolves the switches in order', () => {
  for (const opposing of ['empty', 'available', 'protected']) {
    it('settles the friendly switch with the opposing Bench ' + opposing, () => {
      const defender = opposing === 'protected' ? 'Corviknight VMAX BST' : mew;
      const game = setupGame({ turn: 5,
        player1: { active: { card: samurott }, bench: [{ card: pidgey }], deck: padDeck(8) },
        player2: { active: { card: defender }, bench: opposing === 'empty' ? [] : [{ card: pidgey }], deck: padDeck(8) }
      });
      let first = false;
      game.overridePrompt('Choose pokemon', prompt => {
        expect(prompt.playerId).toBe(game.player1.id);
        first = true;
        return [ownBench];
      });
      const prompts = spyOn(game.store, 'prompt').and.callThrough();
      useAbility(game.store, game.state, 0, 'Strong Currents');
      expect(first).toBe(true);
      expect(game.player1.active.getPokemonCard()?.fullName).toBe(pidgey);
      expect(game.player2.active.getPokemonCard()?.fullName).toBe(opposing === 'available' ? pidgey : defender);
      expect(prompts.calls.count()).toBe(opposing === 'available' ? 2 : 1);
      expect(() => useAbility(game.store, game.state, 0, 'Strong Currents'))
        .toThrow(new GameError(GameMessage.POWER_ALREADY_USED));
    });
  }

  it('requires a friendly Bench even when the opponent can switch', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: samurott }, deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: pidgey }], deck: padDeck(8) }
    });
    expect(() => useAbility(game.store, game.state, 0, 'Strong Currents'))
      .toThrow(new GameError(GameMessage.CANNOT_USE_POWER));
  });

  it('counts both units of Double Turbo Energy in Energy Slash', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: samurott, energy: [water, turbo] }, deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    useAttack(game.store, game.state, 0, 'Energy Slash');
    expect(game.player2.active.damage).toBe(160);
  });
});

describe('Zooming Draw pays one ability counter', () => {
  for (const outcome of ['draws', 'empty deck', 'placement prevented']) {
    it('resolves Zooming Draw with ' + outcome, () => {
      const game = setupGame({ turn: 5,
        player1: { active: { card: dodrio }, deck: outcome === 'empty deck' ? [] : [fire] },
        player2: { active: { card: mew }, deck: padDeck(8) }
      });
      const original = game.store.reduceEffect.bind(game.store);
      let attributed = false;
      spyOn(game.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof PlaceDamageCountersEffect) {
          attributed = effect.source?.fullName === dodrio && effect.sourcePower?.name === 'Zooming Draw';
          if (outcome === 'placement prevented') effect.preventDefault = true;
        }
        return original(state, effect);
      });
      useAbility(game.store, game.state, 0, 'Zooming Draw');
      expect(attributed).toBe(true);
      expect(game.player1.active.damage).toBe(outcome === 'placement prevented' ? 0 : 10);
      expect(game.player1.hand.cards.map(card => card.fullName)).toEqual(outcome === 'draws' ? [fire] : []);
    });
  }

  it('keeps a real Watchtower Ability lock in force', () => {
    const game = setupGame({ turn: 5,
      player1: { active: { card: dodrio }, deck: [fire] },
      player2: { active: { card: mew }, deck: padDeck(8) }
    });
    game.player2.stadium.cards.push(getCardByName("Team Rocket's Watchtower DRI"));
    expect(() => useAbility(game.store, game.state, 0, 'Zooming Draw'))
      .toThrow(new GameError(GameMessage.BLOCKED_BY_EFFECT));
    expect(game.player1.active.damage).toBe(0);
    expect(game.player1.deck.cards.length).toBe(1);
  });
});
