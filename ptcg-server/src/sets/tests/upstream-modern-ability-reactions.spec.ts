import { RetreatAction, RetreatStartAction } from '../../game/store/actions/game-actions';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, SpecialCondition } from '../../game/store/card/card-types';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { GameLog } from '../../game/game-message';
import { GamePhase } from '../../game/store/state/state';
import { playTrainerCard, useAbility, useAttack } from './card-test-helpers';
import { padDeck, setupGame } from './test-helpers';

const mew = 'Mew ex MEW';
const clefable = 'Mega Clefable ex M3';
const dark = 'Darkness Energy SVE';
const fire = 'Fire Energy SVE';
const grass = 'Grass Energy SVE';
const metal = 'Metal Energy SVE';
const psychic = 'Psychic Energy SVE';
const water = 'Water Energy SVE';
const pidgey = 'Pidgey MEW';
const dragapult = 'Dragapult ex TWM';
const goodra = 'Goodra M4';
const goodraPrint = 'Goodra M4 68';
const volcanion = 'Volcanion ex JTG';
const bottomBench = { player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index: 0 };

describe('Slimy Sliding', () => {
  for (const start of [false, true]) {
    for (const heads of [false, true]) {
      it(`gates the ${start ? 'button' : 'direct'} retreat exactly once on ${heads ? 'heads' : 'tails'}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: dragapult, energy: [water] }, bench: [{ card: pidgey }], deck: padDeck(8) },
          player2: { active: { card: goodra }, bench: [{ card: goodraPrint }], deck: padDeck(8) },
        });
        const active = g.player1.active;
        active.cannotUseAttacksNextTurn.push('Phantom Dive');
        spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
        g.store.dispatch(start ? new RetreatStartAction(g.player1.id) : new RetreatAction(g.player1.id, 0));

        expect(g.player1.active.getPokemonCard()?.fullName).toBe(heads ? pidgey : dragapult);
        expect(g.player1.discard.cards.map(card => card.fullName)).toEqual(heads ? [water] : []);
        expect(g.player1.retreatedTurn).toBe(g.state.turn);
        const flips = g.state.logs.filter(log =>
          log.message === GameLog.LOG_PLAYER_FLIPS_HEADS || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS);
        expect(flips.length).toBe(1);

        if (!heads) {
          expect(active.energies.cards.map(card => card.fullName)).toEqual([water]);
          expect(active.cannotUseAttacksNextTurn).toEqual(['Phantom Dive']);
          expect(() => g.store.dispatch(new RetreatAction(g.player1.id, 0))).toThrow();
        }
      });
    }
  }

  it('still flips for zero Retreat Cost and leaves the Active in place on tails', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Pidgeotto MEW' }, bench: [{ card: mew }], deck: padDeck(8) },
      player2: { active: { card: mew }, bench: [{ card: goodraPrint }], deck: padDeck(8) },
    });
    spyOn(Math, 'random').and.returnValue(0.9);
    g.store.dispatch(new RetreatAction(g.player1.id, 0));
    expect(g.player1.active.getPokemonCard()?.fullName).toBe('Pidgeotto MEW');
    expect(g.player1.retreatedTurn).toBe(g.state.turn);
  });

  it('skips the flip when Wings of Light protects the retreating Pokémon', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: clefable, energy: [psychic] }, bench: [{ card: pidgey }], deck: padDeck(8) },
      player2: { active: { card: goodra }, deck: padDeck(8) },
    });
    spyOn(Math, 'random').and.returnValue(0.9);
    g.store.dispatch(new RetreatAction(g.player1.id, 0));
    expect(g.player1.active.getPokemonCard()?.fullName).toBe(pidgey);
  });

  it('requires a legal retreat and lets Switch act without a flip', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: dragapult }, bench: [{ card: pidgey }], deck: padDeck(8), hand: ['Switch SVI'] },
      player2: { active: { card: goodra }, deck: padDeck(8) },
    });
    const random = spyOn(Math, 'random').and.returnValue(0.9);
    expect(() => g.store.dispatch(new RetreatAction(g.player1.id, 0))).toThrow();
    expect(random).not.toHaveBeenCalled();
    playTrainerCard(g.store, g.store.state, 0, 'Switch SVI');
    expect(g.store.state.players[0].active.getPokemonCard()?.fullName).toBe(pidgey);
    expect(random).not.toHaveBeenCalled();
  });
});

describe('Retaliation after actual attack damage', () => {
  for (const [defender, condition] of [
    ['Numel M2a', SpecialCondition.BURNED],
    ['Numel2 ASC', SpecialCondition.BURNED],
    ['Qwilfish M4', SpecialCondition.POISONED],
    ['Qwilfish M4 52', SpecialCondition.POISONED],
  ] as const) {
    for (const [attacker, bench, damage, applies] of [
      [mew, false, 200, true], [mew, true, 200, false], [mew, false, 0, false], [clefable, false, 200, false],
    ] as const) {
      it(`${defender} ${applies ? 'affects' : 'leaves'} ${attacker} after ${damage} damage to the ${bench ? 'Bench' : 'Active'}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: attacker }, deck: padDeck(8) },
          player2: { active: { card: bench ? pidgey : defender },
            bench: [{ card: bench ? defender : pidgey }], deck: padDeck(8) },
        });
        g.state.phase = GamePhase.ATTACK;
        const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
        const hit = new PutDamageEffect(attack, damage);
        if (bench) hit.target = g.player2.bench[0];
        g.store.reduceEffect(g.state, hit);
        expect(g.player1.active.specialConditions.includes(condition)).toBe(applies);
      });
    }
  }

  for (const attacker of ['Chien-Pao M3', clefable]) {
    it(`lets Turtonator's owner choose one Energy from ${attacker} only when protection permits it`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: attacker, energy: attacker === clefable ? [psychic, psychic] : [dark, psychic] },
          deck: padDeck(8) },
        player2: { active: { card: 'Turtonator M3', damage: 100 }, bench: [{ card: pidgey }], deck: padDeck(8) },
      });
      let prompts = 0;
      g.overridePrompt('Choose cards', prompt => {
        expect(prompt.playerId).toBe(g.player2.id);
        prompts++;
        return [2];
      });
      useAttack(g.store, g.state, 0, attacker === clefable ? 'Shooting Moon' : 'Strafe');
      expect(prompts).toBe(attacker === clefable ? 0 : 1);
      expect(g.player1.active.energies.cards.map(card => card.fullName)).toEqual(attacker === clefable ? [psychic, psychic] : [dark]);
    });
  }
});

