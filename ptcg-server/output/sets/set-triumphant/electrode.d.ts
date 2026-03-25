import { PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Electrode extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.LIGHTNING;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIGHTING;
    }[];
    resistance: {
        type: import("../../game").CardType.METAL;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.LIGHTNING | import("../../game").CardType.COLORLESS)[];
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
