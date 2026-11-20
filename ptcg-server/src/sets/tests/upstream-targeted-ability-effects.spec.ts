import { GameMessage } from '../../game/game-message';
import { AttackAction, UseAbilityAction } from '../../game/store/actions/game-actions';
import { PlayCardAction, PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AddSpecialConditionsPowerEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { ChoosePokemonPrompt, ChoosePokemonPromptType } from '../../game/store/prompts/choose-pokemon-prompt';
import { GamePhase } from '../../game/store/state/state';
import { getCardByName, padDeck, setupGame } from './test-helpers';

const water = 'Water Energy SVE';
const metal = 'Metal Energy SVE';
const hood = 'Stealthy Hood UNB';
const fusion = 'Fusion Strike Energy FST';
const bundle = 'Iron Bundle PAR';
const charjabug = 'Radiant Charjabug CRZ 51';
const orthworm = 'Orthworm ex SCR';
const jugulis = 'Iron Jugulis TEF';
const clefable = 'Mega Clefable ex M3';
const banette = 'Banette M5';
const shuppet = 'Shuppet M5';
const dhelmise = 'Dhelmise M5';
const mew = 'Mew ex MEW';
const fusions = 'Mew V FST';
const orbeetle = 'Orbeetle VMAX VIV';
const active = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.ACTIVE, index: 0 };
const bench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

