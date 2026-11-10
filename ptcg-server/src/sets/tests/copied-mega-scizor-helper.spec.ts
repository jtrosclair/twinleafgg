import { AttackEffect } from '../../game/store/effects/game-effects';
import { ChooseCardsPrompt, ChooseCardsPromptType } from '../../game/store/prompts/choose-cards-prompt';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { clearCopyAttackSessionsForTests } from '../../game/store/prefabs/copy-attack-delegation';
import { MScizorEx } from '../set-breakpoint/m-scizor-ex';
import { MScizorEx2 } from '../set-breakpoint/other-prints';
import { getCardByName, padDeck, setupGame } from './test-helpers';
import { useAbility, useAttack } from './card-test-helpers';

class StrongerScizor extends MScizorEx {
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    state = super.reduceEffect(store, state, effect);
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) effect.damage += 10;
    return state;
  }
}
function fixture(copied: boolean, special: boolean, stronger = false) {
  const b = setupGame({ turn: 5,
    player1: { active: { card: copied ? 'Mew ex 30C' : 'M Scizor-EX BKP', energy: ['Metal Energy SVE', 'Metal Energy SVE'] },
      bench: [{ card: copied ? 'M Scizor-EX BKP' : 'Mew ex MEW' }], deck: padDeck(10) },
    player2: { active: { card: 'Mew ex MEW', energy: special ? ['Double Turbo Energy BRS'] : [] }, deck: padDeck(10) }
  });
  const defender = b.player2.active.getPokemonCard()!;
  defender.hp = 1000; defender.weakness = []; defender.resistance = [];
  if (stronger) {
    const slot = copied ? b.player1.bench[0] : b.player1.active;
    const old = slot.getPokemonCard()!; const replacement = new StrongerScizor(); replacement.id = old.id;
    slot.cards[slot.cards.indexOf(old)] = replacement;
  }
  b.overridePrompt('Choose attack', () => ({ index: 0, attack: 'Iron Crusher' }));
  if (special) b.overridePrompt(ChooseCardsPromptType, prompt => {
    const choose = prompt as ChooseCardsPrompt;
    return [choose.cards.cards.findIndex(card => card.fullName === 'Double Turbo Energy BRS')];
  });
  return b;
}

describe('copied M Scizor Iron Crusher private helper', () => {
  beforeEach(() => clearCopyAttackSessionsForTests());
  it('lets Mew discard opposing Special Energy after confirmation', () => {
    const b = fixture(true, true);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.discard.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('preserves a subclass attack override', () => {
    const b = fixture(true, true, true);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(130);
    expect(b.player2.discard.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('keeps the direct attack and Special Energy discard', () => {
    const b = fixture(false, true);
    useAttack(b.store, b.state, 0, 'Iron Crusher');
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.discard.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('keeps the Special Energy when the copied effect is declined', () => {
    const b = fixture(true, true);
    b.overridePrompt('Confirm', () => false);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.active.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('copies the registered metadata-only reprint', () => {
    const b = fixture(true, true);
    const original = b.player1.bench[0].getPokemonCard()!;
    const replacement = new MScizorEx2(); replacement.id = original.id;
    b.player1.bench[0].cards = [replacement];
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.discard.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('offers and discards a Stadium when copied with both targets available', () => {
    const b = fixture(true, true);
    const stadium = getCardByName('Training Court RCL'); stadium.id = 99992;
    b.player2.stadium.cards.push(stadium);
    b.overridePrompt('Confirm', () => {
      b.overridePrompt('Confirm', () => false);
      return true;
    });
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.stadium.cards.length).toBe(0);
    expect(b.player2.discard.cards).toContain(stadium);
    expect(b.player2.active.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('discards Special Energy when copied with both targets and Energy is selected', () => {
    const b = fixture(true, true);
    const stadium = getCardByName('Training Court RCL'); stadium.id = 99992;
    b.player2.stadium.cards.push(stadium);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
    expect(b.player2.stadium.cards).toContain(stadium);
    expect(b.player2.discard.cards.some(c => c.fullName === 'Double Turbo Energy BRS')).toBe(true);
  });
  it('works without a target to discard', () => {
    const b = fixture(true, false);
    expect(() => useAbility(b.store, b.state, 0, 'Memory Helix')).not.toThrow();
    expect(b.player2.active.damage).toBe(120);
  });
});
