import { PokemonCard } from '../card/pokemon-card';
import { PowerType } from '../card/pokemon-types';
import { CheckPokemonPowersEffect } from '../effects/check-effects';
import { Player } from '../state/player';
import { State } from '../state/state';
import { StoreLike } from '../store-like';

export function pokemonHasEffectiveAbility(
  store: StoreLike, state: State, owner: Player, card: PokemonCard | undefined,
): boolean {
  if (!card) return false;
  const check = new CheckPokemonPowersEffect(owner, card);
  // Some Pokémon append inherited powers to the query result.
  check.powers = [...check.powers];
  store.reduceEffect(state, check);
  return check.powers.some(power => power.powerType === PowerType.ABILITY);
}
