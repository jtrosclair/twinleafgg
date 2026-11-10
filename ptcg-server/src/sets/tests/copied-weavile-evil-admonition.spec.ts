import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { Weavile } from '../set-ultra-prism/weavile';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

class StrongerWeavile extends Weavile {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) effect.damage += 10;
    return state;
  }
}
function fixture(copied: boolean, powerCount: number, blocked = false, stronger = false) {
  const b = setupGame({ turn: 5,
    player1: { active: { card: copied ? 'Mew ex 30C' : 'Weavile UPR', energy: ['Darkness Energy SVE'] },
      bench: [{ card: copied ? 'Weavile UPR' : 'Charmander BS' }], deck: padDeck(10) },
    player2: { active: { card: powerCount > 0 ? 'Mew ex MEW' : 'Charmander BS' },
      bench: [{ card: powerCount > 1 ? 'Mew ex MEW' : 'Squirtle BS' }], deck: padDeck(10) }
  });
  const defender = b.player2.active.getPokemonCard()!;
  defender.hp = 1000; defender.weakness = []; defender.resistance = [];
  if (stronger) {
    const slot = copied ? b.player1.bench[0] : b.player1.active;
    const old = slot.getPokemonCard()!; const replacement = new StrongerWeavile(); replacement.id = old.id;
    slot.cards[slot.cards.indexOf(old)] = replacement;
  }
  if (blocked) {
    const garbodor = getCardByName('Garbodor DRX'), tool = getCardByName('Bravery Charm PAL');
    garbodor.id = 99990; tool.id = 99991;
    b.player1.bench[1].cards = [garbodor, tool]; b.player1.bench[1].tools = [tool];
  }
  b.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Evil Admonition' }));
  return b;
}

describe('copied Weavile Evil Admonition private helper', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  for (const powers of [0, 1, 2]) {
    it(`copies the attack with ${powers} opposing Ability Pokemon`, () => {
      const b = fixture(true, powers);
      expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
      expect(b.player2.active.damage).toBe(50 * powers);
    });
  }
  it('preserves an inherited subclass attack override', () => {
    const b = fixture(true, 2, false, true);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(110);
  });
  it('retains the direct attack damage', () => {
    const b = fixture(false, 2);
    useAttack(b.store, b.state, 0, 'Evil Admonition');
    expect(b.player2.active.damage).toBe(100);
  });
  it('counts blocked opposing Abilities as the current direct behavior does', () => {
    const b = fixture(false, 2, true);
    expect(() => useAttack(b.store, b.state, 0, 'Evil Admonition')).not.toThrow();
    expect(b.player2.active.damage).toBe(0);
  });
});
