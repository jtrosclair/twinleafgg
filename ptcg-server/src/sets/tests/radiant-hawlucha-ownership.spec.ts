import { RadiantHawlucha } from '../set-astral-radiance/radiant-hawlucha';
import { Mewex } from '../set-30th-celebration/mew-ex';
import { setupGame, padDeck } from './test-helpers';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State, GamePhase } from '../../game/store/state/state';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';

describe('Radiant Hawlucha Big Match ownership', () => {
  function setup(opponent = 'Duraludon VMAX EVS') {
    const b = setupGame({ turn: 2, player1: {
      active: { card: 'Ralts SIT' }, bench: [{ card: 'Radiant Hawlucha ASR' }], deck: padDeck(10)
    }, player2: { active: { card: opponent }, bench: [{ card: 'Duraludon VMAX EVS' }], deck: padDeck(10) } });
    const card = b.player1.bench[0].getPokemonCard() as RadiantHawlucha;
    const attack = new AttackEffect(b.player1, b.player2, { name: 'Fixture', cost: [], damage: 40, text: '' });
    return { ...b, card, attack };
  }
  it('boosts attacks against the opposing Active VMAX while on the Bench', () => {
    const b = setup(), e = new DealDamageEffect(b.attack, 40);
    b.card.reduceEffect(b.store, b.state, e); expect(e.damage).toBe(70);
  });
  it('does not boost damage against a Benched VMAX or a non-VMAX Active', () => {
    const b = setup(), e = new DealDamageEffect(b.attack, 40);
    e.target = b.player2.bench[0]; b.card.reduceEffect(b.store, b.state, e); expect(e.damage).toBe(40);
    const c = setup('Ralts SIT'), f = new DealDamageEffect(c.attack, 40);
    c.card.reduceEffect(c.store, c.state, f); expect(f.damage).toBe(40);
  });
  it('does not boost attacks when Big Match is blocked', () => {
    const b = setup(), e = new DealDamageEffect(b.attack, 40);
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect && effect.card === b.card) throw new Error('Ability blocked');
      return reduce(state, effect);
    });
    b.card.reduceEffect(b.store, b.state, e); expect(e.damage).toBe(40);
  });
  it('does not inherit the suppressed Big Match when Mew copies Spiral Kick', () => {
    const b = setupGame({ turn: 2, player1: {
      active: { card: 'Mew ex 30C', energy: ['Fighting Energy SVE', 'Fighting Energy SVE'] },
      bench: [{ card: 'Radiant Hawlucha ASR' }], deck: padDeck(10)
    }, player2: { active: { card: 'Duraludon VMAX EVS' }, deck: padDeck(10) } });
    b.player2.active.getPokemonCard()!.hp = 400;
    const source = b.player1.bench[0].getPokemonCard() as RadiantHawlucha;
    const mew = b.player1.active.getPokemonCard() as Mewex;
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect && effect.card === source) throw new Error('Ability blocked');
      return reduce(state, effect);
    });
    b.state.phase = GamePhase.ATTACK;
    b.store.reduceEffect(b.state, new PowerEffect(b.player1, mew.powers[0], mew));
    const answer = (value: any) => {
      const prompt = b.state.prompts.filter(p => p.result === undefined).pop();
      if (!prompt) throw new Error('Expected pending prompt');
      (b.store as any).reducePrompt(b.state, new ResolvePromptAction(prompt.id, value));
    };
    answer(source.attacks[0]); b.state.phase = GamePhase.FINISHED; answer(null);
    expect(b.player2.active.damage).toBe(50);
  });
});
