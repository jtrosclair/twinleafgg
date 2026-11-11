import { State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EffectOfAttackEffect } from '../../game/store/effects/effect-of-attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

class Round28SelfProtection extends EffectOfAttackEffect {
  readonly type = 'ROUND28_SELF_PROTECTION';
  constructor(base: AttackEffect, private readonly preventEffects: boolean) { super(base); this.target = base.source; }
  applyEffect(): void {
    this.target.preventDamageNextTurnPending = true;
    if (this.preventEffects) this.target.preventEffectsOfAttacksNextTurnPending = true;
  }
}

/** Flip after damage and protect the physical attacker through the opponent's next turn. */
export function coinSelfProtectionAfterDamage(state: State, attack: AttackEffect, preventEffects: boolean): void {
  const source = attack.source, attacker = source.getPokemonCard();
  afterAttackDamage(state, attack, (store, next) => COIN_FLIP_PROMPT(store, next, attack.player, heads => {
    if (!heads || !attacker || source.getPokemonCard() !== attacker ||
      !next.players.some(p => p.active === source || p.bench.includes(source))) return;
    return store.reduceEffect(next, new Round28SelfProtection(attack, preventEffects));
  }));
}
