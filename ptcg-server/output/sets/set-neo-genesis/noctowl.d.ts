import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Noctowl extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.COLORLESS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    retreat: any[];
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
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly GAZE_MARKER = "GAZE_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
