import { Card, Player, State, StoreLike } from '../..';
import { PokemonCard } from '../card/pokemon-card';
import { Attack } from '../card/pokemon-types';
import { PowerEffect } from '../effects/game-effects';
import { PokemonCardList } from '../state/pokemon-card-list';
export declare function findPokemonCardForAttack(cards: Card[], attack: Attack): PokemonCard | undefined;
export interface BuildAttackListOptions {
    /** Only include Pokémon matching this predicate. */
    filter?: (cardList: PokemonCardList, card: PokemonCard) => boolean;
    /** Also scan the opponent's in-play Pokémon. */
    includeOpponent?: boolean;
    /** Pokémon not in play (discard pile, Lost Zone, evolution stack, etc.). */
    extraCards?: PokemonCard[];
    /** Card whose own cost modifiers apply to the copied attack. Defaults to Active. */
    copycatCard?: PokemonCard;
}
/**
 * Build attack prompt data with energy-cost blocking for ability-based copy effects.
 */
export declare function buildAttackListWithEnergyBlocking(state: State, store: StoreLike, player: Player, options?: BuildAttackListOptions): {
    pokemonCards: PokemonCard[];
    blocked: {
        index: number;
        attack: string;
    }[];
};
export interface CopyAttackViaAbilityOptions extends BuildAttackListOptions {
    copycatCard: PokemonCard;
    allowCancel?: boolean;
    /** When false, the copycat may be on the Bench while another Pokémon is Active. Default true. */
    requireActiveCopycat?: boolean;
}
/**
 * Ability: choose an attack from in-play Pokémon (with energy blocking) and use it.
 * Runs through UseAttackEffect with delegateFrom so energy/status checks apply.
 */
export declare function COPY_ATTACK_VIA_ABILITY(store: StoreLike, state: State, effect: PowerEffect, options: CopyAttackViaAbilityOptions): State;
