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