describe('Knock Out retaliation', () => {
  for (const print of ['Weezing MEW', 'Gengar ex 30C']) {
    for (const heads of [true, false]) {
      it(`${print} follows Strafe's original attacker to the Bench on ${heads ? 'heads' : 'tails'}`, () => {
        const g = setupGame({ turn: 5,
          player1: { active: { card: 'Chien-Pao M3', energy: [dark] },
            bench: [{ card: mew }], deck: padDeck(8), prizeCount: 5 },
          player2: { active: { card: print, damage: (print === 'Weezing MEW' ? 110 : 280) - 20 },
            bench: [{ card: pidgey }], deck: padDeck(8), prizeCount: 5 },
        });
        g.overridePrompt('Confirm', () => true);
        spyOn(Math, 'random').and.returnValue(heads ? 0.1 : 0.9);
        useAttack(g.store, g.state, 0, 'Strafe');

        expect(g.player1.active.getPokemonCard()?.fullName).toBe(mew);
        expect(g.player1.discard.cards.some(card => card.fullName === 'Chien-Pao M3')).toBe(heads);
        expect(g.player2.discard.cards.some(card => card.fullName === print)).toBe(true);
        expect(g.player1.getPrizeLeft()).toBe(print === 'Weezing MEW' ? 4 : 3);
        expect(g.player2.getPrizeLeft()).toBe(heads ? 4 : 5);
      });
    }
  }

  it('does not flip after Tuck Tail returns the original attacker to the hand', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Meowth ex POR', energy: [water, water, water] },
        bench: [{ card: mew }], deck: padDeck(8) },
      player2: { active: { card: 'Weezing MEW', damage: 50 }, bench: [{ card: pidgey }], deck: padDeck(8) },
    });
    spyOn(Math, 'random').and.returnValue(0.1);
    useAttack(g.store, g.state, 0, 'Tuck Tail');
    expect(g.player1.hand.cards.some(card => card.fullName === 'Meowth ex POR')).toBe(true);
    expect(g.player1.active.getPokemonCard()?.fullName).toBe(mew);
    expect(g.player2.discard.cards.some(card => card.fullName === 'Weezing MEW')).toBe(true);
    expect(g.state.logs.some(log =>
      log.message === GameLog.LOG_PLAYER_FLIPS_HEADS || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS)).toBe(false);
  });

  it('does not let Fainting Spell treat Phantom Dive counters as attack damage', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: dragapult, energy: [fire, psychic] }, deck: padDeck(8) },
      player2: { active: { card: clefable }, bench: [{ card: 'Gengar ex 30C', damage: 220 }], deck: padDeck(8) },
    });
    spyOn(Math, 'random').and.returnValue(0.1);
    g.overridePrompt('Put damage', () => [{
      target: { player: PlayerType.TOP_PLAYER, slot: SlotType.BENCH, index: 0 }, damage: 60,
    }]);
    useAttack(g.store, g.state, 0, 'Phantom Dive');
    expect(g.player2.discard.cards.some(card => card.fullName === 'Gengar ex 30C')).toBe(true);
    expect(g.player1.active.getPokemonCard()?.fullName).toBe(dragapult);
    expect(g.state.logs.some(log =>
      log.message === GameLog.LOG_PLAYER_FLIPS_HEADS || log.message === GameLog.LOG_PLAYER_FLIPS_TAILS)).toBe(false);
  });

  it('treats Wings of Light as protection against the Ability Knock Out', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: clefable, energy: [psychic, psychic] }, deck: padDeck(8) },
      player2: { active: { card: 'Weezing MEW' }, bench: [{ card: pidgey }], deck: padDeck(8) },
    });
    spyOn(Math, 'random').and.returnValue(0.1);
    useAttack(g.store, g.state, 0, 'Shooting Moon');
    expect(g.player1.active.getPokemonCard()?.fullName).toBe(clefable);
    expect(g.player2.getPrizeLeft()).toBe(6);
  });
});

