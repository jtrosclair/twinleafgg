import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { State, StoreLike } from '../../game';
export declare class Dratini extends PokemonCard {
    stage: Stage;
    cardType: CardType;
    hp: number;
    weakness: {
        type: CardType.COLORLESS;
    }[];
    resistance: ({
        type: CardType.GRASS;
        value: number;
    } | {
        type: CardType.FIGHTING;
        value: number;
    })[];
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: CardType.COLORLESS[];
        damage: number;
        text: string;
        damageCaclulation?: undefined;
    } | {
        name: string;
        cost: (CardType.WATER | CardType.LIGHTNING)[];
        damage: number;
        damageCaclulation: string;
        text: string;
    })[];
    set: string;
    cardImage: string;
    setNumber: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
