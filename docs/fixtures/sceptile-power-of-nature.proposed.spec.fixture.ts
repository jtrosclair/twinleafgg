import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { GamePhase, State } from '../../game/store/state/state';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { cloneAttacks, openCopyAttackSession, runDelegatedCopiedAttackGenerator } from '../../game/store/prefabs/copy-attack-delegation';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAttack } from './card-test-helpers';
import { Sceptile } from '../set-celestial-storm/sceptile';

/** Actual attack actions are the primary regression oracle; direct effects isolate Bench/ownership cases. */
describe('Sceptile CES Power of Nature', () => {
  function game(energy: string[] = []) {
    return setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Sceptile CES', energy }, deck: padDeck(10) }
    });
  }
  function attack(g: ReturnType<typeof setupGame>) {
    useAttack(g.store, g.state, 0, 'Touchdown');
  }
  function suppress(g: ReturnType<typeof setupGame>, cards: unknown[]) {
    const reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect && cards.includes(effect.card)) { throw new Error('Ability suppressed'); }
      return reduce(state, effect);
    });
  }
  function benchDamage(g: ReturnType<typeof setupGame>, index: number, ownSide = false) {
    g.state.phase = GamePhase.ATTACK;
    const effect = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    effect.target = (ownSide ? g.player1 : g.player2).bench[index];
    g.store.reduceEffect(g.state, effect);
    return effect;
  }

  it('does not protect Sceptile without attached Grass Energy', () => {
    const g = game(); attack(g); expect(g.player2.active.damage).toBe(60);
  });
  it('protects Sceptile with attached Grass Energy', () => {
    const g = game(['Grass Energy SVE']); attack(g); expect(g.player2.active.damage).toBe(0);
  });
  it('does not protect when the Ability is suppressed', () => {
    const g = game(['Grass Energy SVE']); suppress(g, [g.player2.active.getPokemonCard()!]);
    attack(g); expect(g.player2.active.damage).toBe(60);
  });
  it('does not protect the opposing player from its owner\'s Ultra Beast', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, bench: [{ card: 'Sceptile CES' }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW', energy: ['Grass Energy SVE'] }, deck: padDeck(10) }
    });
    attack(g); expect(g.player2.active.damage).toBe(60);
  });
  it('lets a Benched Sceptile protect its own Active Pokemon', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW', energy: ['Grass Energy SVE'] }, bench: [{ card: 'Sceptile CES' }], deck: padDeck(10) }
    });
    attack(g); expect(g.player2.active.damage).toBe(0);
  });
  it('checks Grass Energy on the damaged Pokemon rather than the protecting Sceptile', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Sceptile CES', energy: ['Grass Energy SVE'] }], deck: padDeck(10) }
    });
    attack(g); expect(g.player2.active.damage).toBe(60);
  });
  for (const entry of [
    { energy: 'Rainbow Energy SUM', temple: false, damage: 0 },
    { energy: 'Double Colorless Energy BS', temple: false, damage: 60 },
    { energy: 'Fire Energy SVE', temple: false, damage: 60 },
    { energy: 'Rainbow Energy SUM', temple: true, damage: 60 },
    { energy: 'Grass Energy SVE', temple: true, damage: 0 },
    { energy: 'Unit Energy GRW UPR', temple: false, damage: 0 },
    { energy: 'Unit Energy GRW UPR', temple: true, damage: 60 }
  ]) {
    it('uses effective Energy types: ' + entry.energy + ', Temple=' + entry.temple, () => {
      const g = game([entry.energy]);
      if (entry.temple) { g.player1.stadium.cards.push(getCardByName('Temple of Sinnoh ASR')); }
      attack(g); expect(g.player2.active.damage).toBe(entry.damage);
    });
  }
  for (const energy of [[], ['Grass Energy SVE']]) {
    it('alternate Sceptile print inherits the same Energy requirement: ' + energy.length, () => {
      const g = setupGame({ turn: 2,
        player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
        player2: { active: { card: 'Sceptile2 CES', energy }, deck: padDeck(10) }
      });
      attack(g); expect(g.player2.active.damage).toBe(energy.length ? 0 : 60);
      expect(g.player2.active.getPokemonCard()!.fullName).toBe('Sceptile2 CES');
    });
  }
  for (const count of [1, 2]) {
    it('checks suppression independently for two in-play Sceptile, blocked=' + count, () => {
      const g = setupGame({ turn: 2,
        player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
        player2: { active: { card: 'Mew ex MEW', energy: ['Grass Energy SVE'] }, bench: [{ card: 'Sceptile CES' }, { card: 'Sceptile2 CES' }], deck: padDeck(10) }
      });
      suppress(g, g.player2.bench.slice(0, count).map(slot => slot.getPokemonCard()!));
      attack(g); expect(g.player2.active.damage).toBe(count === 1 ? 0 : 60);
    });
  }
  it('honors actual Garbotoxin suppression', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, bench: [{ card: 'Garbodor BKP', tools: ['Float Stone PLF'] }], deck: padDeck(10) },
      player2: { active: { card: 'Sceptile CES', energy: ['Grass Energy SVE'] }, deck: padDeck(10) }
    });
    attack(g); expect(g.player2.active.damage).toBe(60);
  });
  for (const energy of [[], ['Grass Energy SVE']]) {
    it('protects a Benched target only when that target provides Grass: ' + energy.length, () => {
      const g = setupGame({ turn: 2,
        player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
        player2: { active: { card: 'Sceptile CES' }, bench: [{ card: 'Mew ex MEW', energy }], deck: padDeck(10) }
      });
      benchDamage(g, 0); expect(g.player2.bench[0].damage).toBe(energy.length ? 0 : 30);
    });
  }
  it('does not prevent friendly attack damage from its own Ultra Beast', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, bench: [{ card: 'Sceptile CES' }, { card: 'Mew ex MEW', energy: ['Grass Energy SVE'] }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    benchDamage(g, 1, true); expect(g.player1.bench[1].damage).toBe(30);
  });
  it('does not grant Power of Nature to a Pokemon copying Powerful Storm', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole CEC', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW', energy: ['Grass Energy SVE'] }, deck: padDeck(10) }
    });
    const source = new Sceptile(), copycat = g.player2.active.getPokemonCard()!, attacks = cloneAttacks(source.attacks);
    openCopyAttackSession(g.state, g.player2, copycat, source, attacks, attacks[0]);
    attack(g); expect(g.player2.active.damage).toBe(60);
  });
  it('uses the actual attacker Ultra Beast tag rather than the copied attack owner', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Mew ex 30C', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }, bench: [{ card: 'Buzzwole CEC' }], deck: padDeck(10) },
      player2: { active: { card: 'Sceptile CES', energy: ['Grass Energy SVE'] }, deck: padDeck(10) }
    });
    const source = g.player1.bench[0].getPokemonCard()!;
    g.state.phase = GamePhase.ATTACK;
    const generator = runDelegatedCopiedAttackGenerator(() => generator.next(), {
      store: g.store, state: g.state, player: g.player1, opponent: g.player2,
      copycatCard: g.player1.active.getPokemonCard()!, sourceCard: source, selectedAttack: source.attacks[0], skipLog: true
    });
    expect(generator.next().done).toBe(true);
    expect(g.player2.active.damage).toBe(60);
  });
  it('does not evaluate protection for a queued target slot that left the table', () => {
    const g = game(['Grass Energy SVE']), card = g.player2.active.getPokemonCard()!;
    const target = g.player2.bench[0]; target.cards = [getCardByName('Mew ex MEW')];
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    damage.target = target; g.player2.bench.splice(0, 1);
    // Exercise the card's protection handler; the core owns cancellation of stale damage events.
    expect(() => card.reduceEffect(g.store, g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(false);
  });
  it('retains the captured attack owner when its source slot left the table', () => {
    const g = game(['Grass Energy SVE']), card = g.player2.active.getPokemonCard()!;
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    g.player1.active = new PokemonCardList();
    g.player1.active.cards = [getCardByName('Mew ex MEW')];
    expect(() => card.reduceEffect(g.store, g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(true);
  });
  it('ignores off-board Sceptile before evaluating a queued damage target', () => {
    const g = game(['Grass Energy SVE']), card = g.player2.active.getPokemonCard()!;
    const target = g.player2.bench[0]; target.cards = [getCardByName('Mew ex MEW')];
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    damage.target = target; g.player2.bench.splice(0, 1);
    g.player2.active.moveTo(g.player2.hand); g.player2.active.cards = [getCardByName('Mew ex MEW')];
    const reduce = spyOn(g.store, 'reduceEffect').and.callThrough();
    expect(() => card.reduceEffect(g.store, g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(false);
    expect(reduce).not.toHaveBeenCalled();
  });
  it('preserves Powerful Storm\'s normal energy scaling', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Sceptile CES', energy: ['Grass Energy SVE'] }, bench: [{ card: 'Mew ex MEW', energy: ['Grass Energy SVE', 'Grass Energy SVE'] }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    useAttack(g.store, g.state, 0, 'Powerful Storm'); expect(g.player2.active.damage).toBe(60);
  });
});