describe('Modern activated and continuous Ability targets', () => {
  for (const attacker of [mew, clefable]) {
    it(`applies Scorching Steam to ${attacker} only once if allowed`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: volcanion }, deck: padDeck(8) },
        player2: { active: { card: attacker }, deck: padDeck(8) },
      });
      useAbility(g.store, g.state, 0, 'Scorching Steam');
      expect(g.player2.active.specialConditions).toEqual(attacker === mew ? [SpecialCondition.BURNED] : []);
      expect(() => useAbility(g.store, g.state, 0, 'Scorching Steam')).toThrow();
    });
  }

  it('moves Heat Cyclone Energy to its own Bench after dealing damage', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: volcanion, energy: [fire, fire, grass] },
        bench: [{ card: pidgey }], deck: padDeck(8) },
      player2: { active: { card: clefable }, bench: [{ card: mew }], deck: padDeck(8) },
    });
    let transfers = 0;
    g.overridePrompt('Attach energy', prompt => {
      expect(g.player2.active.damage).toBe(160);
      expect(prompt.playerId).toBe(g.player1.id);
      transfers++;
      return [{ to: bottomBench, index: 3 }];
    });
    useAttack(g.store, g.state, 0, 'Heat Cyclone');
    expect(transfers).toBe(1);
    expect(g.player1.bench[0].energies.cards.map(card => card.fullName)).toEqual([grass]);
    expect(g.player2.bench[0].energies.cards).toEqual([]);
  });

  it('Steel Burst counts only Metal Energy actually discarded', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Heatran TWM', energy: [metal, fire, grass, metal] }, deck: padDeck(8) },
      player2: { active: { card: mew }, deck: padDeck(8) },
    });
    useAttack(g.store, g.state, 0, 'Steel Burst');
    expect(g.player2.active.damage).toBe(100);
    expect(g.player1.active.energies.cards.map(card => card.fullName)).toEqual([fire, grass]);
  });

  it('changes Dragon Weakness from a Benched Fairy Zone unless the source is suppressed', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: mew }, bench: [{ card: "Lillie's Clefairy ex JTG" }], deck: padDeck(8) },
      player2: { active: { card: 'Dragapult ex TWM' }, bench: [{ card: 'Flutter Mane TEF' }], deck: padDeck(8) },
    });
    const stats = new CheckPokemonStatsEffect(g.player2.active);
    g.store.reduceEffect(g.state, stats);
    expect(stats.weakness).toEqual([{ type: CardType.PSYCHIC }]);

    g.player1.switchPokemon(g.player1.bench[0], g.store, g.state);
    g.player2.switchPokemon(g.player2.bench[0], g.store, g.state);
    const suppressed = new CheckPokemonStatsEffect(g.player2.bench[0]);
    g.store.reduceEffect(g.state, suppressed);
    expect(suppressed.weakness).toEqual([]);
  });

  for (const attacker of [mew, clefable]) {
    it(`checks Ability protection before returning ${attacker}'s Energy with Boisterous Wind`, () => {
      const g = setupGame({ turn: 5,
        player1: { active: { card: 'Dustox M2a' }, deck: padDeck(8) },
        player2: { active: { card: attacker, energy: [psychic] }, deck: padDeck(8) },
      });
      spyOn(Math, 'random').and.returnValue(0.1);
      g.overridePrompt('Choose cards', () => [1]);
      useAbility(g.store, g.state, 0, 'Boisterous Wind');
      expect(g.player2.hand.cards.map(card => card.fullName)).toEqual(attacker === mew ? [psychic] : []);
      expect(() => useAbility(g.store, g.state, 0, 'Boisterous Wind')).toThrow();
    });
  }

  it('reduces Bench damage and recoil with Lonely Gaze before Weakness', () => {
    const g = setupGame({ turn: 5,
      player1: { active: { card: 'Mega Lucario ex M1L' }, deck: padDeck(8) },
      player2: { active: { card: 'Pikachu 30C 28' }, bench: [{ card: mew }], deck: padDeck(8) },
    });
    g.state.phase = GamePhase.ATTACK;
    const attack = new AttackEffect(g.player1, g.player2, g.player1.active.getPokemonCard()!.attacks[0]);
    g.store.reduceEffect(g.state, new DealDamageEffect(attack, 40));
    expect(g.player2.active.damage).toBe(40);
    for (const slot of [g.player2.bench[0], g.player1.active]) {
      const hit = new PutDamageEffect(attack, 40);
      hit.target = slot;
      g.store.reduceEffect(g.state, hit);
      expect(slot.damage).toBe(20);
    }
  });
});