describe('Iron Bundle printed effects', () => {
  for (const defender of [banette, clefable, fusions]) {
    it(`uses Hyper Blower without switching or discarding into protected ${defender}`, () => {
      const { store, player1, player2 } = setupGame({
        turn: 5,
        player1: { active: { card: mew }, bench: [{ card: bundle, energy: [water] }] },
        player2: { active: { card: defender, energy: defender === fusions ? [fusion] : [] }, bench: [{ card: dhelmise }] }
      });
      const source = player1.bench[0].getPokemonCard();
      store.dispatch(new UseAbilityAction(player1.id, 'Hyper Blower', bench));
      expect(store.state.players[1].active.getPokemonCard()?.fullName).toBe(defender);
      expect(store.state.players[0].bench[0].getPokemonCard()).toBe(source);
      expect(store.state.players[0].bench[0].energies.cards.length).toBe(1);
      expect(store.state.prompts.some(prompt => prompt instanceof ChoosePokemonPrompt)).toBe(false);
      expect(() => store.dispatch(new UseAbilityAction(player1.id, 'Hyper Blower', bench)))
        .toThrow(jasmine.objectContaining({ message: GameMessage.POWER_ALREADY_USED }));
    });
  }

  it('lets the opponent choose a protected Benched replacement and discards the entire Iron Bundle stack', () => {
    const { store, player1, player2, overridePrompt } = setupGame({
      turn: 5,
      player1: { active: { card: mew }, bench: [{ card: 'Iron Bundle SVP', energy: [water], tools: [hood], damage: 40 }] },
      player2: { active: { card: dhelmise }, bench: [{ card: banette }, { card: fusions, energy: [fusion] }] }
    });
    let chose = false;
    overridePrompt(ChoosePokemonPromptType, prompt => {
      expect(prompt.playerId).toBe(player2.id);
      chose = true;
      return [{ ...bench, index: 1 }];
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Hyper Blower', bench));
    expect(chose).toBe(true);
    expect(store.state.players[1].active.getPokemonCard()?.fullName).toBe(fusions);
    const slot = store.state.players[0].bench[0];
    expect(slot.cards.length).toBe(0);
    expect(slot.tools.length).toBe(0);
    expect(slot.energies.cards.length).toBe(0);
    expect(slot.damage).toBe(0);
    expect(store.state.players[0].discard.cards.map(card => card.fullName).sort()).toEqual(['Iron Bundle SVP', hood, water].sort());
    expect(store.state.players[1].getPrizeLeft()).toBe(6);
  });

  it('can use Hyper Blower again after Turo returns the card and it enters play again', () => {
    const { store, player1, overridePrompt } = setupGame({
      turn: 5,
      player1: { active: { card: mew }, bench: [{ card: bundle }], hand: ["Professor Turo's Scenario PAR"] },
      player2: { active: { card: banette }, bench: [{ card: dhelmise }] }
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Hyper Blower', bench));
    overridePrompt(ChoosePokemonPromptType, () => [bench]);
    store.dispatch(new PlayCardAction(player1.id, 0, { ...active, slot: SlotType.BOARD }));
    expect(store.state.players[0].hand.cards[0]?.fullName).toBe(bundle);
    store.dispatch(new PlayCardAction(player1.id, 0, bench));
    store.dispatch(new UseAbilityAction(player1.id, 'Hyper Blower', bench));
    expect(store.state.players[0].bench[0].getPokemonCard()?.fullName).toBe(bundle);
    expect(store.state.players[1].active.getPokemonCard()?.fullName).toBe(banette);
  });

  for (const [defender, blocks] of [[orthworm, false], ['Feraligatr TEF', true], ['Sinistcha M5', false]] as const) {
    it(`hits ${defender} for 80 and applies Refrigerated Stream only if allowed`, () => {
      const { store, player1 } = setupGame({
        turn: 5,
        player1: { active: { card: bundle, energy: [water, water, water] }, deck: padDeck(8) },
        player2: { active: { card: defender, tools: defender === 'Sinistcha M5' ? ["Hero's Cape TEF"] : [] },
          bench: [{ card: mew }], deck: padDeck(8) }
      });
      store.dispatch(new AttackAction(player1.id, 'Refrigerated Stream'));
      const target = store.state.players[1].active;
      expect(target.damage).toBe(80);
      expect(target.marker.hasMarker('REFRIGERATED_STREAM_MARKER')).toBe(blocks);
    });
  }
});

describe('source and timing of reactive Ability counters', () => {
  for (const [withTool, sameSide, expected] of [[false, false, 20], [true, false, 0], [true, true, 20]] as const) {
    it(`applies Shocking Block from its owner after attachment (Tool ${withTool}, own Pokémon ${sameSide})`, () => {
      const target = { card: 'Pikachu V VIV', tools: withTool ? [hood] : [] };
      const { store, player1 } = setupGame({
        turn: 5,
        player1: { active: target, bench: sameSide ? [{ card: charjabug }] : [], hand: [water] },
        player2: { active: { card: sameSide ? dhelmise : charjabug } }
      });
      store.dispatch(new PlayCardAction(player1.id, 0, active));
      const attached = store.state.players[0].active;
      expect(attached.energies.cards.length).toBe(1);
      expect(attached.damage).toBe(expected);
    });
  }

  it('does not place Shocking Block counters on an Energy attachment rejected by the engine', () => {
    const { store, state, player1 } = setupGame({
      player1: { active: { card: 'Pikachu V VIV' }, hand: [water] },
      player2: { active: { card: charjabug } }
    });
    player1.active.energyAttachBlockedFromHandNextTurn = true;
    const attach = new AttachEnergyEffect(player1, player1.hand.cards[0] as EnergyCard, player1.active);
    expect(() => store.reduceEffect(state, attach)).toThrow(jasmine.objectContaining({ message: GameMessage.BLOCKED_BY_EFFECT }));
    expect(player1.active.damage).toBe(0);
    expect(player1.active.energies.cards.length).toBe(0);
  });

  it('counts a completed V-UNION as a Pokémon V for Shocking Block', () => {
    const parts = ['Top Left', 'Top Right', 'Bottom Left', 'Bottom Right'].map(
      part => `Mewtwo V-UNION (${part}) SWSH`
    );
    const { store, player1 } = setupGame({
      turn: 5,
      player1: { active: { card: parts[0] }, hand: [water], discard: parts.slice(1) },
      player2: { active: { card: charjabug } }
    });
    player1.discard.moveTo(player1.active);
    store.dispatch(new PlayCardAction(player1.id, 0, active));
    expect(store.state.players[0].active.damage).toBe(20);
  });

  it('applies Sand Stream during either checkup, only from the Active, to unprotected Basics', () => {
    const tyranitar = { card: "Team Rocket's Tyranitar DRI" };
    const { store, state, player1, player2 } = setupGame({
      player1: { active: tyranitar, bench: [tyranitar] },
      player2: { active: { card: shuppet }, bench: [{ card: mew }, { card: clefable }, { card: fusions, energy: [fusion] }] }
    });
    for (const player of [player2, player1]) {
      store.reduceEffect(state, new BetweenTurnsEffect(player));
    }
    expect([player2.active, ...player2.bench.slice(0, 3)].map(slot => slot.damage)).toEqual([0, 20, 0, 0]);
  });

  it('applies Eerie Beam individually to protected and ordinary targets', () => {
    const { store, player1 } = setupGame({
      turn: 5,
      player1: { active: { card: orbeetle } },
      player2: { active: { card: clefable }, bench: [{ card: shuppet }, { card: mew }] }
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Eerie Beam', active));
    const opposing = store.state.players[1];
    expect([opposing.active, ...opposing.bench.slice(0, 2)].map(slot => slot.damage)).toEqual([0, 0, 10]);
  });

  it('keeps Stealthy Hood from blocking Torrential Heart on the holder', () => {
    const { store, player1 } = setupGame({
      turn: 5,
      player1: { active: { card: 'Feraligatr SVP', tools: [hood], energy: [water, water] }, deck: padDeck(8) },
      player2: { active: { card: orthworm }, bench: [{ card: mew }], deck: padDeck(8) }
    });
    store.dispatch(new UseAbilityAction(player1.id, 'Torrential Heart', active));
    expect(store.state.players[0].active.damage).toBe(50);
    store.dispatch(new AttackAction(player1.id, 'Giant Wave'));
    expect(store.state.players[1].discard.cards.map(card => card.fullName)).toContain(orthworm);
  });

  it('allows the Fusion Strike holder’s side to place its own counters', () => {
    const { store, state, player1 } = setupGame({
      player1: { active: { card: fusions, energy: [fusion] }, bench: [{ card: charjabug }] },
      player2: { active: { card: mew } }
    });
    const source = player1.bench[0].getPokemonCard()!;
    store.reduceEffect(state, new PlaceDamageCountersEffect(player1, player1.active, 20, source, source.powers[0]));
    expect(player1.active.damage).toBe(20);
  });

  it('checks legacy condition sources from the Pokémon that used the Ability', () => {
    const { store, state, player1, player2 } = setupGame({
      player1: { active: { card: clefable }, bench: [{ card: 'Brute Bonnet PAR' }] },
      player2: { active: { card: 'Brute Bonnet PAR' } }
    });
    store.reduceEffect(state, new AddSpecialConditionsPowerEffect(
      player1, player2.active.getPokemonCard()!, player1.active, [SpecialCondition.POISONED]
    ));
    expect(player1.active.specialConditions).toEqual([]);
    store.reduceEffect(state, new AddSpecialConditionsPowerEffect(
      player1, player1.bench[0].getPokemonCard()!, player1.active, [SpecialCondition.POISONED]
    ));
    expect(player1.active.specialConditions).toEqual([SpecialCondition.POISONED]);
  });
});

describe('reactive counters after verified attack damage', () => {
  for (const [card, expected] of [[jugulis, 30], [orthworm, 40]] as const) {
    it(`${card} retaliates once even when Knocked Out`, () => {
      const { store, player1 } = setupGame({
        turn: 5,
        player1: { active: { card: bundle, energy: [water, water, water] }, deck: padDeck(8) },
        player2: { active: { card, energy: [metal, metal], damage: card === orthworm ? 150 : 60 },
          bench: [{ card: mew }], deck: padDeck(8) }
      });
      store.dispatch(new AttackAction(player1.id, 'Refrigerated Stream'));
      expect(store.state.players[0].active.damage).toBe(expected);
      expect(store.state.players[1].discard.cards.map(item => item.fullName)).toContain(card);
    });
  }

  for (const [card, expected] of [[jugulis, 0], [orthworm, 40]] as const) {
    it(`${card} follows its printed Bench restriction and uses only its own effective Metal Energy`, () => {
      const { store, state, player1, player2 } = setupGame({
        player1: { active: { card: bundle } },
        player2: { active: { card: mew, energy: [metal, metal, metal] },
          bench: [{ card, energy: [metal, metal, water] }] }
      });
      state.phase = GamePhase.ATTACK;
      const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
      const hit = new PutDamageEffect(attack, 20);
      hit.target = player2.bench[0];
      store.reduceEffect(state, hit);
      expect(player2.bench[0].damage).toBe(20);
      expect(player1.active.damage).toBe(expected);
    });
  }

  it('does not retaliate when damage is reduced to zero or affects an unrelated Pokémon', () => {
    const { store, state, player1, player2 } = setupGame({
      player1: { active: { card: bundle } },
      player2: { active: { card: jugulis }, bench: [{ card: orthworm, energy: [metal, metal] }] }
    });
    state.phase = GamePhase.ATTACK;
    player2.active.damageReductionNextTurn = 30;
    const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
    store.reduceEffect(state, new PutDamageEffect(attack, 30));
    expect([player1.active.damage, player2.active.damage, player2.bench[0].damage]).toEqual([0, 0, 0]);
  });

  it('blocks retaliation against an Ability-protected attacker', () => {
    const { store, state, player1, player2 } = setupGame({
      player1: { active: { card: banette } },
      player2: { active: { card: orthworm, energy: [metal, metal] } }
    });
    state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
    store.reduceEffect(state, new PutDamageEffect(attack, 20));
    expect(player2.active.damage).toBe(20);
    expect(player1.active.damage).toBe(0);
  });

  it('ignores Metal Energy whose effective type changed to Colorless', () => {
    const { store, state, player1, player2 } = setupGame({
      player1: { active: { card: bundle }, hand: ['Temple of Sinnoh ASR'] },
      player2: { active: { card: orthworm, energy: ['Luminous Energy PAL'] } }
    });
    state.phase = GamePhase.ATTACK;
    player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR'));
    const attack = new AttackEffect(player1, player2, player1.active.getPokemonCard()!.attacks[0]);
    store.reduceEffect(state, new PutDamageEffect(attack, 20));
    expect(player1.active.damage).toBe(0);
  });
});
