import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Player } from '../../game/store/state/player';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
/** Pokémon cards in discard whose Ability name is Ghost Veil (used by Sinistcha line / Spiritomb / Dhelmise). */
export declare function countGhostVeilPokemonInDiscard(player: Player): number;
/**
 * Passive Ability: This Pokémon can't be affected by effects of attacks or Abilities from your opponent's Pokémon.
 * Refs: set-burning-shadows/alolan-ninetales.ts (AbstractAttackEffect — blocks attack-sourced status via preventDefault before attackReducer);
 *       set-lost-origin/enamorus-v.ts (AddSpecialConditionsPowerEffect — ability-sourced Special Conditions).
 */
export declare function reduceGhostVeil(store: StoreLike, state: State, effect: Effect, self: PokemonCard): State;
