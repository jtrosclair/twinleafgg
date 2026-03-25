import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, CardType, Stage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class Magmar extends PokemonCard {
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
        damageCalculation: string;
        text: string;
    } | {
        name: string;
        cost: (CardType.FIRE | CardType.COLORLESS)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
