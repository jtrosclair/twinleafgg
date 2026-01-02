import { PokemonCard, Stage, StoreLike, State } from '../../game';
import { PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Ampharos extends PokemonCard {
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
        cost: import("../../game").CardType.LIGHTNING[];
        damage: number;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly UNSEEN_FLASH_MARKER = "UNSEEN_FLASH_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
