import { AttackAction, PassTurnAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { SpecialCondition } from '../../game/store/card/card-types';
import { DealDamageEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { GamePhase } from '../../game/store/state/state';
import { playTrainerCard, useAbility } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const pidgey = 'Pidgey MEW';
const clefable = 'Mega Clefable ex M3';
const yveltal = 'Yveltal 30C';
const illumise = 'Illumise 30C';
const volbeat = 'Volbeat 30C';
const charmander = 'Charmander OBF';
const sinistcha = 'Sinistcha M5';
const poltchageist = 'Poltchageist M5';
const gastrodon = 'Gastrodon SSP';
const flutter = 'Flutter Mane TEF';
const hood = 'Stealthy Hood UNB';
const feraligatr = 'Feraligatr TEF';
const dusknoir = 'Dusknoir SFA';
const rampardos = 'Rampardos ex M5';
const fighting = 'Fighting Energy SVE';
const psychic = 'Psychic Energy SVE';
const ownBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

describe('Supereffective Pheromones', () => {
  for (const [defender, holder, partner, expected] of [
    [sinistcha, 'attacker', true, 60],
    [sinistcha, 'defender', true, 90],
    [illumise, 'both', true, 90],
    [illumise, 'attacker', true, 90],
    [illumise, 'attacker', false, 60],
  ] as const) {
    it(`deals ${expected} after changing only eligible Weakness against ${defender} (${holder}, Volbeat ${partner})`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: charmander }, bench: holder === 'defender' ? [] : [{ card: illumise },
          ...(partner ? [{ card: volbeat }] : [])], deck: padDeck(8) },
        player2: { active: { card: defender }, bench: holder === 'attacker' ? [] : [{ card: illumise }, { card: volbeat }],
          deck: padDeck(8) },
      });
      g.state.phase = GamePhase.ATTACK;
      g.player1.active.attackDamageReductionNextTurn = 20;
      const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
      g.store.reduceEffect(g.state, new DealDamageEffect(attack, 50));
      expect(g.player2.active.damage).toBe(expected);
    });
  }

  it('keeps the normal multiplier when Weakness is explicitly applied to a Benched Pokémon', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: charmander }, bench: [{ card: illumise }, { card: volbeat }], deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: illumise }], deck: padDeck(8) },
    });
    g.state.phase = GamePhase.ATTACK;
    const hit = new DealDamageEffect(new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]), 30);
    hit.target = g.player2.bench[0];
    g.store.reduceEffect(g.state, hit);
    expect(hit.target.damage).toBe(60);
  });
});

describe('Life-Locked', () => {
  for (const [targetCard, bench, expected] of [[mew, false, 40], [clefable, false, 10], [mew, true, 10]] as const) {
    for (const byAttack of [false, true]) {
      it(`leaves ${expected} damage on ${targetCard} after ${byAttack ? 'attack' : 'ordinary'} healing`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: bench ? pidgey : targetCard, damage: bench ? 0 : 40 },
            bench: bench ? [{ card: targetCard, damage: 40 }] : [], deck: padDeck(8) },
          player2: { active: { card: mew }, bench: [{ card: yveltal }], deck: padDeck(8) },
        });
        const target = bench ? g.player1.bench[0] : g.player1.active;
        if (byAttack) {
          const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
          const heal = new HealTargetEffect(attack, 30);
          heal.target = target;
          g.store.reduceEffect(g.state, heal);
        } else {
          g.store.reduceEffect(g.state, new HealEffect(g.player1, target, 30));
        }
        expect(target.damage).toBe(expected);
      });
    }
  }
});

describe('Scoped Ability suppression', () => {
  for (const [onBench, friendly, protectedTarget, available] of [
    [false, false, false, true],
    [true, false, false, false],
    [true, true, false, false],
    [true, false, true, true],
    [true, true, true, false],
  ] as const) {
    it(`Sticky Bind applies consistently to ${onBench ? 'Benched' : 'Active'} Feraligatr (friendly ${friendly}, Hood ${protectedTarget})`, () => {
      const subject = { card: feraligatr, tools: protectedTarget ? [hood] : [] };
      const g = setupGame({ turn: 5,
        player1: { active: onBench ? { card: mew } : subject,
          bench: [...(onBench ? [subject] : []), ...(friendly ? [{ card: gastrodon }] : [])], deck: padDeck(8) },
        player2: { active: { card: mew }, bench: friendly ? [] : [{ card: gastrodon }], deck: padDeck(8) },
      });
      const target = onBench ? g.player1.bench[0] : g.player1.active;
      const query = new CheckPokemonPowersEffect(g.player1, target.getPokemonCard()!);
      g.store.reduceEffect(g.state, query);
      expect(query.powers.some(power => power.name === 'Torrential Heart')).toBe(available);
      const activate = () => useAbility(g.store, g.state, 0, 'Torrential Heart');
      if (available) {
        activate();
        expect(target.damage).toBe(50);
      } else {
        expect(activate).toThrow();
        expect(g.store.state.players[0].getPokemonInPlay().every(slot => slot.damage === 0)).toBe(true);
      }
    });
  }

  it('stops suppressing Feraligatr when Gastrodon moves from the Bench to the Active Spot', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: mew }, bench: [{ card: feraligatr }], deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: gastrodon }], deck: padDeck(8) },
    });
    const subject = g.player1.bench[0].getPokemonCard()!;
    const before = new CheckPokemonPowersEffect(g.player1, subject);
    g.store.reduceEffect(g.state, before);
    expect(before.powers).toEqual([]);
    g.player2.switchPokemon(g.player2.bench[0], g.store, g.state);
    const after = new CheckPokemonPowersEffect(g.player1, subject);
    g.store.reduceEffect(g.state, after);
    expect(after.powers.some(power => power.name === 'Torrential Heart')).toBe(true);
  });

  for (const locker of ['Psyduck SVP', 'Golduck MEP']) {
    for (const [protectedTarget, suppressLocker, available] of [
      [false, false, false], [true, false, true], [false, true, true],
    ] as const) {
      it(`shows and activates Cursed Blast correctly against ${locker} (Hood ${protectedTarget}, suppressed ${suppressLocker})`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: suppressLocker ? flutter : mew },
            bench: [{ card: dusknoir, tools: protectedTarget ? [hood] : [] }], deck: padDeck(8) },
          player2: { active: { card: locker }, bench: [{ card: mew }], deck: padDeck(8) },
        });
        const target = g.player1.bench[0];
        const query = new CheckPokemonPowersEffect(g.player1, target.getPokemonCard()!);
        g.store.reduceEffect(g.state, query);
        expect(query.powers.some(power => power.name === 'Cursed Blast')).toBe(available);
        if (!available) {
          expect(() => useAbility(g.store, g.state, 0, 'Cursed Blast')).toThrow();
          return;
        }
        g.overridePrompt('Choose pokemon', () => [{ player: PlayerType.TOP_PLAYER, slot: SlotType.ACTIVE, index: 0 }]);
        useAbility(g.store, g.state, 0, 'Cursed Blast');
        expect(g.player1.discard.cards.some(card => card.fullName === dusknoir)).toBe(true);
      });
    }
  }
});

