import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Uxie extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.PSYCHIC;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: CardType.PSYCHIC[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly MEMORY_SKIP_MARKER = "UXIE_FLI_MEMORY_SKIP_MARKER";
    readonly CLEAR_MEMORY_SKIP_MARKER = "UXIE_FLI_CLEAR_MEMORY_SKIP_MARKER";
    blockedAttackName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
