import { State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

/** Discard from the original defender after damage; a printed flip still happens if it left play. */
export function discardOpponentEnergyAfterDamage(state: State, attack: AttackEffect, flip: boolean): void {
  const slot = attack.opponent.active, defender = slot.getPokemonCard();
  afterAttackDamage(state, attack, (store, next) => {
    const discard = () => {
      if (!defender || attack.opponent.active !== slot || slot.getPokemonCard() !== defender) return next;
      return DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, next, attack);
    };
    return flip ? COIN_FLIP_PROMPT(store, next, attack.player, heads => { if (heads) discard(); }) : discard();
  });
}
