import { CheckHpEffect } from '../effects/check-effects';
import { AttackEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { afterAttackDamage } from './attack-after-damage';

/** Queue a post-damage effect for the same defending card, still Active. */
export function afterAttackDamageForOriginalDefender(
  state: State, effect: AttackEffect,
  apply: (store: StoreLike, state: State, target: PokemonCardList) => State,
): void {
  const slot = effect.opponent.active;
  const card = slot.getPokemonCard();
  afterAttackDamage(state, effect, (store, afterState) => {
    if (!card || effect.opponent.active !== slot || slot.getPokemonCard() !== card) return afterState;
    return apply(store, afterState, slot);
  });
}

/** Follow up on lethal damage dealt by this attack to its original defender. */
export function afterAttackDamageKnockOut(
  state: State, effect: AttackEffect, apply: (store: StoreLike, state: State) => State,
): void {
  const attacker = effect.source.getPokemonCard();
  afterAttackDamageForOriginalDefender(state, effect, (store, state, target) => {
    const hit = target.attackDamageKnockOut;
    if (!attacker || effect.source.getPokemonCard() !== attacker
      || hit?.sourceCard !== attacker || hit.attack !== effect.attack
      || hit.playerId !== effect.player.id || hit.turn !== state.turn) return state;
    const hp = new CheckHpEffect(effect.opponent, target);
    state = store.reduceEffect(state, hp);
    return target.damage >= hp.hp ? apply(store, state) : state;
  });
}
