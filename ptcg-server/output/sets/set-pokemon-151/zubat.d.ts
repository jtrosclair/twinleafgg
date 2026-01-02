import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Zubat extends PokemonCard {
    stage: Stage;
    cardType: import("../../game").CardType.DARK;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        powerType: PowerType;
        useWhenInPlay: boolean;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    regulationMark: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly REVEALING_ECHO_MARKER = "REVEALING_ECHO_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
