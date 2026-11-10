import { SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect, HealTargetEffect } from '../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { afterAttackDamageForOriginalDefender } from '../../game/store/prefabs/post-damage-identity';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';

/** Apply a condition only to the same Pokémon that was defending when the attack began. */
export function conditionAfterDamage(state: State, effect: AttackEffect, condition: SpecialCondition): void {
  afterAttackDamageForOriginalDefender(state, effect, (store, nextState, target) => {
    const add = new AddSpecialConditionsEffect(effect, [condition]);
    add.target = target;
    return store.reduceEffect(nextState, add);
  });
}

/** The coin event must still happen if the original Defending Pokémon left play. */
export function coinConditionAfterDamage(state: State, effect: AttackEffect, condition: SpecialCondition): void {
  const target = effect.opponent.active, defender = target.getPokemonCard();
  afterAttackDamage(state, effect, (store, nextState) => COIN_FLIP_PROMPT(store, nextState, effect.player, heads => {
    if (!heads || !defender || effect.opponent.active !== target || target.getPokemonCard() !== defender) return;
    const add = new AddSpecialConditionsEffect(effect, [condition]);
    add.target = target;
    store.reduceEffect(nextState, add);
  }));
}

/** Heal the physical attacker even if it moved to a different in-play position. */
export function healAttackerAfterDamage(state: State, effect: AttackEffect, amount: number): void {
  const target = effect.source, attacker = target.getPokemonCard();
  afterAttackDamage(state, effect, (store, nextState) => {
    const inPlay = nextState.players.some(player => player.active === target || player.bench.includes(target));
    if (!attacker || !inPlay || target.getPokemonCard() !== attacker) return nextState;
    const heal = new HealTargetEffect(effect, amount);
    heal.target = target;
    return store.reduceEffect(nextState, heal);
  });
}
