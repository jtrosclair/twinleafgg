import { State, StoreLike } from '../../game';
import { Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
export declare class Yanmega extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    hp: number;
    cardType: import("../../game").CardType.GRASS;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    retreat: never[];
    attacks: {
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
    }[];
    set: string;
    name: string;
    fullName: string;
    cardImage: string;
    setNumber: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
