import { PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Venomoth extends PokemonCard {
    cardType: import("../../game").CardType.GRASS;
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    retreat: never[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    } | {
        name: string;
        cost: import("../../game").CardType.GRASS[];
        damage: number;
        text: string;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    usedPoisonPowder: boolean;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
