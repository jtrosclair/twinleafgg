import { SpecialCondition } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { afterAttackDamage } from '../../game/store/prefabs/attack-after-damage';
import { COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';

/** Flip after damage, then affect only the original Defending Pokémon. */
export function flipForStatusAfterDamage(state: State, attack: AttackEffect, status: SpecialCondition): void {
  const defender = attack.opponent.active;
  const pokemon = defender.getPokemonCard();
  afterAttackDamage(state, attack, (store, resultState) =>
    COIN_FLIP_PROMPT(store, resultState, attack.player, heads => {
      if (!heads || !pokemon || attack.opponent.active !== defender || defender.getPokemonCard() !== pokemon) return;
      const add = new AddSpecialConditionsEffect(attack, [status]);
      add.target = defender;
      store.reduceEffect(resultState, add);
    })
  );
}
