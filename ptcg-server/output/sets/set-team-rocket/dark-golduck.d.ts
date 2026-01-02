import { PokemonCard, Stage, StoreLike, State, CardTag } from '../../game';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
export declare class DarkGolduck extends PokemonCard {
    stage: Stage;
    evolvesFrom: string;
    tags: CardTag[];
    cardType: import("../../game").CardType.WATER;
    hp: number;
    weakness: {
        type: import("../../game").CardType.LIGHTNING;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: Attack[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
