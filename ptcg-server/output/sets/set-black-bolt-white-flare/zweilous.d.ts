import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Zweilous extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.DARK;
    hp: number;
    weakness: {
        type: import("../../game").CardType.GRASS;
    }[];
    resistance: any[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (import("../../game").CardType.DARK | import("../../game").CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    regulationMark: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
