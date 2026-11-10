import { Kingambit } from '../set-scarlet-and-violet/kingambit';
import { setupGame, padDeck } from './test-helpers';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { GamePhase } from '../../game/store/state/state';
import { ResolvePromptAction } from '../../game/store/actions/resolve-prompt-action';
import { Mewex } from '../set-30th-celebration/mew-ex';

describe('Kingambit Leadership ownership', () => {
  function setup(attacker = 'Ralts SIT') {
    const game = setupGame({ turn: 2, player1: {
      active: { card: attacker }, bench: [{ card: 'Kingambit SVI' }], deck: padDeck(10)
    }, player2: { active: { card: 'Ralts SIT' }, bench: [{ card: 'Ralts SIT' }], deck: padDeck(10) } });
    const card = game.player1.bench[0].getPokemonCard() as Kingambit;
    const move = new AttackEffect(game.player1, game.player2,
      { name: 'Fixture', cost: [], damage: 40, text: '' });
    return { ...game, card, move };
  }

  it('boosts a Basic Pokémon attacking the opposing Active', () => {
    const b = setup(), e = new DealDamageEffect(b.move, 40);
    b.card.reduceEffect(b.store, b.state, e);
    expect(e.damage).toBe(70);
  });

  it('does not boost damage against a Benched Pokémon', () => {
    const b = setup(), e = new DealDamageEffect(b.move, 40);
    e.target = b.player2.bench[0];
    b.card.reduceEffect(b.store, b.state, e);
    expect(e.damage).toBe(40);
  });

  it('does not boost an Evolution Pokémon', () => {
    const b = setup('Kirlia SIT'), e = new DealDamageEffect(b.move, 40);
    b.card.reduceEffect(b.store, b.state, e);
    expect(e.damage).toBe(40);
  });

  it('does not apply Leadership while the Ability is blocked', () => {
    const b = setup(), e = new DealDamageEffect(b.move, 40);
    const reduce = b.store.reduceEffect.bind(b.store);
    spyOn(b.store, 'reduceEffect').and.callFake((state: State, effect: Effect) => {
      if (effect instanceof PowerEffect) throw new Error('Ability blocked');
      return reduce(state, effect);
    });
    b.card.reduceEffect(b.store, b.state, e);
    expect(e.damage).toBe(40);
  });

  it('copies Kingambit’s attack without its suppressed Ability boosting the copying Pokémon', () => {
    const b = setupGame({ turn: 2, player1: {
      active: { card: 'Mew ex 30C', energy: ['Darkness Energy SVE', 'Darkness Energy SVE', 'Darkness Energy SVE'] },
      bench: [{ card: 'Kingambit SVI' }], deck: padDeck(10)
    }, player2: { active: { card: 'Ralts SIT' }, deck: padDeck(10) } });
    b.player2.active.getPokemonCard()!.hp = 400;
    const source = b.player1.bench[0].getPokemonCard() as Kingambit;
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
    answer(source.attacks[0]);
    b.state.phase = GamePhase.FINISHED;
    answer(null);
    expect(b.player2.active.damage).toBe(160);
  });
});
