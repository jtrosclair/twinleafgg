import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Zarude } from '../set-pitch-black/zarude';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

class StrongerZarude extends Zarude {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) effect.damage += 10;
    return state;
  }
}
function fixture(copied: boolean, shadow: 'own' | 'opponent' | 'none', stronger = false) {
  const b = setupGame({ turn: 5,
    player1: { active: { card: copied ? 'Mew ex 30C' : 'Zarude M5', energy: ['Darkness Energy SVE', 'Darkness Energy SVE', 'Darkness Energy SVE'] },
      bench: [{ card: copied ? 'Zarude M5' : 'Mew ex MEW' }], deck: padDeck(10) },
    player2: { active: { card: 'Mew ex MEW' }, bench: [{ card: 'Mew ex MEW' }], deck: padDeck(10) }
  });
  const defender = b.player2.active.getPokemonCard()!;
  defender.hp = 1000; defender.weakness = []; defender.resistance = [];
  if (stronger) {
    const slot = copied ? b.player1.bench[0] : b.player1.active;
    const old = slot.getPokemonCard()!; const replacement = new StrongerZarude(); replacement.id = old.id;
    slot.cards[slot.cards.indexOf(old)] = replacement;
  }
  if (shadow !== 'none') {
    const slot = shadow === 'own' ? b.player1.bench[0] : b.player2.bench[0];
    const energy = getCardByName('Shadow Darkness Energy M5'); energy.id = 99991; slot.cards.push(energy);
  }
  b.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Shadow Whip' }));
  return b;
}

describe('Zarude Shadow Whip copied attack ownership', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  for (const shadow of ['own', 'opponent', 'none'] as const) {
    it(`copies the attack correctly with ${shadow} Shadow Darkness Energy`, () => {
      const b = fixture(true, shadow);
      expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
      expect(b.player2.active.damage).toBe(shadow === 'own' ? 170 : 100);
    });
  }
  it('preserves an inherited subclass attack override', () => {
    const b = fixture(true, 'own', true);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(180);
  });
  it('retains the direct attack bonus', () => {
    const b = fixture(false, 'own');
    useAttack(b.store, b.state, 0, 'Shadow Whip');
    expect(b.player2.active.damage).toBe(170);
  });
});