describe('Rampardos ex timing and Ability protection', () => {
  for (const [opponent, discarded] of [[mew, true], [poltchageist, false]] as const) {
    it(`checks the defending ${opponent} when Destructive Headbutt lands heads`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: rampardos }, deck: padDeck(8) },
        player2: { active: { card: opponent, energy: [psychic] }, deck: padDeck(8) },
      });
      spyOn(Math, 'random').and.returnValue(0.1);
      g.overridePrompt('Choose cards', () => [1]);
      useAbility(g.store, g.state, 0, 'Destructive Headbutt');
      expect(g.player2.active.energies.cards.length).toBe(discarded ? 0 : 1);
    });
  }

  it('honors the armed Rampaging Hammer marker on a saved board', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: rampardos, energy: [fighting, fighting] }, deck: padDeck(8) },
      player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(8) },
    });
    const source = g.player1.active.getPokemonCard()!;
    g.player1.marker.addMarker('RAMPARDOS_EX_CLEAR_RAMPAGING_HAMMER_MARKER', source);
    g.store.dispatch(new AttackAction(g.player1.id, 'Rampaging Hammer'));
    expect(g.player2.active.damage).toBe(300);
  });

  for (const switched of [false, true]) {
    it(`applies Rampaging Hammer's bonus only on the next attack (switched ${switched})`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: rampardos, energy: [fighting, fighting] }, bench: [{ card: pidgey }],
          hand: ['Switch SVI', 'Switch SVI'], deck: padDeck(8) },
        player2: { active: { card: 'Dragapult ex TWM' }, deck: padDeck(8) },
      });
      g.player2.active.getPokemonCard()!.hp = 700;
      g.store.dispatch(new AttackAction(g.player1.id, 'Rampaging Hammer'));
      expect(g.player2.active.damage).toBe(150);
      g.store.dispatch(new PassTurnAction(g.player2.id));
      if (switched) {
        g.overridePrompt('Choose pokemon', () => [ownBench]);
        playTrainerCard(g.store, g.state, 0, 'Switch SVI');
        g.overridePrompt('Choose pokemon', () => [ownBench]);
        playTrainerCard(g.store, g.state, 0, 'Switch SVI');
      }
      g.store.dispatch(new AttackAction(g.player1.id, 'Rampaging Hammer'));
      expect(g.player2.active.damage).toBe(switched ? 300 : 450);
    });
  }
});

describe('Phantump evolution', () => {
  for (const [print, power] of [['Phantump M4', 'Envious Evolution'], ['Phantump M4 38', 'Spiteful Evolution']] as const) {
    it(`honors both the first-turn and cannot-evolve restrictions for ${print}`, () => {
      const g = setupGame({ turn: 1,
        player1: { active: { card: print }, hand: ['Trevenant M4'], deck: padDeck(8) },
        player2: { active: { card: mew }, deck: padDeck(8) },
      });
      expect(() => useAbility(g.store, g.store.state, 0, power)).toThrow();
      g.store.state.turn = 5;
      g.store.state.players[0].active.cannotEvolveNextTurn = true;
      expect(() => useAbility(g.store, g.store.state, 0, power)).toThrow();
      expect(g.store.state.players[0].active.damage).toBe(0);
    });

    it(`evolves ${print} on the turn it entered play and triggers Darkest Impulse`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: print, damage: 10 }, hand: ['Trevenant M4'], deck: padDeck(8) },
        player2: { active: { card: "Team Rocket's Ampharos DRI" }, deck: padDeck(8) },
      });
      g.player1.active.pokemonPlayedTurn = g.state.turn;
      g.player1.active.addSpecialCondition(SpecialCondition.BURNED);
      g.overridePrompt('Choose cards', () => [0]);
      useAbility(g.store, g.state, 0, power);
      expect(g.player1.active.getPokemonCard()?.fullName).toBe('Trevenant M4');
      expect(g.player1.active.damage).toBe(70);
      expect(g.player1.active.specialConditions).toEqual([]);
    });
  }
});
