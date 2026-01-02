import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Galvantula extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.LIGHTNING;
    additionalCardTypes: import("../../game").CardType.GRASS[];
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    resistance: {
        type: import("../../game").CardType.METAL;
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
        cost: import("../../game").CardType.LIGHTNING[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly ELECTROWEB_MARKER: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
