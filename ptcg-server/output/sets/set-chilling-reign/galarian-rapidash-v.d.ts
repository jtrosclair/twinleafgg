import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Effect } from '../../game/store/effects/effect';
export declare class GalarianRapidashV extends PokemonCard {
    regulationMark: string;
    tags: CardTag[];
    stage: Stage;
    cardType: import("../../game").CardType.PSYCHIC;
    hp: number;
    weakness: {
        type: import("../../game").CardType.DARK;
    }[];
    resistance: {
        type: import("../../game").CardType.FIGHTING;
        value: number;
    }[];
    retreat: import("../../game").CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: import("../../game").CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: import("../../game").CardType.PSYCHIC[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
