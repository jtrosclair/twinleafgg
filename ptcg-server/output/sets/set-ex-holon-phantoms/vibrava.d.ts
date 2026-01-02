import { CardTag, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Vibrava extends PokemonCard {
    cardType: import("../../game").CardType.GRASS;
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
    attacks: ({
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (import("../../game").CardType.GRASS | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
