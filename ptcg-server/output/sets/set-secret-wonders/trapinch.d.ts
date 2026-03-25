import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Trapinch extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.FIGHTING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
        value: number;
    }[];
    resistance: {
        type: import("../../game").CardType.LIGHTNING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: import("../../game").CardType.FIGHTING[];
        damage: number;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
