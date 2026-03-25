import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/game-effects';
import { State, StoreLike } from '../../game';
export declare class MegaHeracrossex extends PokemonCard {
    stage: Stage;
    tags: CardTag[];
    cardType: import("../../game").CardType.GRASS;
    hp: number;
    weakness: {
        type: import("../../game").CardType.FIRE;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.GRASS[];
        damage: number;
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: import("../../game").CardType.GRASS[];
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
