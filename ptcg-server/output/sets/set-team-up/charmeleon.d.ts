import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Charmeleon extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    cardType: import("../../game").CardType.FIRE;
    hp: number;
    weakness: {
        type: import("../../game").CardType.WATER;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.FIRE[];
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
