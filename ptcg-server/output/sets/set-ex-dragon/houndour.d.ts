import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Houndour extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.DARK;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    resistance: {
        type: import("../../game").CardType.PSYCHIC;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
