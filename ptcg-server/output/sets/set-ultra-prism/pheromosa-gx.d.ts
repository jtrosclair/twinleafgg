import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class PheromosaGx extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.FIRE;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        canUseOnFirstTurn: boolean;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        text: string;
        canUseOnFirstTurn?: undefined;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.GRASS[];
        damage: number;
        damageCalculation: "x";
        text: string;
        canUseOnFirstTurn?: undefined;
    })[];
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
