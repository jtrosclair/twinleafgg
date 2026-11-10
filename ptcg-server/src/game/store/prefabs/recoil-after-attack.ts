import { AttackEffect } from '../effects/game-effects';
import { DealDamageEffect } from '../effects/attack-effects';
import { State } from '../state/state';
import { afterAttackDamage } from './attack-after-damage';

/** Deal recoil after attack damage to the attacker that used the attack. */
export function recoilAfterAttack(state: State, effect: AttackEffect, amount: number): void {
  const source = effect.source;
  const attacker = source.getPokemonCard();
  afterAttackDamage(state, effect, (store, afterState) => {
    const inPlay = afterState.players.some(player => player.active === source || player.bench.includes(source));
    if (!attacker || !inPlay || source.getPokemonCard() !== attacker) return afterState;
    const selfAttack = new AttackEffect(effect.player, effect.opponent, effect.attack);
    selfAttack.source = source;
    selfAttack.ignoreWeakness = true;
    selfAttack.ignoreResistance = true;
    const damage = new DealDamageEffect(selfAttack, amount);
    damage.target = source;
    return store.reduceEffect(afterState, damage);
  });
}
