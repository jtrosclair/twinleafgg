import { CardTag, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Flygon extends PokemonCard {
    cardType: import("../../game").CardType.GRASS;
    additionalCardTypes: import("../../game").CardType.METAL[];
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    hp: number;
    weakness: {
        type: import("../../game").CardType.COLORLESS;
    }[];
    resistance: ({
        type: import("../../game").CardType.LIGHTNING;
        value: number;
    } | {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    })[];
    retreat: import("../../game").CardType.COLORLESS[];
    powers: {
        name: string;
        useWhenInPlay: boolean;
        powerType: PowerType;
        text: string;
    }[];
    attacks: {
        name: string;
        cost: (import("../../game").CardType.GRASS | import("../../game").CardType.METAL | import("../../game").CardType.COLORLESS)[];
        damage: number;
        shredAttack: boolean;
        text: string;
    }[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    readonly DELTA_SUPPLY_MARKER = "DELTA_SUPPLY_MARKER";
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
