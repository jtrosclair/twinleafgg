import { PutDamageEffect, DealDamageEffect, AfterDamageEffect, AddSpecialConditionsEffect, ApplyWeaknessEffect } from '../effects/attack-effects';
import { AttackEffect } from '../effects/game-effects';
import { Effect } from '../effects/effect';
import { GamePhase, State } from '../state/state';
import { PokemonCardList } from '../state/pokemon-card-list';
import { CheckHpEffect } from '../effects/check-effects';
import { StoreLike } from '../store-like';
import { SpecialCondition } from '../card/card-types';
import { getCardByName, padDeck, setupGame } from '../../../sets/tests/test-helpers';
import { useAttack } from '../../../sets/tests/card-test-helpers';

/** Deferred attack targets can cease to be table slots while reactions settle. */
describe('stale attack damage', () => {
  function jetPunch() {
    return setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole-GX CIN', energy: ['Fighting Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Sceptile CES' }, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(10) }
    });
  }
  it('keeps ordinary Jet Punch Active and Bench damage unchanged', () => {
    const g = jetPunch();
    useAttack(g.store, g.state, 0, 'Jet Punch');
    expect(g.player2.active.damage).toBe(30);
    expect(g.player2.bench[0].damage).toBe(30);
  });
  it('skips a chosen Jet Punch target removed in a nested reaction', () => {
    const g = jetPunch(), target = g.player2.bench[0], reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PutDamageEffect && effect.target === target) {
        const index = g.player2.bench.indexOf(target);
        if (index >= 0) { g.player2.bench.splice(index, 1); }
      }
      return reduce(state, effect);
    });
    expect(() => useAttack(g.store, g.state, 0, 'Jet Punch')).not.toThrow();
    expect(target.damage).toBe(0);
    expect(g.player2.active.damage).toBe(30);
  });
  it('finishes queued Jet Punch damage using its captured player when the source slot leaves the table', () => {
    const g = jetPunch(), target = g.player2.bench[0], source = g.player1.active, reduce = g.store.reduceEffect.bind(g.store);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PutDamageEffect && effect.target === target && g.player1.active === source) {
        g.player1.active = new PokemonCardList();
        g.player1.active.cards = [getCardByName('Mew ex MEW')];
      }
      return reduce(state, effect);
    });
    expect(() => useAttack(g.store, g.state, 0, 'Jet Punch')).not.toThrow();
    expect(target.damage).toBe(30);
    expect(g.player2.active.damage).toBe(30);
    expect(source.getPokemonCard()!.name).toBe('Buzzwole-GX');
  });
  for (const Damage of [PutDamageEffect, DealDamageEffect]) {
    it('does not run handlers/logs/after-damage for an already removed target: ' + Damage.name, () => {
      const g = jetPunch(), target = g.player2.bench[0];
      const damage = new Damage(new AttackEffect(g.player1, g.player2,
        g.player1.active.getPokemonCard()!.attacks[0]), 30);
      damage.target = target; g.player2.bench.splice(0, 1);
      const card = g.player2.active.getPokemonCard()!, reducer = spyOn(card, 'reduceEffect').and.callThrough();
      const log = spyOn(g.store, 'log').and.callThrough(), reduce = g.store.reduceEffect.bind(g.store);
      let afterDamage = 0;
      spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
        if (effect instanceof AfterDamageEffect) { afterDamage++; }
        return reduce(state, effect);
      });
      expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
      expect(damage.preventDefault).toBe(true);
      expect(target.damage).toBe(0);
      expect(reducer).not.toHaveBeenCalled();
      expect(log).not.toHaveBeenCalled();
      expect(afterDamage).toBe(0);
    });
  }
  it('rechecks a chosen Jet Punch target removed by a card during damage fan-out', () => {
    const g = jetPunch(), target = g.player2.bench[0], card = g.player2.active.getPokemonCard()!;
    const reducer = card.reduceEffect.bind(card);
    spyOn(card, 'reduceEffect').and.callFake((store: StoreLike, state: State, effect: Effect) => {
      if (effect instanceof PutDamageEffect && effect.target === target) {
        const index = g.player2.bench.indexOf(target);
        if (index >= 0) { g.player2.bench.splice(index, 1); }
      }
      return reducer(store, state, effect);
    });
    expect(() => useAttack(g.store, g.state, 0, 'Jet Punch')).not.toThrow();
    expect(target.damage).toBe(0);
    expect(g.player2.active.damage).toBe(30);
  });
  it('still damages a queued target that switched from Active to Bench', () => {
    const g = jetPunch(), target = g.player2.active;
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    g.player2.switchPokemon(g.player2.bench[0]);
    expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(false);
    expect(target.damage).toBe(30);
    expect(g.player2.active.damage).toBe(0);
  });
  it('retains the original source Pokemon type when it switches to the Bench', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Buzzwole-GX CIN', energy: ['Fighting Energy SVE'] }, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    const source = g.player1.active;
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      source.getPokemonCard()!.attacks[0]), 30);
    g.player1.switchPokemon(g.player1.bench[0]);
    expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
    expect(g.player2.active.damage).toBe(0); // Fighting Resistance still uses the original attacker.
    expect(damage.source).toBe(source);
  });
  it('keeps completed damage/log ownership when the target leaves during a post-damage HP query', () => {
    const g = jetPunch(), target = g.player2.active, reduce = g.store.reduceEffect.bind(g.store);
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof CheckHpEffect && target.damage > 0 && g.player2.active === target) {
        g.player2.active = new PokemonCardList();
        g.player2.active.cards = [getCardByName('Mew ex MEW')];
      }
      return reduce(state, effect);
    });
    expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
    expect(target.damage).toBe(30);
    expect(g.player2.active.damage).toBe(0);
  });
  it('rechecks target ownership after nested Weakness processing', () => {
    const g = jetPunch(), target = g.player2.active, reduce = g.store.reduceEffect.bind(g.store);
    g.state.phase = GamePhase.ATTACK;
    const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    spyOn(g.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof ApplyWeaknessEffect && g.player2.active === target) {
        g.player2.active = new PokemonCardList();
        g.player2.active.cards = [getCardByName('Mew ex MEW')];
      }
      return reduce(state, effect);
    });
    expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(true);
    expect(target.damage).toBe(0);
  });
  it('preserves Fire Weakness on an ordinary actual attack', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Charmander BS', energy: ['Fire Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Bulbasaur BS' }, deck: padDeck(10) }
    });
    useAttack(g.store, g.state, 0, 'Scratch'); expect(g.player2.active.damage).toBe(20);
  });
  it('preserves Fighting Resistance on an ordinary actual attack', () => {
    const g = setupGame({ turn: 2,
      player1: { active: { card: 'Machamp BS', energy: ['Fighting Energy SVE', 'Fighting Energy SVE', 'Fighting Energy SVE', 'Fighting Energy SVE'] }, deck: padDeck(10) },
      player2: { active: { card: 'Mew ex MEW' }, deck: padDeck(10) }
    });
    useAttack(g.store, g.state, 0, 'Seismic Toss'); expect(g.player2.active.damage).toBe(30);
  });
  it('cancels DealDamage removed during fan-out before real Gloom Weakness/Resistance queries', () => {
    const g = jetPunch(), target = g.player2.active, card = g.player1.active.getPokemonCard()!;
    g.player1.bench[0].cards = [getCardByName('Gloom AQ')];
    const reducer = card.reduceEffect.bind(card);
    spyOn(card, 'reduceEffect').and.callFake((store: StoreLike, state: State, effect: Effect) => {
      if (effect instanceof DealDamageEffect && effect.target === target) {
        g.player2.active = new PokemonCardList();
        g.player2.active.cards = [getCardByName('Mew ex MEW')];
      }
      return reducer(store, state, effect);
    });
    const damage = new DealDamageEffect(new AttackEffect(g.player1, g.player2,
      card.attacks[0]), 30);
    expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
    expect(damage.preventDefault).toBe(true);
    expect(target.damage).toBe(0);
  });
  for (const flag of ['preventDamageNextTurn', 'preventEffectsOfAttacksNextTurn'] as const) {
    it('retains damage-prevention checks for a detached attack source: ' + flag, () => {
      const g = jetPunch(), source = g.player1.active;
      const damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
        source.getPokemonCard()!.attacks[0]), 30);
      g.player1.active = new PokemonCardList();
      g.player1.active.cards = [getCardByName('Mew ex MEW')];
      g.player2.active[flag] = true;
      expect(() => g.store.reduceEffect(g.state, damage)).not.toThrow();
      expect(damage.preventDefault).toBe(flag === 'preventDamageNextTurn');
      expect(g.player2.active.damage).toBe(flag === 'preventDamageNextTurn' ? 0 : 30);
    });
  }
  for (const prevented of [false, true]) {
    it('retains non-damage-effect prevention for a detached source: ' + prevented, () => {
      const g = jetPunch(), source = g.player1.active;
      const effect = new AddSpecialConditionsEffect(new AttackEffect(g.player1, g.player2,
        source.getPokemonCard()!.attacks[0]), [SpecialCondition.POISONED]);
      g.player1.active = new PokemonCardList();
      g.player1.active.cards = [getCardByName('Mew ex MEW')];
      g.player2.active.preventEffectsOfAttacksNextTurn = prevented;
      expect(() => g.store.reduceEffect(g.state, effect)).not.toThrow();
      expect(effect.preventDefault).toBe(prevented);
      expect(g.player2.active.specialConditions.includes(SpecialCondition.POISONED)).toBe(!prevented);
    });
  }
  it('continues rejecting an invalid empty target slot that still belongs to a player', () => {
    const g = jetPunch(), damage = new PutDamageEffect(new AttackEffect(g.player1, g.player2,
      g.player1.active.getPokemonCard()!.attacks[0]), 30);
    damage.target = g.player2.bench[1];
    expect(() => g.store.reduceEffect(g.state, damage)).toThrow();
  });
});
