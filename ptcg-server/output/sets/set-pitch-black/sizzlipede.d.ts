import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Sizzlipede extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.WATER;
    }[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.FIRE[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    } | {
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        damageCalculation: string;
        text: string;
    })[];
    set: string;
    setNumber: string;
    regulationMark: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
