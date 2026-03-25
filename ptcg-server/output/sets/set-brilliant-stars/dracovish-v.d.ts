import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
export declare class DracovishV extends PokemonCard {
    tags: CardTag[];
    stage: Stage;
    cardType: CardType;
    hp: number;
    retreat: CardType.COLORLESS[];
    attacks: ({
        name: string;
        cost: (CardType.GRASS | CardType.WATER)[];
        damage: number;
        damageCalculation: "+";
        text: string;
    } | {
        name: string;
        cost: (CardType.GRASS | CardType.WATER)[];
        damage: number;
        text: string;
        damageCalculation?: undefined;
    })[];
    regulationMark: string;
    set: string;
    setNumber: string;
    cardImage: string;
    name: string;
    fullName: string;
    reduceEffect(store: StoreLike, state: State, effect: Effect): State;
}
