import { Player } from '../state/player';
import { PokemonCardList } from '../state/pokemon-card-list';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { TrainerCard } from '../card/trainer-card';
import { StadiumEffect } from '../effects/play-card-effects';

// Mirror upstream's re-entrancy guard: a Stadium that blocks Abilities may
// itself be blocked by New Moon while its Ability-permission check runs.
let probingStadiumEffect = false;

/** Whether the Stadium's effect is prevented for this Pokémon. */
export function IS_STADIUM_EFFECT_BLOCKED(
  store: StoreLike, state: State, player: Player, target: PokemonCardList, stadium?: TrainerCard
): boolean {
  const nested = probingStadiumEffect;
  const probe = new StadiumEffect(player, target, stadium);
  probe.skipAbilityLockCheck = nested;
  if (!nested) probingStadiumEffect = true;
  try {
    store.reduceEffect(state, probe);
    return probe.preventDefault;
  } catch {
    return true;
  } finally {
    if (!nested) probingStadiumEffect = false;
  }
}
