import { CardTag, Stage, State, StoreLike } from '../../game';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class CramorantV extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    retreat: import("../../game").CardType.COLORLESS[];
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
